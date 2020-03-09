/**
 * Internal dependencies
 */
import { withoutHttp } from 'lib/url';
import getRawSite from 'state/selectors/get-raw-site';
import getSiteOption from 'state/sites/selectors/get-site-option';
import getSiteSlug from 'state/sites/selectors/get-site-slug';
import isSiteConflicting from 'state/sites/selectors/is-site-conflicting';

import 'state/sites/init';

/**
 * Returns the domain for a site, or null if the site is unknown.
 *
 * @param  {object}  state  Global state tree
 * @param  {number}  siteId Site ID
 * @returns {?string}        Site domain
 */
export default function getSiteDomain( state, siteId ) {
	if ( getSiteOption( state, siteId, 'is_redirect' ) || isSiteConflicting( state, siteId ) ) {
		return getSiteSlug( state, siteId );
	}

	const site = getRawSite( state, siteId );

	if ( ! site ) {
		return null;
	}

	return withoutHttp( site.URL );
}
