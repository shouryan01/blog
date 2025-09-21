'use client';

import Cookies from 'js-cookie';
import { useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useAppContext } from './contexts/appContext';

// Type declaration for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
const GA_TRACKING_ID = 'G-72XG3F8LNJ'; // This is Hashnode's GA tracking ID
const isProd = process.env.NODE_ENV === 'production';
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_URL || '';

export const Analytics = () => {
	const { publication, post, page } = useAppContext();

	const _sendPageViewsToHashnodeGoogleAnalytics = useCallback(() => {
		if (typeof window === 'undefined') return;

		const gaTrackingID = publication?.integrations?.gaTrackingID;
		if (!gaTrackingID) return;

		window.gtag('js', new Date().toISOString());
		window.gtag('config', gaTrackingID);
	}, [publication?.integrations?.gaTrackingID]);

	const _sendViewsToHashnodeInternalAnalytics = useCallback(() => {
		if (typeof window === 'undefined') return;

		const gaTrackingID = publication?.integrations?.gaTrackingID;
		if (!gaTrackingID) return;

		const userID = Cookies.get('userID');
		if (!userID) {
			Cookies.set('userID', uuidv4(), {
				expires: 365,
				secure: true,
				sameSite: 'strict',
			});
		}

		window.gtag('config', gaTrackingID, {
			transport_url: 'https://ping.hashnode.com',
			first_party_collection: true,
		});
	}, [publication?.integrations?.gaTrackingID]);

	const _sendViewsToAdvancedAnalyticsDashboard = useCallback(async () => {
		const publicationId = publication?.id;
		const postId = post?.id;
		const staticPageId = page?.id;

		const data = {
			publicationId,
			postId,
			staticPageId,
		};

		if (!publicationId) {
			console.warn('Publication ID is missing; could not send analytics.');
			return;
		}

		const isBrowser = typeof window !== 'undefined';
		if (!isBrowser) {
			return;
		}

		const isLocalhost = window.location.hostname === 'localhost';
		if (isLocalhost) {
			console.warn(
				'Analytics API call is skipped because you are running on localhost; data:',
				data,
			);
			return;
		}

		const event = {
			// timestamp will be added in API
			payload: {
				publicationId,
				postId: postId || null,
				seriesId: null,
				pageId: staticPageId || null,
				url: window.location.href,
				referrer: document.referrer || null,
				language: navigator.language || null,
				screen: `${window.screen.width}x${window.screen.height}`,
			},
			type: 'pageview',
		};

		const blob = new Blob(
			[
				JSON.stringify({
					events: [event],
				}),
			],
			{
				type: 'application/json; charset=UTF-8',
			},
		);

		let hasSentBeacon = false;
		try {
			if (navigator.sendBeacon) {
				hasSentBeacon = navigator.sendBeacon(`${BASE_PATH}/api/analytics`, blob);
			}
		} catch (error) {
			// do nothing; in case there is an error we fall back to fetch
		}

		if (!hasSentBeacon) {
			fetch(`${BASE_PATH}/api/analytics`, {
				method: 'POST',
				body: blob,
				credentials: 'omit',
				keepalive: true,
			});
		}
	}, [publication?.id, post?.id, page?.id]);

	useEffect(() => {
		if (!isProd) return;

		_sendPageViewsToHashnodeGoogleAnalytics();
		_sendViewsToHashnodeInternalAnalytics();
		_sendViewsToAdvancedAnalyticsDashboard();
	}, [
		_sendPageViewsToHashnodeGoogleAnalytics,
		_sendViewsToHashnodeInternalAnalytics,
		_sendViewsToAdvancedAnalyticsDashboard,
	]);

	return null;
};
