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
					'The BlockCard component allows to display a card which contains the title of a block, its icon and its description.',
			},
			canvas: { sourceState: 'shown' },
		},
	},
	argTypes: {
		title: {
			control: 'text',
			description: 'The title of the block',
			table: {
				type: { summary: 'string' },
			},
		},
		description: {
			control: 'text',
			description: 'A description of the block functionality',
			table: {
				type: { summary: 'string' },
			},
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
			table: {
				type: { summary: 'string' },
			},
		},
		className: {
			control: 'text',
			description: 'Additional CSS class names',
			table: {
				type: { summary: 'string' },
			},
		},
	},
};

export default meta;

/**
 * Default story shows the basic BlockCard with title, icon, name and description.
 */
export const Default = {
	args: {
		title: 'Paragraph',
		icon: paragraph,
		description: 'This is a paragraph block description.',
		name: 'Paragraph Block',
	},
};
