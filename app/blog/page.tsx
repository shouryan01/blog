import { Container } from "../../components/container"
import { AppProvider } from "../../components/contexts/appContext"
import { Footer } from "../../components/footer";
import { Layout } from "../../components/layout"
import { Header } from "../../components/header";
import {
	PostsByPublicationDocument,
	PostsByPublicationQuery,
	PostsByPublicationQueryVariables,
	PageInfoFragment,
	PostFragment,
	PublicationFragment,
} from "../../generated/graphql";
import request from 'graphql-request';
import { HomeClient } from '../home-client';

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

					{/* Posts list */}
					<HomeClient
						initialPosts={initialPosts}
						initialPageInfo={initialPageInfo}
					/>
					{/* <Footer publication={publication} /> */}
				</Container>
			</Layout>
		</AppProvider>
	);
}

