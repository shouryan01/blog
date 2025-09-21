'use client';

import { useEffect } from 'react';
import { useAppContext } from './contexts/appContext';

export function Integrations() {
	const { publication } = useAppContext();
	const {
		gaTrackingID,
		fbPixelID,
		hotjarSiteID,
		matomoURL,
		matomoSiteID,
		fathomSiteID,
		fathomCustomDomain,
		plausibleAnalyticsEnabled,
	} = publication.integrations ?? {};

	// Add error handling for URL parsing
	let domainURL = '';
	try {
		if (publication.url) {
			domainURL = new URL(publication.url).hostname;
		}
	} catch (error) {
		console.warn('Failed to parse publication URL:', error);
	}

	let fbPixel = `
		!function(f,b,e,v,n,t,s)
		{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
		n.callMethod.apply(n,arguments):n.queue.push(arguments)};
		if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
		n.queue=[];t=b.createElement(e);t.async=!0;
		t.src=v;s=b.getElementsByTagName(e)[0];
		s.parentNode.insertBefore(t,s)}(window, document,'script',
		'https://connect.facebook.net/en_US/fbevents.js');
		fbq('init', '${fbPixelID}');
		fbq('track', 'PageView');`;

	const fathomScript = `
		(function(f, a, t, h, o, m){
			a[h]=a[h]||function(){
				(a[h].q=a[h].q||[]).push(arguments)
			};
			o=f.createElement('script'),
			m=f.getElementsByTagName('script')[0];
			o.async=1; o.src=t;
			o.id='fathom-script';
			m.parentNode.insertBefore(o,m)
		})(document, window, '${fathomCustomDomain || "https://cdn.usefathom.com/script.js"}', 'fathom');
		fathom('set', 'siteId', '${fathomSiteID}');
		fathom('trackPageview');`;

	const gTagManagerScript = `
		(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
		})(window,document,'script','dataLayer', '${gaTrackingID}');`;

	useEffect(() => {
		if (!gaTrackingID) return;

		window.gtag('config', gaTrackingID, {
			transport_url: 'https://ping.hashnode.com',
			first_party_collection: true,
		});
	}, [gaTrackingID]);

	return (
		<>
			{fbPixelID ? (
				<script type="text/javascript" dangerouslySetInnerHTML={{ __html: fbPixel }}></script>
			) : null}

			{fathomSiteID ? (
				<script type="text/javascript" dangerouslySetInnerHTML={{ __html: fathomScript }}></script>
			) : null}

			{plausibleAnalyticsEnabled ? (
				<script
					defer
					data-domain={domainURL}
					src="https://plausible.io/js/plausible.js"
				></script>
			) : null}

			{gaTrackingID ? (
				<script type="text/javascript" dangerouslySetInnerHTML={{ __html: gTagManagerScript }}></script>
			) : null}

			{hotjarSiteID ? (
				<script
					dangerouslySetInnerHTML={{
						__html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${hotjarSiteID},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
					}}
				/>
			) : null}

			{matomoURL && matomoSiteID ? (
				<script
					dangerouslySetInnerHTML={{
						__html: `
              var _paq = window._paq = window._paq || [];
              _paq.push(['trackPageView']);
              _paq.push(['enableLinkTracking']);
              (function() {
                var u="//${matomoURL}/";
                _paq.push(['setTrackerUrl', u+'matomo.php']);
                _paq.push(['setSiteId', '${matomoSiteID}']);
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
              })();
            `,
					}}
				/>
			) : null}
		</>
	);
}
