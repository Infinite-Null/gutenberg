/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import {
	__unstableMotion as motion,
	__unstableAnimatePresence as AnimatePresence,
	__unstableUseNavigateRegions as useNavigateRegions,
} from '@wordpress/components';
import {
	useReducedMotion,
	useViewportMatch,
	useResizeObserver,
} from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { store as keyboardShortcutsStore } from '@wordpress/keyboard-shortcuts';
import {
	CommandMenu,
	privateApis as commandsPrivateApis,
} from '@wordpress/commands';
import { store as preferencesStore } from '@wordpress/preferences';
import {
	privateApis as blockEditorPrivateApis,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { privateApis as coreCommandsPrivateApis } from '@wordpress/core-commands';
import { privateApis as editorPrivateApis } from '@wordpress/editor';

/**
 * Internal dependencies
 */
import ErrorBoundary from '../error-boundary';
import { store as editSiteStore } from '../../store';
import useInitEditedEntityFromURL from '../sync-state-with-url/use-init-edited-entity-from-url';
import SiteHub from '../site-hub';
import ResizableFrame from '../resizable-frame';
import useSyncCanvasModeWithURL from '../sync-state-with-url/use-sync-canvas-mode-with-url';
import { unlock } from '../../lock-unlock';
import SavePanel from '../save-panel';
import KeyboardShortcutsRegister from '../keyboard-shortcuts/register';
import KeyboardShortcutsGlobal from '../keyboard-shortcuts/global';
import { useCommonCommands } from '../../hooks/commands/use-common-commands';
import { useEditModeCommands } from '../../hooks/commands/use-edit-mode-commands';
import { useIsSiteEditorLoading } from './hooks';
import useLayoutAreas from './router';
import {
	default as useMovingAnimation,
	PrivateHeaderAnimationContext,
} from './animation';
import SidebarContent from '../sidebar';
import SaveHub from '../save-hub';
const { useCommands } = unlock( coreCommandsPrivateApis );
const { useCommandContext } = unlock( commandsPrivateApis );
const { useGlobalStyle } = unlock( blockEditorPrivateApis );
const { NavigableRegion } = unlock( editorPrivateApis );

const ANIMATION_DURATION = 0.3;

export default function Layout() {
	// This ensures the edited entity id and type are initialized properly.
	useInitEditedEntityFromURL();
	useSyncCanvasModeWithURL();
	useCommands();
	useEditModeCommands();
	useCommonCommands();

	const isMobileViewport = useViewportMatch( 'medium', '<' );

	const {
		isDistractionFree,
		isZoomOutMode,
		hasFixedToolbar,
		hasBlockSelected,
		canvasMode,
		previousShortcut,
		nextShortcut,
	} = useSelect( ( select ) => {
		const { getAllShortcutKeyCombinations } = select(
			keyboardShortcutsStore
		);
		const { getCanvasMode } = unlock( select( editSiteStore ) );
		return {
			canvasMode: getCanvasMode(),
			previousShortcut: getAllShortcutKeyCombinations(
				'core/edit-site/previous-region'
			),
			nextShortcut: getAllShortcutKeyCombinations(
				'core/edit-site/next-region'
			),
			hasFixedToolbar: select( preferencesStore ).get(
				'core',
				'fixedToolbar'
			),
			isDistractionFree: select( preferencesStore ).get(
				'core',
				'distractionFree'
			),
			isZoomOutMode:
				select( blockEditorStore ).__unstableGetEditorMode() ===
				'zoom-out',
			hasBlockSelected:
				select( blockEditorStore ).getBlockSelectionStart(),
		};
	}, [] );
	const navigateRegionsProps = useNavigateRegions( {
		previous: previousShortcut,
		next: nextShortcut,
	} );
	const disableMotion = useReducedMotion();
	const [ canvasResizer, canvasSize ] = useResizeObserver();
	const [ fullResizer ] = useResizeObserver();
	const isEditorLoading = useIsSiteEditorLoading();
	const [ isResizableFrameOversized, setIsResizableFrameOversized ] =
		useState( false );
	const { key: routeKey, areas, widths } = useLayoutAreas();
	const animationRef = useMovingAnimation( {
		triggerAnimationOnChange: canvasMode + '__' + routeKey,
	} );

	const [ headerAnimationState, setHeaderAnimationState ] =
		useState( canvasMode );

	useEffect( () => {
		if ( canvasMode === 'view' ) {
			// We need 'view' to always take priority so 'isDistractionFree'
			// doesn't bleed over into the view (sidebar) state
			setHeaderAnimationState( 'view' );
		} else if ( isDistractionFree ) {
			setHeaderAnimationState( 'isDistractionFree' );
		} else {
			setHeaderAnimationState( canvasMode ); // edit, view, init
		}
	}, [ canvasMode, isDistractionFree ] );

	// Sets the right context for the command palette
	let commandContext = 'site-editor';

	if ( canvasMode === 'edit' ) {
		commandContext = 'site-editor-edit';
	}
	if ( hasBlockSelected ) {
		commandContext = 'block-selection-edit';
	}
	useCommandContext( commandContext );

	const [ backgroundColor ] = useGlobalStyle( 'color.background' );
	const [ gradientValue ] = useGlobalStyle( 'color.gradient' );

	// Synchronizing the URL with the store value of canvasMode happens in an effect
	// This condition ensures the component is only rendered after the synchronization happens
	// which prevents any animations due to potential canvasMode value change.
	if ( canvasMode === 'init' ) {
		return null;
	}

	return (
		<>
			<CommandMenu />
			<KeyboardShortcutsRegister />
			<KeyboardShortcutsGlobal />
			{ fullResizer }
			<div
				{ ...navigateRegionsProps }
				ref={ navigateRegionsProps.ref }
				className={ classnames(
					'edit-site-layout',
					navigateRegionsProps.className,
					{
						'is-distraction-free':
							isDistractionFree && canvasMode === 'edit',
						'is-full-canvas': canvasMode === 'edit',
						'has-fixed-toolbar': hasFixedToolbar,
						'is-block-toolbar-visible': hasBlockSelected,
						'is-zoom-out': isZoomOutMode,
					}
				) }
			>
				<motion.div
					className="edit-site-layout__header-container"
					variants={ {
						isDistractionFree: {
							opacity: 0,
							transition: {
								type: 'tween',
								delay: 0.8,
								delayChildren: 0.8,
							}, // How long to wait before the header exits
						},
						isDistractionFreeHovering: {
							opacity: 1,
							transition: {
								type: 'tween',
								delay: 0.2,
								delayChildren: 0.2,
							}, // How long to wait before the header shows
						},
						view: { opacity: 1 },
						edit: { opacity: 1 },
					} }
					onHoverStart={ () => {
						if ( ! isDistractionFree ) {
							return;
						}

						setHeaderAnimationState( 'isDistractionFreeHovering' );
					} }
					onHoverEnd={ () => {
						if ( ! isDistractionFree ) {
							return;
						}

						setHeaderAnimationState( 'isDistractionFree' );
					} }
					animate={ headerAnimationState }
				>
					<SiteHub
						isTransparent={ isResizableFrameOversized }
						className="edit-site-layout__hub"
					/>
				</motion.div>

				<div className="edit-site-layout__content">
					{ /*
						The NavigableRegion must always be rendered and not use
						`inert` otherwise `useNavigateRegions` will fail.
					*/ }
					{ ( ! isMobileViewport || ! areas.mobile ) && (
						<NavigableRegion
							ariaLabel={ __( 'Navigation' ) }
							className="edit-site-layout__sidebar-region"
						>
							<AnimatePresence>
								{ canvasMode === 'view' && (
									<motion.div
										initial={ { opacity: 0 } }
										animate={ { opacity: 1 } }
										exit={ { opacity: 0 } }
										transition={ {
											type: 'tween',
											duration:
												// Disable transition in mobile to emulate a full page transition.
												disableMotion ||
												isMobileViewport
													? 0
													: ANIMATION_DURATION,
											ease: 'easeOut',
										} }
										className="edit-site-layout__sidebar"
									>
										<SidebarContent routeKey={ routeKey }>
											{ areas.sidebar }
										</SidebarContent>
										<SaveHub />
									</motion.div>
								) }
							</AnimatePresence>
						</NavigableRegion>
					) }

					{ isMobileViewport && areas.mobile && (
						<div className="edit-site-layout__mobile">
							{ areas.mobile }
						</div>
					) }

					{ ! isMobileViewport &&
						areas.content &&
						canvasMode !== 'edit' && (
							<div
								className="edit-site-layout__area"
								style={ {
									maxWidth: widths?.content,
								} }
							>
								{ areas.content }
							</div>
						) }

					{ ! isMobileViewport && areas.preview && (
						<div className="edit-site-layout__canvas-container">
							{ canvasResizer }
							{ !! canvasSize.width && (
								<div
									className={ classnames(
										'edit-site-layout__canvas',
										{
											'is-right-aligned':
												isResizableFrameOversized,
										}
									) }
									ref={ animationRef }
								>
									<ErrorBoundary>
										<PrivateHeaderAnimationContext.Provider
											value={ headerAnimationState }
										>
											<ResizableFrame
												isReady={ ! isEditorLoading }
												isFullWidth={
													canvasMode === 'edit'
												}
												defaultSize={ {
													width:
														canvasSize.width -
														24 /* $canvas-padding */,
													height: canvasSize.height,
												} }
												isOversized={
													isResizableFrameOversized
												}
												setIsOversized={
													setIsResizableFrameOversized
												}
												innerContentStyle={ {
													background:
														gradientValue ??
														backgroundColor,
												} }
											>
												{ areas.preview }
											</ResizableFrame>
										</PrivateHeaderAnimationContext.Provider>
									</ErrorBoundary>
								</div>
							) }
						</div>
					) }
				</div>

				<SavePanel />
			</div>
		</>
	);
}
