import { Container } from "../../components/container"
import { AppProvider } from "../../components/contexts/appContext"
import { Footer } from "../../components/footer";
import { Layout } from "../../components/layout"
import { Header } from "../../components/header";
import Link from "next/link";
import { Suspense } from "react";
import {
	PostsByPublicationDocument,
	PostsByPublicationQuery,
	PostsByPublicationQueryVariables,
	PageInfoFragment,
	PostFragment,
	PublicationFragment,
} from "../../generated/graphql";
import request from 'graphql-request';
import SearchAndListClient from './search-and-list-client';

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;

export default async function Blog() {
	// Fetch data
	const data = await request<PostsByPublicationQuery, PostsByPublicationQueryVariables>(
		GQL_ENDPOINT,
		PostsByPublicationDocument,
		{
			first: 20,
			host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
		},
	);

	const publication = data.publication;
	const initialPosts = data.publication?.posts?.edges?.map((edge) => edge.node) || [];
	const initialPageInfo = data.publication?.posts?.pageInfo || {
		__typename: 'PageInfo',
		endCursor: null,
		hasNextPage: false,
	};

	if (!publication) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Publication not found</h1>
					<p className="text-zinc-500 dark:text-zinc-400">Please check your configuration.</p>
				</div>
			</div>
		);
	}

	return (
		<AppProvider publication={publication}>
			<Layout publication={publication}>
				<Container className="mx-auto flex max-w-5xl flex-col items-stretch gap-10 px-5 py-10">
					<Header />

					{/* Blog title */}
					{/* <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
						Blog
					</h1> */}

					{/* Search + Posts (client) */}
					<Suspense fallback={<div className="text-zinc-500 dark:text-zinc-400">Loading...</div>}>
						<SearchAndListClient publication={publication} initialPosts={initialPosts} initialPageInfo={initialPageInfo} />
					</Suspense>
					{/* <div className="mt-6 flex justify-center">
						<Link
							href="/archive"
							className="text-zinc-700 hover:underline underline-offset-4 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
						>
							Archived Posts →
						</Link>
					</div> */}
					<Footer publication={publication} />
				</Container>
			</Layout>
		</AppProvider>
	);
}

