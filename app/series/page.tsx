import { Container } from '../../components/container';
import { Layout } from '../../components/layout';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { AppProvider } from '../../components/contexts/appContext';
import { PublicationFragment, SeriesFragment } from '../../generated/graphql';
import request from 'graphql-request';
import { SeriesByPublicationDocument } from '../../generated/graphql';
import { SeriesClient } from './series-client';
import type { Metadata } from 'next';

export default async function SeriesIndex() {
  // Fetch data
  const data = await request(
    process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT,
    SeriesByPublicationDocument,
    {
      host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
    }
  );

  const publication = data.publication;
  const series = data.publication?.seriesList?.edges?.map((edge) => edge.node) || [];

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
        <Container className="mx-auto flex max-w-3xl flex-col items-stretch gap-10 px-5 py-10">
          <Header />
          <main>
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                Series
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {series.length} {series.length === 1 ? 'series' : 'series'}
              </p>
            </div>

            <SeriesClient series={series} />
          </main>
          <Footer publication={publication} />
        </Container>
      </Layout>
    </AppProvider>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await request(
    process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT,
    SeriesByPublicationDocument,
    {
      host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
    }
  );

  if (!data.publication) {
    return {
      title: 'Series',
      description: 'Article series',
    };
  }

  return {
    title: `Series - ${data.publication.title}`,
    description: `Article series from ${data.publication.title}`,
  };
}

export async function generateStaticParams() {
  return [{}];
}
