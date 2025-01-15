/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const {
		label,
		value,
		max = 100,
		backgroundColor,
		progressColor,
		height,
		showValue,
	} = attributes;

	const blockProps = useBlockProps.save( {
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
			<div className="wp-block-progress-bar__container">
				<div
					style={ {
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					} }
				>
					<RichText.Content
						tagName="p"
						className="wp-block-progress-bar__label"
						value={ label }
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
