const { GraphQLClient, gql } = require('graphql-request');

const ANALYTICS_BASE_URL = 'https://hn-ping2.hashnode.com';
const HASHNODE_ADVANCED_ANALYTICS_URL = 'https://user-analytics.hashnode.com';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;
const host = process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST;

const getBasePath = () => {
	if (BASE_URL && BASE_URL.indexOf('/') !== -1) {
		return BASE_URL.substring(BASE_URL.indexOf('/'));
	}
	return undefined;
};

const getRedirectionRules = async () => {
	const query = gql`
		query GetRedirectionRules {
			publication(host: "${host}") {
				id
				redirectionRules {
					source
					destination
					type
				}
			}
		}
  	`;

	try {
		const client = new GraphQLClient(GQL_ENDPOINT);
		const data = await client.request(query);

		if (!data.publication) {
			console.warn('No publication found for host:', host);
			return [];
		}

		const redirectionRules = data.publication.redirectionRules;

		// convert to next.js redirects format
		return redirectionRules
			.filter((rule) => rule.source.indexOf('*') === -1)
			.map((rule) => ({
				source: rule.source,
				destination: rule.destination,
				permanent: rule.type === 'PERMANENT',
			}));
	} catch (error) {
		console.error('Error fetching redirection rules:', error);
		return [];
	}
};

/**
 * @type {import('next').NextConfig}
 */
const config = {
	transpilePackages: [],
	basePath: getBasePath(),
	experimental: {
		scrollRestoration: true,
	},
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.hashnode.com',
			},
		],
	},
	async rewrites() {
		return [
			{
				source: '/ping/data-event',
				destination: `${ANALYTICS_BASE_URL}/api/data-event`,
			},
			{
				source: '/api/analytics',
				destination: `${HASHNODE_ADVANCED_ANALYTICS_URL}/api/analytics`,
			}
		];
	},
	async redirects() {
		return await getRedirectionRules();
	},
};

module.exports = config;
