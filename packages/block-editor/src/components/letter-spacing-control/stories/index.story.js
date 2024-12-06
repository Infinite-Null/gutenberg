/**
 * Internal dependencies
 */
import LetterSpacingControl from '../';

/**
 * The LetterSpacingControl component renders a UnitControl for entering a numeric value with a unit (e.g., px, rem).
 */
const meta = {
	title: 'BlockEditor/LetterSpacingControl',
	component: LetterSpacingControl,
	parameters: {
		docs: {
			canvas: { sourceState: 'shown' },
			description:
				'The `LetterSpacingControl` component renders a UnitControl that lets the user enter a numeric value and select a unit, for example px or rem.',
		},
	},
	argTypes: {
		onChange: {
			action: 'onChange',
			description: 'Function to be called when the value is changed',
			table: {
				type: {
					summary: 'function',
				},
			},
		},
		value: {
			control: {
				type: null,
			},
			table: {
				type: {
					summary: 'number',
				},
			},
			description: 'Letter spacing value in pixels, em, or rem.',
		},
		__next40pxDefaultSize: {
			control: {
				type: 'boolean',
			},
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
			control: {
				type: null,
			},
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
 * Default story shows the LetterSpacingControl.
 */
export const Default = {
	args: {
		value: 10,
	},
};
