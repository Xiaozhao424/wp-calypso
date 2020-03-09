/**
 * Internal dependencies
 */
import getSitePlan from 'state/sites/selectors/get-site-plan';

import 'state/sites/init';

/**
 * Returns true if site is currently subscribed to supplied plan and false otherwise.
 *
 * @param  {object}   state         Global state tree
 * @param  {number}   siteId        Site ID
 * @param  {number}   planProductId Plan product_id
 * @returns {?boolean}               Whether site's plan matches supplied plan
 */
export default function isCurrentSitePlan( state, siteId, planProductId ) {
	if ( planProductId === undefined ) {
		return null;
	}

	const sitePlan = getSitePlan( state, siteId );

	if ( ! sitePlan ) {
		return null;
	}

	return sitePlan.product_id === planProductId;
}
