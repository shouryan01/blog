'use client';

import { useState } from 'react';
import { request } from 'graphql-request';
import { PublicationFragment } from '../../generated/graphql';
import { useRouter, useSearchParams } from 'next/navigation';

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_HASHNODE_GQL_ENDPOINT!;

interface SearchResult {
  id: string;
  title: string;
  brief: string;
  slug: string;
  publishedAt: string;
  url: string;
  coverImage?: {
    url: string;
  };
}

interface SearchResponse {
  searchPostsOfPublication: {
    edges: Array<{
      node: SearchResult;
    }>;
  };
}

interface Props {
  publication: PublicationFragment;
}

export function SearchClient({ publication }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchError, setSearchError] = useState<string | undefined>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsLoading(true);
      setSearchError(undefined);

      try {
        const searchData = await request<SearchResponse>(
          GQL_ENDPOINT,
          `
          query SearchPosts($filter: SearchPostsOfPublicationFilter!, $first: Int!) {
            searchPostsOfPublication(filter: $filter, first: $first) {
              edges {
                node {
                  id
                  title
                  brief
                  slug
                  publishedAt
                  url
                  coverImage {
                    url
                  }
                }
              }
            }
          }
          `,
          {
            filter: {
              publicationId: publication.id,
              query: searchQuery.trim(),
            },
            first: 10,
          }
        );

        const newResults = searchData.searchPostsOfPublication.edges.map((edge) => edge.node);
        setSearchResults(newResults);

        // Update URL
        const params = new URLSearchParams(searchParams?.toString());
        params.set('q', searchQuery.trim());
        router.push(`/search?${params.toString()}`);
      } catch (err) {
        setSearchError(err instanceof Error ? err.message : 'An error occurred');
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {/* Search Form */}
      <div className="mb-12 text-center">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-white">Search Articles</h1>
        <form onSubmit={handleSearch}>
          <div className="relative mx-auto max-w-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type to search..."
              className="w-full rounded-full border border-zinc-200 bg-white px-6 py-3 pr-12 text-lg focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-blue-500 dark:text-zinc-500 dark:hover:text-blue-400 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-500"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {searchError && (
        <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
          {searchError}
        </div>
      )}

      {/* Search Results */}
      {searchQuery && !searchError && searchResults.length > 0 && (
        <div className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for &ldquo;{searchQuery}&rdquo;
        </div>
      )}

      <div className="space-y-4">
        {searchResults.map((result) => (
          <article key={result.id} className="group flex items-baseline justify-between gap-2 py-2">
            <h2 className="text-lg font-medium">
              <a
                href={result.url}
                className="text-zinc-900 hover:text-blue-600 dark:text-zinc-200 dark:hover:text-blue-400"
              >
                {result.title}
              </a>
            </h2>
            <time
              dateTime={result.publishedAt}
              className="shrink-0 text-sm text-zinc-600 dark:text-zinc-400"
            >
              {new Date(result.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </article>
        ))}
      </div>

      {/* No Results */}
      {searchQuery && !searchError && searchResults.length === 0 && !isLoading && (
        <div className="text-center text-zinc-600 dark:text-zinc-400">
          No results found for &ldquo;{searchQuery}&rdquo;
        </div>
      )}
    </>
  );
}
