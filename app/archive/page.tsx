import { Container } from '../../components/container';
import { Layout } from '../../components/layout';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { AppProvider } from '../../components/contexts/appContext';
import { PostFragment, PublicationFragment, PostsByPublicationQuery, PostsByPublicationQueryVariables } from '../../generated/graphql';
import request from 'graphql-request';
import { PostsByPublicationDocument } from '../../generated/graphql';
import Link from 'next/link';
import { CollapsibleArchive } from './archive-client';
import type { Metadata } from 'next';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const groupPostsByYearAndMonth = (posts: PostFragment[]) => {
  const groups: Record<number, Record<number, PostFragment[]>> = {};

  posts.forEach(post => {
    const date = new Date(post.publishedAt);
    const year = date.getFullYear();
    const month = date.getMonth();

    if (!groups[year]) {
      groups[year] = {};
    }
    if (!groups[year][month]) {
      groups[year][month] = [];
    }
    groups[year][month].push(post);
  });

  Object.values(groups).forEach(yearGroup => {
    Object.values(yearGroup).forEach(posts => {
      posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    });
  });

  return Object.entries(groups)
    .map(([year, months]) => ({
      year: parseInt(year),
      months: Object.entries(months)
        .map(([month, posts]) => ({
          month: parseInt(month),
          monthName: MONTHS[parseInt(month)],
          posts,
          postCount: posts.length
        }))
        .sort((a, b) => b.month - a.month)
    }))
    .sort((a, b) => b.year - a.year);
};

export default async function Archive() {
  // Fetch all posts using pagination (max 50 per request)
  const allPosts: PostFragment[] = [];
  let hasNextPage = true;
  let after: string | undefined = undefined;
  let publication: PublicationFragment | null = null;

  while (hasNextPage) {
    const data: PostsByPublicationQuery = await request<PostsByPublicationQuery, PostsByPublicationQueryVariables>(
      process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT,
      PostsByPublicationDocument,
      {
        first: 50, // Maximum allowed by Hashnode API
        after,
        host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
      }
    );

    if (!publication) {
      publication = data.publication || null;
    }

    const posts = data.publication?.posts?.edges?.map((edge) => edge.node) || [];
    allPosts.push(...posts);

    hasNextPage = data.publication?.posts?.pageInfo?.hasNextPage || false;
    after = data.publication?.posts?.pageInfo?.endCursor || undefined;
  }

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

  const postsByYearAndMonth = groupPostsByYearAndMonth(allPosts);

  return (
    <AppProvider publication={publication}>
      <Layout publication={publication}>
        <Container className="mx-auto flex max-w-5xl flex-col items-stretch gap-10 px-5 py-10">
          <Header />

          <div className="mb-6">
            <Link
              href="/blog"
              className="inline-flex hover:underline items-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
            >
              ← Back to Blog
            </Link>
          </div>

          <main>
            <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-white">Archive</h1>
            <CollapsibleArchive
              postsByYearAndMonth={postsByYearAndMonth}
              publication={publication}
            />
          </main>
          <Footer publication={publication} />
        </Container>
      </Layout>
    </AppProvider>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const data: PostsByPublicationQuery = await request<PostsByPublicationQuery, PostsByPublicationQueryVariables>(
    process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT,
    PostsByPublicationDocument,
    {
      first: 0,
      host: process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_HOST,
    }
  );

  if (!data.publication) {
    return {
      title: 'Archive',
      description: 'Archive of all posts',
    };
  }

  return {
    title: `Archive - ${data.publication.title}`,
    description: `Archive of all posts from ${data.publication.title}`,
  };
}

export async function generateStaticParams() {
  return [{}];
}
