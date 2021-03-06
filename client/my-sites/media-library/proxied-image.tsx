/**
 * External dependencies
 */
import React, { useEffect, useState } from 'react';

/**
 * Internal dependencies
 */
import debugFactory from 'debug';
import wpcom from 'lib/wp';

const debug = debugFactory( 'calypso:my-sites:media-library:proxied-image' );
const { Blob } = globalThis; // The linter complains if I don't do this...?

type RenderedComponentProps = {
	src: string;
	[ key: string ]: any;
};
export type RenderedComponent = string | React.ComponentType< RenderedComponentProps >;

interface Props {
	query: string;
	filePath: string;
	siteSlug: string;
	placeholder: React.ReactNode | null;
	component: RenderedComponent;

	[ key: string ]: any;
}

const cache: { [ key: string ]: Blob } = {};
const cacheResponse = ( requestId: string, blob: Blob, freshness = 60000 ) => {
	// Cache at most 100 items
	const cacheKeys = Object.keys( cache );
	if ( cacheKeys.length > 100 ) {
		delete cache[ cacheKeys[ 0 ] ];
	}

	cache[ requestId ] = blob;

	// Self-remove this entry after `freshness` ms
	setTimeout( () => {
		delete cache[ requestId ];
	}, freshness );
};

const ProxiedImage: React.FC< Props > = function ProxiedImage( {
	siteSlug,
	filePath,
	query,
	placeholder,
	component: Component,
	...rest
} ) {
	const [ imageObjectUrl, setImageObjectUrl ] = useState< string >( '' );
	const requestId = `media-library-proxied-image-${ siteSlug }${ filePath }${ query }`;

	useEffect( () => {
		if ( ! imageObjectUrl ) {
			if ( cache[ requestId ] ) {
				const url = URL.createObjectURL( cache[ requestId ] );
				setImageObjectUrl( url );
				debug( 'set image from cache', { url } );
			} else {
				debug( 'requesting image from API', { requestId, imageObjectUrl } );
				wpcom
					.undocumented()
					.getAtomicSiteMediaViaProxyRetry(
						siteSlug,
						filePath,
						query,
						( err: Error, data: Blob | null ) => {
							if ( data instanceof Blob ) {
								cacheResponse( requestId, data );
								setImageObjectUrl( URL.createObjectURL( data ) );
								debug( 'got image from API', { requestId, imageObjectUrl, data } );
							}
						}
					);
			}
		}

		return () => {
			if ( imageObjectUrl ) {
				debug( 'Cleared blob from memory on dismount: ' + imageObjectUrl );
				URL.revokeObjectURL( imageObjectUrl );
			}
		};
	}, [ imageObjectUrl, filePath, requestId, siteSlug ] );

	if ( ! imageObjectUrl ) {
		return placeholder as React.ReactElement;
	}

	/* eslint-disable-next-line jsx-a11y/alt-text */
	return <Component src={ imageObjectUrl } { ...rest } />;
};

ProxiedImage.defaultProps = {
	placeholder: null,
};

export default ProxiedImage;
