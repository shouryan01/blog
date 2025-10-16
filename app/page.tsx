import request from 'graphql-request';
import { Container } from '../components/container';
import { AppProvider } from '../components/contexts/appContext';
import { Footer } from '../components/footer';
import { Layout } from '../components/layout';
import { Header } from '../components/header';
import AuthorLayout from '../components/author';
import { ZenProvider } from './zen-context';
import Main from './Main';
import { authorData } from '../data/author';
import {
	PostsByPublicationDocument,
	PostsByPublicationQuery,
	PostsByPublicationQueryVariables,
} from '../generated/graphql';

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT;

export default async function Index() {
	const data = await request<PostsByPublicationQuery, PostsByPublicationQueryVariables>(
		GQL_ENDPOINT,
		PostsByPublicationDocument,
		{
			first: 20,
			host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
		},
	);
	const publication = data.publication;
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
		<ZenProvider>
			<AppProvider publication={publication}>
				<Main>
					<Layout publication={publication}>
						<div className="min-h-screen bg-transparent">
							<Container className="mx-auto flex max-w-5xl flex-col items-stretch gap-10 px-5 py-10">
								<Header />
								<AuthorLayout content={authorData} publication={publication}/>
							</Container>
						</div>
					</Layout>
				</Main>
			</AppProvider>
		</ZenProvider>
	);
}
