/**
 * WordPress dependencies
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function LoginOutEdit( { attributes, setAttributes } ) {
	const { displayLoginAsForm, redirectToCurrent, loginText, logoutText } =
		attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Settings' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Display login as form' ) }
						checked={ displayLoginAsForm }
						onChange={ () =>
							setAttributes( {
								displayLoginAsForm: ! displayLoginAsForm,
							} )
						}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Redirect to current URL' ) }
						checked={ redirectToCurrent }
						onChange={ () =>
							setAttributes( {
								redirectToCurrent: ! redirectToCurrent,
							} )
						}
					/>
					<TextControl
						label={ __( 'Login Text' ) }
						value={ loginText }
						onChange={ ( value ) =>
							setAttributes( { loginText: value } )
						}
						placeholder={ __( 'Enter login text' ) }
						help={ __( 'Customize the text for the login.' ) }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<TextControl
						label={ __( 'Logout Text' ) }
						value={ logoutText }
						onChange={ ( value ) =>
							setAttributes( { logoutText: value } )
						}
						placeholder={ __( 'Enter logout text' ) }
						help={ __( 'Customize the text for the logout.' ) }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
			<div
				{ ...useBlockProps( {
					className: 'logged-in',
				} ) }
			>
				<a href="#login-pseudo-link">{ logoutText }</a>
			</div>
		</>
	);
}
