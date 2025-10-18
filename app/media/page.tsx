import { Container } from '../../components/container';
import { Layout } from '../../components/layout';
import { Header } from '../../components/header';
import { AppProvider } from '../../components/contexts/appContext';
import { PublicationFragment } from '../../generated/graphql';
import request from 'graphql-request';
import { PageByPublicationDocument } from '../../generated/graphql';
import type { Metadata } from 'next';
import Link from 'next/link';

export default async function Media() {
  const data = await request(
    process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT!,
    PageByPublicationDocument,
    {
      slug: 'about',
      host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
    }
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

  const mediaLinks = [
    {
      title: 'Books',
      url: 'https://app.thestorygraph.com/profile/shouryannikam',
      icon: '📚',
    },
    {
      title: 'Movies',
      url: 'https://letterboxd.com/snnikam01/films/',
      icon: '🎬',
    },
    {
      title: 'TV Shows',
      url: 'https://www.serializd.com/user/snnikam01/shows',
      icon: '📺',
    },
    {
      title: 'Video Games',
      url: 'https://backloggd.com/u/snnikam01/games/',
      icon: '🎮',
    },
  ];

  return (
    <AppProvider publication={publication}>
      <Layout publication={publication}>
        <Container className="mx-auto flex max-w-5xl flex-col items-stretch gap-10 px-5 py-10">
          <Header />
          <main>
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="flex flex-row gap-12 sm:gap-16 md:gap-20 lg:gap-24 xl:gap-28">
                {mediaLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative transition-transform duration-200 hover:scale-110 focus:outline-none"
                    aria-label={link.title}
                  >
                    <span
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
                      style={{ lineHeight: 1 }}
                    >
                      {link.icon}
                    </span>
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 rounded bg-zinc-800 px-2 py-1 text-sm whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:bg-zinc-200 dark:text-zinc-800">
                      {link.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </main>
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
      title: 'Media',
      description: 'Media page',
    };
  }

  return {
    title: `Media - ${data.publication.title}`,
    description: `Media - ${data.publication.title}`,
  };
}

export async function generateStaticParams() {
  return [{}];
}
