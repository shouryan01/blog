import { getSitemap } from '../../utils/seo/sitemap';
import { request as gqlRequest } from 'graphql-request';
import {
	MoreSitemapPostsDocument,
	MoreSitemapPostsQuery,
	MoreSitemapPostsQueryVariables,
	SitemapDocument,
	SitemapQuery,
	SitemapQueryVariables,
} from '../../generated/graphql';
import { NextRequest, NextResponse } from 'next/server';

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;
const MAX_POSTS = 1000;

export async function GET(request: NextRequest) {
	const initialData = await gqlRequest<SitemapQuery, SitemapQueryVariables>(
		GQL_ENDPOINT,
		SitemapDocument,
		{
			host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
			postsCount: 20,
			staticPagesCount: 50,
		},
	);

	const publication = initialData.publication;
	if (!publication) {
		return new NextResponse('Publication not found', { status: 404 });
	}
	const posts = publication.posts.edges.map((edge) => edge.node);

	// Get more posts by pagination if exists
	const initialPageInfo = publication.posts.pageInfo;
	const fetchPosts = async (after: string | null | undefined) => {
		const variables = {
			host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
			postsCount: 20,
			postsAfter: after,
		};

		const data = await gqlRequest<MoreSitemapPostsQuery, MoreSitemapPostsQueryVariables>(
			GQL_ENDPOINT,
			MoreSitemapPostsDocument,
			variables,
		);
		const publication = data.publication;
		if (!publication) {
			return;
		}
		const pageInfo = publication.posts.pageInfo;

		posts.push(...publication.posts.edges.map((edge) => edge.node));

		if (pageInfo.hasNextPage && posts.length < MAX_POSTS) {
			await fetchPosts(pageInfo.endCursor);
		}
	};

	if (initialPageInfo.hasNextPage) {
		await fetchPosts(initialPageInfo.endCursor);
	}

	const xml = getSitemap({
		...publication,
		posts,
	});

	return new NextResponse(xml, {
		headers: {
			'Content-Type': 'text/xml',
			'Cache-Control': 's-maxage=1, stale-while-revalidate',
		},
	});
}
