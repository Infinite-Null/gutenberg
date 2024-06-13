/**
 * External dependencies
 */
import { deepSignal } from 'deepsignal';
import { computed } from '@preact/signals';

/**
 * Internal dependencies
 */
import { getScope, getNamespace, setNamespace, resetNamespace } from './hooks';
import { withScope } from './utils';

const isObject = ( item: unknown ): item is Record< string, unknown > =>
	Boolean( item && typeof item === 'object' && item.constructor === Object );

const deepMerge = ( target: any, source: any ) => {
	if ( isObject( target ) && isObject( source ) ) {
		for ( const key in source ) {
			const getter = Object.getOwnPropertyDescriptor( source, key )?.get;
			if ( typeof getter === 'function' ) {
				Object.defineProperty( target, key, { get: getter } );
			} else if ( isObject( source[ key ] ) ) {
				if ( ! target[ key ] ) {
					target[ key ] = {};
				}
				deepMerge( target[ key ], source[ key ] );
			} else {
				try {
					target[ key ] = source[ key ];
				} catch ( e ) {
					// Assignemnts fail for properties that are only getters.
					// When that's the case, the assignment is simply ignored.
				}
			}
		}
	}
};

export const stores = new Map();
const rawStores = new Map();
const storeLocks = new Map();
const storeConfigs = new Map();

const objToProxy = new WeakMap();
const proxyToNs = new WeakMap();
const scopeToGetters = new WeakMap();

const proxify = ( obj: any, ns: string ) => {
	if ( ! objToProxy.has( obj ) ) {
		const proxy = new Proxy( obj, handlers );
		objToProxy.set( obj, proxy );
		proxyToNs.set( proxy, ns );
	}
	return objToProxy.get( obj );
};

const handlers = {
	get: ( target: any, key: string | symbol, receiver: any ) => {
		const ns = proxyToNs.get( receiver );

		// Check if the property is a getter and we are inside an scope. If that is
		// the case, we clone the getter to avoid overwriting the scoped
		// dependencies of the computed each time that getter runs.
		const getter = Object.getOwnPropertyDescriptor( target, key )?.get;
		if ( getter ) {
			const scope = getScope();
			if ( scope ) {
				const getters =
					scopeToGetters.get( scope ) ||
					scopeToGetters.set( scope, new Map() ).get( scope );
				if ( ! getters.has( getter ) ) {
					setNamespace( ns );

					getters.set(
						getter,
						computed( withScope( () => getter.call( target ) ) )
					);

					resetNamespace();
				}
				return getters.get( getter ).value;
			}
		}

		const result = Reflect.get( target, key );

		// Check if the proxy is the store root and no key with that name exist. In
		// that case, return an empty object for the requested key.
		if ( typeof result === 'undefined' && receiver === stores.get( ns ) ) {
			const obj = {};
			Reflect.set( target, key, obj );
			return proxify( obj, ns );
		}

		// Check if the property is a function. If it is, add the store
		// namespace to the stack and wrap the function with the current scope.
		// The `withScope` util handles both synchronous functions and generator
		// functions.
		if ( typeof result === 'function' ) {
			setNamespace( ns );
			const scoped = withScope( result );
			resetNamespace();
			return scoped;
		}

		// Check if the property is an object. If it is, proxyify it.
		if ( isObject( result ) ) {
			return proxify( result, ns );
		}

		return result;
	},
	// Prevents passing the current proxy as the receiver to the deepSignal.
	set( target: any, key: string, value: any ) {
		return Reflect.set( target, key, value );
	},
};

/**
 * Get the defined config for the store with the passed namespace.
 *
 * @param namespace Store's namespace from which to retrieve the config.
 * @return Defined config for the given namespace.
 */
export const getConfig = ( namespace?: string ) =>
	storeConfigs.get( namespace || getNamespace() ) || {};

interface StoreOptions {
	/**
	 * Property to block/unblock private store namespaces.
	 *
	 * If the passed value is `true`, it blocks the given namespace, making it
	 * accessible only trough the returned variables of the `store()` call. In
	 * the case a lock string is passed, it also blocks the namespace, but can
	 * be unblocked for other `store()` calls using the same lock string.
	 *
	 * @example
	 * ```
	 * // The store can only be accessed where the `state` const can.
	 * const { state } = store( 'myblock/private', { ... }, { lock: true } );
	 * ```
	 *
	 * @example
	 * ```
	 * // Other modules knowing `SECRET_LOCK_STRING` can access the namespace.
	 * const { state } = store(
	 *   'myblock/private',
	 *   { ... },
	 *   { lock: 'SECRET_LOCK_STRING' }
	 * );
	 * ```
	 */
	lock?: boolean | string;
}

export const universalUnlock =
	'I acknowledge that using a private store means my plugin will inevitably break on the next store release.';

/**
 * Extends the Interactivity API global store adding the passed properties to
 * the given namespace. It also returns stable references to the namespace
 * content.
 *
 * These props typically consist of `state`, which is the reactive part of the
 * store ― which means that any directive referencing a state property will be
 * re-rendered anytime it changes ― and function properties like `actions` and
 * `callbacks`, mostly used for event handlers. These props can then be
 * referenced by any directive to make the HTML interactive.
 *
 * @example
 * ```js
 *  const { state } = store( 'counter', {
 *    state: {
 *      value: 0,
 *      get double() { return state.value * 2; },
 *    },
 *    actions: {
 *      increment() {
 *        state.value += 1;
 *      },
 *    },
 *  } );
 * ```
 *
 * The code from the example above allows blocks to subscribe and interact with
 * the store by using directives in the HTML, e.g.:
 *
 * ```html
 * <div data-wp-interactive="counter">
 *   <button
 *     data-wp-text="state.double"
 *     data-wp-on--click="actions.increment"
 *   >
 *     0
 *   </button>
 * </div>
 * ```
 * @param namespace The store namespace to interact with.
 * @param storePart Properties to add to the store namespace.
 * @param options   Options for the given namespace.
 *
 * @return A reference to the namespace content.
 */
export function store< S extends object = {} >(
	namespace: string,
	storePart?: S,
	options?: StoreOptions
): S;

export function store< T extends object >(
	namespace: string,
	storePart?: T,
	options?: StoreOptions
): T;

export function store(
	namespace: string,
	{ state = {}, ...block }: any = {},
	{ lock = false }: StoreOptions = {}
) {
	if ( ! stores.has( namespace ) ) {
		// Lock the store if the passed lock is different from the universal
		// unlock. Once the lock is set (either false, true, or a given string),
		// it cannot change.
		if ( lock !== universalUnlock ) {
			storeLocks.set( namespace, lock );
		}
		const rawStore = {
			state: deepSignal( isObject( state ) ? state : {} ),
			...block,
		};
		const proxiedStore = new Proxy( rawStore, handlers );
		rawStores.set( namespace, rawStore );
		stores.set( namespace, proxiedStore );
		proxyToNs.set( proxiedStore, namespace );
	} else {
		// Lock the store if it wasn't locked yet and the passed lock is
		// different from the universal unlock. If no lock is given, the store
		// will be public and won't accept any lock from now on.
		if ( lock !== universalUnlock && ! storeLocks.has( namespace ) ) {
			storeLocks.set( namespace, lock );
		} else {
			const storeLock = storeLocks.get( namespace );
			const isLockValid =
				lock === universalUnlock ||
				( lock !== true && lock === storeLock );

			if ( ! isLockValid ) {
				if ( ! storeLock ) {
					throw Error( 'Cannot lock a public store' );
				} else {
					throw Error(
						'Cannot unlock a private store with an invalid lock code'
					);
				}
			}
		}

		const target = rawStores.get( namespace );
		deepMerge( target, block );
		deepMerge( target.state, state );
	}

	return stores.get( namespace );
}

export const parseInitialData = ( dom = document ) => {
	const jsonDataScriptTag =
		// Preferred Script Module data passing form
		dom.getElementById(
			'wp-script-module-data-@wordpress/interactivity'
		) ??
		// Legacy form
		dom.getElementById( 'wp-interactivity-data' );
	if ( jsonDataScriptTag?.textContent ) {
		try {
			return JSON.parse( jsonDataScriptTag.textContent );
		} catch {}
	}
	return {};
};

export const populateInitialData = ( data?: {
	state?: Record< string, unknown >;
	config?: Record< string, unknown >;
} ) => {
	if ( isObject( data?.state ) ) {
		Object.entries( data!.state ).forEach( ( [ namespace, state ] ) => {
			store( namespace, { state }, { lock: universalUnlock } );
		} );
	}
	if ( isObject( data?.config ) ) {
		Object.entries( data!.config ).forEach( ( [ namespace, config ] ) => {
			storeConfigs.set( namespace, config );
		} );
	}
};

// Parse and populate the initial state and config.
const data = parseInitialData();
populateInitialData( data );
