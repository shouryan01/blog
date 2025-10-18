import { Container } from '../../../components/container';
import { Layout } from '../../../components/layout';
import { Header } from '../../../components/header';
import { Footer } from '../../../components/footer';
import { AppProvider } from '../../../components/contexts/appContext';
import { PostFragment, PublicationFragment, PostsByPublicationQuery, PostsByPublicationQueryVariables } from '../../../generated/graphql';
import request from 'graphql-request';
import { PostsByPublicationDocument } from '../../../generated/graphql';
import Link from 'next/link';
import { DateFormatter } from '../../../components/date-formatter';
import type { Metadata } from 'next';

export default async function TagPosts({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

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

  // 过滤出包含当前标签的文章
  const taggedPosts = allPosts.filter(
    post => post.tags?.some(t => t.slug === slug)
  ).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // 找到标签名称
  let tagName = '';
  allPosts.some(post => {
    const tag = post.tags?.find(t => t.slug === slug);
    if (tag) {
      tagName = tag.name;
      return true;
    }
    return false;
  });

  return (
    <AppProvider publication={publication}>
      <Layout publication={publication}>
        <Container className="mx-auto flex max-w-5xl flex-col items-stretch gap-10 px-5 py-10">
          <Header />
          <div className="mb-6">
            <Link
              href="/tags"
              className="inline-flex hover:underline items-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
            >

              ← All Tags
            </Link>
          </div>
          <main>
            <div className="mb-8 flex items-baseline gap-4">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                {tagName || slug}
              </h1>
              <span className="text-base text-zinc-500 dark:text-zinc-400">
                {taggedPosts.length} {taggedPosts.length === 1 ? 'post' : 'posts'}
              </span>
            </div>
            <div className="space-y-8">
              {taggedPosts.map((post) => (
                <article key={post.id} className="flex flex-col space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <Link
                      href={`/${post.slug}`}
                      className="text-lg font-medium text-zinc-900 hover:text-pink-500/90 dark:text-white"
                    >
                      {post.title}
                    </Link>
                    <time
                      dateTime={post.publishedAt}
                      className="shrink-0 text-sm text-zinc-500 dark:text-zinc-400"
                    >
                      <DateFormatter dateString={post.publishedAt} formatStr="MMM d, yyyy" />
                    </time>
                  </div>
                  {post.brief && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{post.brief}</p>
                  )}
                </article>
              ))}
              {taggedPosts.length === 0 && (
                <p className="text-center text-zinc-500 dark:text-zinc-400">
                  No posts found with this tag.
                </p>
              )}
            </div>
          </main>
          {/* <Footer publication={publication} /> */}
        </Container>
      </Layout>
    </AppProvider>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
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
      title: 'Tag Not Found',
      description: 'The requested tag could not be found.',
    };
  }

  // 找到标签名称
  let tagName = '';
  data.publication.posts.edges.some(edge => {
    const tag = edge.node.tags?.find(t => t.slug === slug);
    if (tag) {
      tagName = tag.name;
      return true;
    }
    return false;
  });

  if (!tagName) {
    return {
      title: 'Tag Not Found',
      description: 'The requested tag could not be found.',
    };
  }

  return {
    title: `${tagName} - ${data.publication.title}`,
    description: `Posts tagged with ${tagName} on ${data.publication.title}`,
  };
}

export async function generateStaticParams() {
  // Fetch all posts using pagination (max 50 per request)
  const allPosts: PostFragment[] = [];
  let hasNextPage = true;
  let after: string | undefined = undefined;

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

    if (!data.publication) {
      return [];
    }

    const posts = data.publication?.posts?.edges?.map((edge) => edge.node) || [];
    allPosts.push(...posts);

    hasNextPage = data.publication?.posts?.pageInfo?.hasNextPage || false;
    after = data.publication?.posts?.pageInfo?.endCursor || undefined;
  }

  // 提取所有唯一的标签 slug
  const slugs = new Set<string>();
  allPosts.forEach(post => {
    post.tags?.forEach(tag => {
      slugs.add(tag.slug);
    });
  });

  return Array.from(slugs).map(slug => ({
    slug,
  }));
}
