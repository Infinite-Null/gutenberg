/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Progress Bar', () => {
	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.deleteAllPosts();
	} );

	test( 'should render progress bar with correct prefix symbol and value', async ( {
		editor,
		page,
	} ) => {
		await editor.insertBlock( { name: 'core/progress-bar' } );
		await page.getByLabel( 'Value Symbol' ).click();
		await page.getByLabel( 'Value Symbol' ).fill( '$' );
		await page.getByLabel( 'Symbol Position' ).selectOption( 'prefix' );

		const editorFrame = page
			.locator( 'iframe[name="editor-canvas"]' )
			.contentFrame();

		const progressBarValue = editorFrame
			.locator( '.wp-block-progress-bar__container > div > p' )
			.nth( 1 );

		await expect( progressBarValue ).toHaveText( '$50' );
	} );

	test( 'should apply custom background and progress colors', async ( {
		editor,
		page,
	} ) => {
		await editor.insertBlock( { name: 'core/progress-bar' } );

		await page.getByRole( 'button', { name: 'Background Color' } ).click();
		await page.getByLabel( 'Cyan bluish gray' ).click();
		await page.getByRole( 'button', { name: 'Progress Color' } ).click();
		await page.getByLabel( 'Vivid purple' ).click();

		const editorFrame = page
			.locator( 'iframe[name="editor-canvas"]' )
			.contentFrame();

		const barContainer = editorFrame.locator(
			'.wp-block-progress-bar__bar'
		);
		const progressBar = editorFrame.locator(
			'.wp-block-progress-bar__progress'
		);

		await expect( barContainer ).toHaveCSS(
			'background-color',
			'rgb(171, 184, 195)'
		);
		await expect( progressBar ).toHaveCSS(
			'background-color',
			'rgb(155, 81, 224)'
		);
	} );
} );
