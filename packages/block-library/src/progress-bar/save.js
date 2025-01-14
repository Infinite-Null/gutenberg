/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const {
		label,
		value,
		max = 100,
		backgroundColor,
		progressColor,
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: 'wp-block-progress-bar',
	} );

	// Calculate the percentage
	const percentage = Math.min( Math.max( ( value / max ) * 100, 0 ), 100 );

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
		width: `${ percentage }%`,
		height: '100%',
		transition: 'width 0.3s ease',
	};

	return (
		<div { ...blockProps }>
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
					<meter
						className="wp-block-progress-bar__meter"
						value={ value }
						max={ max }
						style={ {
							display: 'block',
							width: '100%',
							height: '100%',
							...progressStyle,
						} }
					>
						<div
							style={ progressStyle }
							className="wp-block-progress-bar__progress"
						>
							<span className="wp-block-progress-bar__value">
								{ percentage.toFixed( 1 ) }%
							</span>
						</div>
					</meter>
				</div>
			</div>
		</div>
	);
}
