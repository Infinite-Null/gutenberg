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
} );
