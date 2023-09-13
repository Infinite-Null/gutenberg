/**
 * External dependencies
 */
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Modal from '../';

const noop = () => {};

describe( 'Modal', () => {
	it( 'applies the aria-describedby attribute when provided', () => {
		render(
			<Modal
				aria={ { describedby: 'description-id' } }
				onRequestClose={ noop }
			>
				{ /* eslint-disable-next-line no-restricted-syntax */ }
				<p id="description-id">Description</p>
			</Modal>
		);
		expect( screen.getByRole( 'dialog' ) ).toHaveAttribute(
			'aria-describedby',
			'description-id'
		);
	} );

	it( 'applies the aria-labelledby attribute when provided', () => {
		render(
			<Modal aria={ { labelledby: 'title-id' } } onRequestClose={ noop }>
				{ /* eslint-disable-next-line no-restricted-syntax */ }
				<h1 id="title-id">Modal Title Text</h1>
			</Modal>
		);
		expect( screen.getByRole( 'dialog' ) ).toHaveAccessibleName(
			'Modal Title Text'
		);
	} );

	it( 'prefers the aria label of the title prop over the aria.labelledby prop', () => {
		render(
			<Modal
				title="Modal Title Attribute"
				aria={ { labelledby: 'title-id' } }
				onRequestClose={ noop }
			>
				{ /* eslint-disable-next-line no-restricted-syntax */ }
				<h1 id="title-id">Modal Title Text</h1>
			</Modal>
		);
		expect( screen.getByRole( 'dialog' ) ).toHaveAccessibleName(
			'Modal Title Attribute'
		);
	} );

	it( 'hides the header when the `__experimentalHideHeader` prop is used', () => {
		render(
			<Modal
				title="Test Title"
				__experimentalHideHeader
				onRequestClose={ noop }
			>
				<p>Modal content</p>
			</Modal>
		);
		const dialog = screen.getByRole( 'dialog' );
		const title = within( dialog ).queryByText( 'Test Title' );
		expect( title ).not.toBeInTheDocument();
	} );

	it( 'should call onRequestClose when the escape key is pressed', async () => {
		const user = userEvent.setup();
		const onRequestClose = jest.fn();
		render(
			<Modal onRequestClose={ onRequestClose }>
				<p>Modal content</p>
			</Modal>
		);
		await user.keyboard( '[Escape]' );
		expect( onRequestClose ).toHaveBeenCalled();
	} );

	it( 'should return focus when dismissed by clicking outside', async () => {
		const user = userEvent.setup();
		const ReturnDemo = () => {
			const [ isShown, setIsShown ] = useState( false );
			return (
				<div>
					<button onClick={ () => setIsShown( true ) }>📣</button>
					{ isShown && (
						<Modal onRequestClose={ () => setIsShown( false ) }>
							<p>Modal content</p>
						</Modal>
					) }
				</div>
			);
		};
		render( <ReturnDemo /> );

		const opener = screen.getByRole( 'button' );
		await user.click( opener );
		const modalFrame = screen.getByRole( 'dialog' );
		expect( modalFrame ).toHaveFocus();

		// Disable reason: No semantic query can reach the overlay.
		// eslint-disable-next-line testing-library/no-node-access
		await user.click( modalFrame.parentElement! );
		expect( opener ).toHaveFocus();
	} );

	it( 'should render `headerActions` React nodes', async () => {
		render(
			<Modal
				headerActions={ <button>A sweet button</button> }
				onRequestClose={ noop }
			>
				<p>Modal content</p>
			</Modal>
		);
		expect(
			screen.getByText( 'A sweet button', { selector: 'button' } )
		).toBeInTheDocument();
	} );

	describe( 'Focus handling', () => {
		it( 'should focus the first focusable element in the contents when `firstElement` passed as value for `focusOnMount` prop', async () => {
			const originalOffsetWidth = Object.getOwnPropertyDescriptor(
				HTMLElement.prototype,
				'offsetWidth'
			);

			const originalOffsetHeight = Object.getOwnPropertyDescriptor(
				HTMLElement.prototype,
				'offsetHeight'
			);

			const originalGetClientRects = Object.getOwnPropertyDescriptor(
				HTMLElement.prototype,
				'getClientRects'
			);

			/**
			 * The test environment does not have a layout engine, so we need to mock
			 * the offsetWidth, offsetHeight and getClientRects methods to return a
			 * value that is not 0. This ensures that the focusable elements can be
			 * found by the `focusOnMount` logic which depends on layout information
			 * to determine if the element is visible or not.
			 * See https://github.com/WordPress/gutenberg/blob/trunk/packages/dom/src/focusable.js#L55-L61.
			 */
			Object.defineProperty( HTMLElement.prototype, 'offsetWidth', {
				configurable: true,
				value: 100,
			} );

			Object.defineProperty( HTMLElement.prototype, 'offsetHeight', {
				configurable: true,
				value: 100,
			} );

			Object.defineProperty( HTMLElement.prototype, 'getClientRects', {
				configurable: true,
				value: () => [ 1, 2, 3 ],
			} );

			const user = userEvent.setup();
			const FocusMountDemo = () => {
				const [ isShown, setIsShown ] = useState( false );
				return (
					<>
						<button onClick={ () => setIsShown( true ) }>📣</button>
						{ isShown && (
							<Modal
								focusOnMount="firstElement"
								onRequestClose={ () => setIsShown( false ) }
							>
								<p>Modal content</p>
								<a
									href="https://wordpress.org"
									data-testid="button-with-focus"
								>
									Button
								</a>
							</Modal>
						) }
					</>
				);
			};
			render( <FocusMountDemo /> );

			const opener = screen.getByRole( 'button' );

			await user.click( opener );

			expect( screen.getByTestId( 'button-with-focus' ) ).toHaveFocus();

			// Restore original HTMLElement prototype
			Object.defineProperty( HTMLElement.prototype, 'offsetWidth', {
				configurable: true,
				value: originalOffsetWidth,
			} );

			Object.defineProperty( HTMLElement.prototype, 'offsetHeight', {
				configurable: true,
				value: originalOffsetHeight,
			} );

			Object.defineProperty( HTMLElement.prototype, 'getClientRects', {
				configurable: true,
				value: originalGetClientRects,
			} );
		} );
	} );
} );
