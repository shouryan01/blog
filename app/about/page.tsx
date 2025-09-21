import { Container } from '../../components/container';
import { Layout } from '../../components/layout';
import { PersonalHeader } from '../../components/personal-theme-header';
import { Footer } from '../../components/footer';
import { AppProvider } from '../../components/contexts/appContext';
import { PublicationFragment } from '../../generated/graphql';
import request from 'graphql-request';
import { PageByPublicationDocument } from '../../generated/graphql';
import { AboutClient } from './about-client';
import type { Metadata } from 'next';

export default async function About() {
  const data = await request(
    process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT!,
    PageByPublicationDocument,
    {
      slug: 'about',
      host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
    }
  );

  const publication = data.publication;
  const page = data.publication?.staticPage || null;

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
        <Container className="mx-auto flex max-w-3xl flex-col items-stretch gap-10 px-5 py-10">
          <PersonalHeader />
          <main>
            <h1 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">
              {page?.title || 'About'}
            </h1>
            <AboutClient page={page} />
          </main>
          <Footer publication={publication} />
        </Container>
      </Layout>
    </AppProvider>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await request(
    process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT!,
    PageByPublicationDocument,
    {
      slug: 'about',
      host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
    }
  );

  if (!data.publication) {
    return {
      title: 'About',
      description: 'About page',
    };
  }

  const staticPage = data.publication.staticPage;
  
  return {
    title: `About - ${data.publication.title}`,
    description: `About ${data.publication.title}`,
  };
}

export async function generateStaticParams() {
  return [{}];
}
