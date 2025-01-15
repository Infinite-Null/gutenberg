/**
 * WordPress dependencies
 */
import {
	InspectorControls,
	PanelColorSettings,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	RangeControl,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useToolsPanelDropdownMenuProps } from '../utils/hooks';

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

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Progress Bar Settings' ) }
					resetAll={ () => {
						setAttributes( {
							label: '',
							value: 50,
							max: 100,
							backgroundColor: '#f0f0f0',
							progressColor: '#1E1E1E',
							height: 11,
							showValue: true,
						} );
					} }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						label={ __( 'Progress Value' ) }
						isShownByDefault
						hasValue={ () => value !== 50 }
						onDeselect={ () => setAttributes( { value: 50 } ) }
					>
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
					</ToolsPanelItem>
					<ToolsPanelItem
						label={ __( 'Maximum Value' ) }
						isShownByDefault
						hasValue={ () => max !== 100 }
						onDeselect={ () => setAttributes( { max: 100 } ) }
					>
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
					</ToolsPanelItem>
					<ToolsPanelItem
						label={ __( 'Progress bar height' ) }
						isShownByDefault
						hasValue={ () => height !== 11 }
						onDeselect={ () => setAttributes( { height: 11 } ) }
					>
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
					</ToolsPanelItem>
					<ToolsPanelItem
						label={ __( 'Show value' ) }
						isShownByDefault
						hasValue={ () => ! showValue }
						onDeselect={ () =>
							setAttributes( { showValue: true } )
						}
					>
						<ToggleControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Show value' ) }
							checked={ showValue }
							onChange={ () =>
								setAttributes( { showValue: ! showValue } )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
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
