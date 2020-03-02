/**
 * External dependencies
 */
import { useSelector } from 'react-redux';
import { useTranslate } from 'i18n-calypso';
import React from 'react';

/**
 * Internal dependencies
 */
import { getSelectedSiteId } from 'state/ui/selectors';
import FormattedHeader from 'components/formatted-header';
import getRewindState from 'state/selectors/get-rewind-state';
import getRewindStateRequestStatus from 'state/selectors/get-rewind-state-request-status';
import QueryRewindState from 'components/data/query-rewind-state';
import ServerConnectionIndicator from '../../components/server-connection-indicator';
import ServerConnectionIndicatorPlaceholder from '../../components/server-connection-indicator/placeholder';
import getJetpackBackupPlan from 'state/sites/selectors/get-jetpack-backup-plan';

const SettingsPage = () => {
	const translate = useTranslate();
	const selectedSiteId = useSelector( getSelectedSiteId );
	const rewindStateRequestStatus = useSelector( state =>
		getRewindStateRequestStatus( state, selectedSiteId )
	);
	const rewindState = useSelector( state => getRewindState( state, selectedSiteId ) );
	const jetpackBackupPlan = useSelector( state => getJetpackBackupPlan( state, selectedSiteId ) );

	const isConnected = rewindState && rewindState.state === 'active';

	return (
		<div>
			{ selectedSiteId && <QueryRewindState siteId={ selectedSiteId } /> }

			<FormattedHeader
				align="left"
				headerText={ translate( 'Server connection details' ) }
				isSecondary
			/>
			{ jetpackBackupPlan !== null && rewindStateRequestStatus === 'success' ? (
				<ServerConnectionIndicator backupType={ jetpackBackupPlan } isConnected={ isConnected } />
			) : (
				<ServerConnectionIndicatorPlaceholder />
			) }
		</div>
	);
};

export default SettingsPage;
