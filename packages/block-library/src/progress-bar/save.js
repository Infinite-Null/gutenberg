/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
	const {
		label,
		value,
		max = 100,
		backgroundColor,
		progressColor,
		height,
		showValue,
		isReadProgress,
	} = attributes;

	// eslint-disable-next-line react-compiler/react-compiler
	const blockProps = useBlockProps.save( {
		className: 'wp-block-progress-bar',
	} );

	const progressBarStyle = {
		backgroundColor,
		height: `${ height }px`,
	};

	const progressStyle = {
		backgroundColor: progressColor,
		width: `${ ( value / max ) * 100 }%`,
	};

	const readProgressStyle = {
		backgroundColor: progressColor,
		height: `${ height }px`,
	};

	return (
		<div { ...blockProps }>
			<div className="wp-block-progress-bar__container">
				{ ! isReadProgress && (
					<div>
						<RichText.Content
							tagName="p"
							className="wp-block-progress-bar__label"
							value={ label }
						/>
						{ showValue && <p>{ value }%</p> }
					</div>
				) }
				<div
					style={ progressBarStyle }
					className={
						isReadProgress
							? 'wp-block-progress-bar__read-bar'
							: 'wp-block-progress-bar__bar'
					}
				>
					<div
						style={
							isReadProgress ? readProgressStyle : progressStyle
						}
						className={
							isReadProgress
								? 'wp-block-progress-bar__read-progress'
								: 'wp-block-progress-bar__progress'
						}
					></div>
				</div>
			</div>
		</div>
	);
}
