/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Notice } from '@wordpress/components';
import SidebarNavigationScreenMain from '../sidebar-navigation-screen-main';

export const notFoundRoute = {
	name: 'notfound',
	path: '*',
	areas: {
		sidebar: <SidebarNavigationScreenMain />,
		mobile: (
			<SidebarNavigationScreenMain
				customDescription={
					<Notice
						status="error"
						isDismissible={ false }
						className="edit-site-layout__area__404"
					>
						{ __(
							'The requested page could not be found. Please check the URL.'
						) }
					</Notice>
				}
			/>
		),
		content: (
			<Notice
				status="error"
				isDismissible={ false }
				className="edit-site-layout__area__404"
			>
				{ __(
					'The requested page could not be found. Please check the URL.'
				) }
			</Notice>
		),
	},
};
