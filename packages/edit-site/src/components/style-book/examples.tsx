/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	getBlockType,
	getBlockTypes,
	getBlockFromExample,
	createBlock,
} from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import type { BlockExample, ColorOrigin, MultiOriginPalettes } from './types';
import ColorExamples from './color-examples';
import DuotoneExamples from './duotone-examples';
import { STYLE_BOOK_COLOR_GROUPS } from './constants';

/**
 * Returns examples color examples for each origin
 * e.g. Core (Default), Theme, and User.
 *
 * @param {MultiOriginPalettes} colors Global Styles color palettes per origin.
 * @return {BlockExample[]} An array of color block examples.
 */
function getColorExamples( colors: MultiOriginPalettes ): BlockExample[] {
	if ( ! colors ) {
		return [];
	}

	const examples: BlockExample[] = [];

	STYLE_BOOK_COLOR_GROUPS.forEach( ( group ) => {
		const palette = colors[ group.type ].find(
			( origin: ColorOrigin ) => origin.slug === group.origin
		);

		if ( palette?.[ group.type ] ) {
			const example: BlockExample = {
				name: group.slug,
				title: group.title,
				category: 'colors',
			};
			if ( group.type === 'duotones' ) {
				example.content = (
					<DuotoneExamples duotones={ palette[ group.type ] } />
				);
				examples.push( example );
			} else {
				example.content = (
					<ColorExamples
						colors={ palette[ group.type ] }
						type={ group.type }
					/>
				);
				examples.push( example );
			}
		}
	} );

	return examples;
}

/**
 * Returns examples for the landing page.
 *
 * @param {MultiOriginPalettes} colors Global Styles color palettes per origin.
 * @return {BlockExample[]} An array of block examples.
 */
function getLandingBlockExamples(
	colors: MultiOriginPalettes
): BlockExample[] {
	const examples: BlockExample[] = [];

	// Get theme palette from colors.
	const themePalette = colors.colors.find(
		( origin: ColorOrigin ) => origin.slug === 'theme'
	);

	if ( themePalette ) {
		const themeColorexample: BlockExample = {
			name: 'theme-colors',
			title: __( 'Colors' ),
			category: 'landing',
			content: (
				<ColorExamples colors={ themePalette.colors } type={ colors } />
			),
		};

		examples.push( themeColorexample );
	}

	const headingBlock = createBlock( 'core/heading', {
		content: __(
			`AaBbCcDdEeFfGgHhiiJjKkLIMmNnOoPpQakRrssTtUuVVWwXxxYyZzOl23356789X{(…)},2!*&:/A@HELFO™`
		),
		level: 1,
	} );
	const firstParagraphBlock = createBlock( 'core/paragraph', {
		content: __(
			`A paragraph in a website refers to a distinct block of text that is used to present and organize information. It is a fundamental unit of content in web design and is typically composed of a group of related sentences or thoughts focused on a particular topic or idea. Paragraphs play a crucial role in improving the readability and user experience of a website. They break down the`
		),
	} );
	const secondParagraphBlock = createBlock( 'core/paragraph', {
		content: __(
			`text into smaller, manageable chunks, allowing readers to scan and comprehend the content more easily. Additionally, paragraphs help structure the flow of information and provide logical breaks between different concepts or pieces of information. In terms of formatting, paragraphs in websites are commonly denoted by a vertical gap or indentation between each block`
		),
	} );

	const textExample = {
		name: 'theme-text',
		title: __( 'Text' ),
		category: 'landing',
		blocks: [
			headingBlock,
			createBlock(
				'core/group',
				{
					layout: {
						type: 'grid',
						columnCount: 2,
						minimumColumnWidth: '12rem',
					},
					style: {
						spacing: {
							blockGap: '1.5rem',
						},
					},
				},
				[ firstParagraphBlock, secondParagraphBlock ]
			),
		],
	};
	examples.push( textExample );

	const otherBlockExamples = [
		'core/image',
		'core/separator',
		'core/buttons',
		'core/pullquote',
		'core/search',
	];

	// Get examples for other blocks and put them in order of above array.
	otherBlockExamples.forEach( ( blockName ) => {
		const blockType = getBlockType( blockName );
		if ( blockType && blockType.example ) {
			const blockExample: BlockExample = {
				name: blockName,
				title: blockType.title,
				category: 'landing',
				blocks: getBlockFromExample( blockName, blockType.example ),
			};
			examples.push( blockExample );
		}
	} );

	return examples;
}

/**
 * Returns a list of examples for registered block types.
 *
 * @param {MultiOriginPalettes} colors Global styles colors grouped by origin e.g. Core, Theme, and User.
 * @return {BlockExample[]} An array of block examples.
 */
export function getExamples( colors: MultiOriginPalettes ): BlockExample[] {
	const nonHeadingBlockExamples = getBlockTypes()
		.filter( ( blockType ) => {
			const { name, example, supports } = blockType;
			return (
				name !== 'core/heading' &&
				!! example &&
				supports?.inserter !== false
			);
		} )
		.map( ( blockType ) => ( {
			name: blockType.name,
			title: blockType.title,
			category: blockType.category,
			blocks: getBlockFromExample( blockType.name, blockType.example ),
		} ) );
	const isHeadingBlockRegistered = !! getBlockType( 'core/heading' );

	if ( ! isHeadingBlockRegistered ) {
		return nonHeadingBlockExamples;
	}

	// Use our own example for the Heading block so that we can show multiple
	// heading levels.
	const headingsExample = {
		name: 'core/heading',
		title: __( 'Headings' ),
		category: 'text',
		blocks: [ 1, 2, 3, 4, 5, 6 ].map( ( level ) => {
			return createBlock( 'core/heading', {
				content: sprintf(
					// translators: %d: heading level e.g: "1", "2", "3"
					__( 'Heading %d' ),
					level
				),
				level,
			} );
		} ),
	};
	const colorExamples = getColorExamples( colors );

	const landingBlockExamples = getLandingBlockExamples( colors );

	return [
		headingsExample,
		...colorExamples,
		...nonHeadingBlockExamples,
		...landingBlockExamples,
	];
}
