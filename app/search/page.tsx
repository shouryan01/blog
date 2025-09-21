import { Container } from '../../components/container';
import { Layout } from '../../components/layout';
import { AppProvider } from '../../components/contexts/appContext';
import { request } from 'graphql-request';
import { PublicationFragment } from '../../generated/graphql';
import { SearchClient } from './search-client';
import type { Metadata } from 'next';

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT!;

export default async function Search() {
  // Fetch publication data
  const data = await request<{
    publication: PublicationFragment | null;
  }>(
    GQL_ENDPOINT,
    `
    query GetPublication($host: String!) {
      publication(host: $host) {
        id
        title
        descriptionSEO
        author {
          name
          profilePicture
        }
        links {
          twitter
          github
          linkedin
          website
          hashnode
        }
      }
    }
    `,
    {
      host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
    }
  );

  const publication = data.publication;

  if (!publication) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Publication not found</h1>
          <p className="text-slate-500 dark:text-slate-400">Please check your configuration.</p>
        </div>
      </div>
    );
  }

  return (
    <AppProvider publication={publication}>
      <Layout publication={publication}>
        <Container className="mx-auto max-w-2xl px-5 py-10">
          <SearchClient publication={publication} />
        </Container>
      </Layout>
    </AppProvider>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await request<{
    publication: { title: string; descriptionSEO: string | null } | null;
  }>(
    GQL_ENDPOINT,
    `
    query GetPublication($host: String!) {
      publication(host: $host) {
        title
        descriptionSEO
      }
    }
    `,
    {
      host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
    }
  );

  const publication = data.publication;

  if (!publication) {
    return {
      title: 'Search',
      description: 'Search articles',
    };
  }

  return {
    title: `Search - ${publication.title}`,
    description: `Search articles from ${publication.title}`,
  };
}
