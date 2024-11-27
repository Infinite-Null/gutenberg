/**
 * External dependencies
 */
/**
 * Internal dependencies
 */
import LetterSpacingControl from '../';

/**
 * The `LetterSpacingControl` component renders a UnitControl that lets the user enter a numeric value and select a unit, for example px or rem.
 */
const meta = {
	title: 'BlockEditor/LetterSpacingControl',
	component: LetterSpacingControl,

	decorators: [ ( Story ) => <Story /> ],
	argTypes: {
		onChange: {
			action: 'onChange',
			description: 'Function to be called when the value is changed',
		},
		value: {
			control: 'number',
			description: 'Letter spacing value in pixels, em, or rem.',
		},
		__next40pxDefaultSize: {
			description:
				'Start opting into the larger default height for future versions.',
			table: {
				type: {
					summary: 'boolean',
				},
			},
		},
		__unstableInputWidth: {
			description:
				'Width of the input field for letter-spacing, defaults to 60px.',
			table: {
				type: {
					summary: 'string|number|undefined',
				},
			},
		},
	},
};

export default meta;

/**
 * Default story shows the basic LetterSpacingControl.
 */
export const Default = {
	args: {
		value: 10,
	},
};

/**
 * Demonstrates a LetterSpacingControl with unconstrained width.
 */
export const UnconstrainedWidth = {
	args: {
		...Default.args,
		__unstableInputWidth: '100%',
	},
};
