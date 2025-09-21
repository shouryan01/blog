import { constructRSSFeedFromPosts } from '../../utils/feed';
import { request as gqlRequest } from 'graphql-request';
import { RssFeedDocument, RssFeedQuery, RssFeedQueryVariables } from '../../generated/graphql';
import { NextRequest, NextResponse } from 'next/server';

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const after = searchParams.get('after');

	const data = await gqlRequest<RssFeedQuery, RssFeedQueryVariables>(GQL_ENDPOINT, RssFeedDocument, {
		first: 20,
		host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
		after,
	});

	const publication = data.publication;
	if (!publication) {
		return new NextResponse('Publication not found', { status: 404 });
	}
	const allPosts = publication.posts.edges.map((edge) => edge.node);

	const xml = constructRSSFeedFromPosts(
		publication,
		allPosts,
		after,
		publication.posts.pageInfo.hasNextPage && publication.posts.pageInfo.endCursor
			? publication.posts.pageInfo.endCursor
			: null,
	);

	return new NextResponse(xml, {
		headers: {
			'Content-Type': 'text/xml',
			'Cache-Control': 's-maxage=1, stale-while-revalidate',
		},
	});
}
