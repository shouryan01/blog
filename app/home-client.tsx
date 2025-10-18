'use client';

import { useState } from 'react';
import { Waypoint } from 'react-waypoint';
import { MinimalPosts } from '../components/minimal-posts';
import {
	MorePostsByPublicationDocument,
	MorePostsByPublicationQuery,
	MorePostsByPublicationQueryVariables,
	PageInfoFragment,
	PostFragment,
} from '../generated/graphql';
import request from 'graphql-request';

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;

type Props = {
    initialPosts: PostFragment[];
    initialPageInfo: PageInfoFragment;
    filterQuery?: string;
    filterTag?: string | null;
};

export function HomeClient({ initialPosts, initialPageInfo, filterQuery, filterTag }: Props) {
	const [posts, setPosts] = useState<PostFragment[]>(initialPosts);
	const [pageInfo, setPageInfo] = useState<PageInfoFragment>(initialPageInfo);
	const [loadedMore, setLoadedMore] = useState(false);

	const loadMore = async () => {
		const data = await request<MorePostsByPublicationQuery, MorePostsByPublicationQueryVariables>(
			GQL_ENDPOINT,
			MorePostsByPublicationDocument,
			{
				first: 20,
				host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
				after: pageInfo.endCursor,
			},
		);
		if (!data.publication) {
			return;
		}
		const newPosts = data.publication.posts.edges.map((edge) => edge.node);
		setPosts([...posts, ...newPosts]);
		setPageInfo(data.publication.posts.pageInfo);
		setLoadedMore(true);
	};

	const normalizedQuery = (filterQuery ?? '').trim().toLowerCase();
	let workingPosts = posts;

	// Filter by tag
	if (filterTag) {
		workingPosts = workingPosts.filter((post) =>
			post.tags?.some(tag => tag.slug === filterTag)
		);
	}

	// Filter by search query
	const filteredPosts = normalizedQuery
		? workingPosts.filter((post) => {
			const title = (post.title ?? '').toLowerCase();
			const brief = (post.brief ?? '').toLowerCase();
			return title.includes(normalizedQuery) || brief.includes(normalizedQuery);
		})
		: workingPosts;

	return (
		<>
			{filteredPosts.length > 0 && <MinimalPosts context="home" posts={filteredPosts} />}
			{!loadedMore && pageInfo.hasNextPage && pageInfo.endCursor && (
				<button onClick={loadMore}>
					Load more
				</button>
			)}
			{loadedMore && pageInfo.hasNextPage && pageInfo.endCursor && (
				<Waypoint onEnter={loadMore} bottomOffset={'10%'} />
			)}
		</>
	);
}
