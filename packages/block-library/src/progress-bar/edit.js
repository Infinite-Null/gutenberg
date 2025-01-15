/**
 * WordPress dependencies
 */
import {
	InspectorControls,
	PanelColorSettings,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const {
		label,
		value,
		max = 100,
		backgroundColor,
		progressColor,
		height,
		showValue,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-progress-bar',
	} );

	const progressBarStyle = {
		backgroundColor,
		overflow: 'hidden',
		height: `${ height }px`,
		position: 'relative',
	};

	const progressStyle = {
		backgroundColor: progressColor,
		width: `${ ( value / max ) * 100 }%`,
		height: '100%',
		transition: 'width 0.3s ease',
	};

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Progress Bar Settings' ) }>
					<RangeControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Progress Value' ) }
						value={ value }
						onChange={ ( currentValue ) =>
							setAttributes( { value: currentValue } )
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
							setAttributes( { max: maxValue } )
						}
						min={ 1 }
						max={ 1000 }
					/>
					<RangeControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Progress bar height' ) }
						help={ __( 'Height in pixels' ) }
						value={ height }
						onChange={ ( heightValue ) =>
							setAttributes( { height: heightValue } )
						}
						min={ 6 }
						max={ 30 }
					/>
					<ToggleControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Show value' ) }
						checked={ showValue }
						onChange={ () =>
							setAttributes( { showValue: ! showValue } )
						}
					/>
				</PanelBody>
				<PanelColorSettings
					title={ __( 'Color Settings' ) }
					colorSettings={ [
						{
							value: backgroundColor,
							onChange: ( bgColor ) =>
								setAttributes( { backgroundColor: bgColor } ),
							label: __( 'Background Color' ),
						},
						{
							value: progressColor,
							onChange: ( progressBarColor ) =>
								setAttributes( {
									progressColor: progressBarColor,
								} ),
							label: __( 'Progress Color' ),
						},
					] }
				/>
			</InspectorControls>

			<div className="wp-block-progress-bar__container">
				<div
					style={ {
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					} }
				>
					<RichText
						identifier="value"
						tagName="p"
						className="wp-block-progress-bar__label"
						value={ label }
						onChange={ ( content ) =>
							setAttributes( { label: content } )
						}
						placeholder={ __( 'Write heading…' ) }
					/>
					{ showValue && <p>{ value }%</p> }
				</div>
				<div
					style={ progressBarStyle }
					className="wp-block-progress-bar__bar"
				>
					<div
						style={ progressStyle }
						className="wp-block-progress-bar__progress"
					></div>
				</div>
			</div>
		</div>
	);
}
