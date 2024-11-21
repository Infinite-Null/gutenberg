/**
 * WordPress dependencies
 */
import { box, button, cog, paragraph } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import BlockCard from '../';

/**
 * BlockCard component displays information about a block including its icon, title, and description.
 */
const meta = {
	title: 'BlockEditor/BlockCard',
	component: BlockCard,
	parameters: {
		docs: {
			description: {
				component:
					'BlockCard component displays block information, including icon, title, and description.',
			},
			canvas: { sourceState: 'shown' },
		},
	},
	decorators: [ ( Story ) => <Story /> ],
	argTypes: {
		title: {
			control: 'text',
			description: 'The title of the block',
		},
		description: {
			control: 'text',
			description: 'A description of the block functionality',
		},
		icon: {
			control: 'select',
			options: [ 'paragraph', 'cog', 'box', 'button' ],
			mapping: {
				paragraph,
				cog,
				box,
				button,
			},
			description: 'The icon to display for the block',
		},
		name: {
			control: 'text',
			description: 'Optional custom name for the block',
		},
		className: {
			control: 'text',
			description: 'Additional CSS class names',
		},
	},
};

export default meta;

/**
 * Default story shows the basic BlockCard with title, icon and description.
 */
export const Default = {
	args: {
		title: 'Paragraph',
		icon: paragraph,
		description: 'Start with the building block of all narrative.',
	},
};

/**
 * This story demonstrates the BlockCard with a name.
 */
export const Name = {
	args: {
		...Default.args,
		name: 'Custom Name',
	},
};

/**
 * This story demonstrates the BlockCard with a description.
 */
export const Description = {
	args: {
		...Default.args,
		description:
			'Start with the building block of all narrative. Paragraph is a good block for text-heavy content.',
	},
};

/**
 * This story demonstrates the BlockCard with a icon
 */
export const Icon = {
	args: {
		...Default.args,
		icon: box,
		title: 'Box Icon',
	},
};

export const Title = {
	args: {
		...Default.args,
		title: 'A Custom Title',
	},
};
