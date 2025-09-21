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
};

export function HomeClient({ initialPosts, initialPageInfo }: Props) {
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

	return (
		<>
			{posts.length > 0 && <MinimalPosts context="home" posts={posts} />}
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
