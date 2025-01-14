/**
 * WordPress dependencies
 */
import {
	InspectorControls,
	PanelColorSettings,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const {
		label,
		value,
		max = 100,
		backgroundColor,
		progressColor,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-progress-bar',
	} );

	// Custom styles for the progress bar
	const progressBarStyle = {
		backgroundColor: backgroundColor || '#f0f0f0',
		borderRadius: '4px',
		overflow: 'hidden',
		height: '24px',
		position: 'relative',
	};

	const progressStyle = {
		backgroundColor: progressColor || '#4CAF50',
		width: `${ ( value / max ) * 100 }%`,
		height: '100%',
		transition: 'width 0.3s ease',
	};

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Progress Bar Settings' ) }>
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Label' ) }
						value={ label || '' }
						onChange={ ( labelText ) =>
							setAttributes( { labelText } )
						}
					/>
					<RangeControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Progress Value' ) }
						value={ value }
						onChange={ ( currentValue ) =>
							setAttributes( { currentValue } )
						}
						min={ 0 }
						max={ max }
					/>
					<RangeControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Maximum Value' ) }
						value={ max }
						onChange={ ( maxValue ) =>
							setAttributes( { maxValue } )
						}
						min={ 1 }
						max={ 1000 }
					/>
				</PanelBody>
				<PanelColorSettings
					title={ __( 'Color Settings' ) }
					colorSettings={ [
						{
							value: backgroundColor,
							onChange: ( bgColor ) =>
								setAttributes( { bgColor } ),
							label: __( 'Background Color' ),
						},
						{
							value: progressColor,
							onChange: ( progressBarColor ) =>
								setAttributes( { progressBarColor } ),
							label: __( 'Progress Color' ),
						},
					] }
				/>
			</InspectorControls>

			<div className="wp-block-progress-bar__container">
				{ label && (
					<div className="wp-block-progress-bar__label">
						{ label }
					</div>
				) }
				<div
					style={ progressBarStyle }
					className="wp-block-progress-bar__bar"
				>
					<div
						style={ progressStyle }
						className="wp-block-progress-bar__progress"
					>
						<span className="wp-block-progress-bar__value">
							{ value }%
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
