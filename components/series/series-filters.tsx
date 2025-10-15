'use client';

import { useState, useEffect } from 'react';
import { SeriesFragment } from '../../generated/graphql';

type SortOption = 'newest' | 'oldest' | 'posts' | 'name';

type Props = {
  series: SeriesFragment[];
  onFilter: (filtered: SeriesFragment[]) => void;
};

export function SeriesFilters({ series, onFilter }: Props) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');

  useEffect(() => {
    let filtered = [...series];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchLower) ||
          s.description?.text?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sort) {
        case 'newest':
          return (
            new Date(b.posts.edges[0]?.node.publishedAt || 0).getTime() -
            new Date(a.posts.edges[0]?.node.publishedAt || 0).getTime()
          );
        case 'oldest':
          return (
            new Date(a.posts.edges[0]?.node.publishedAt || 0).getTime() -
            new Date(b.posts.edges[0]?.node.publishedAt || 0).getTime()
          );
        case 'posts':
          return b.posts.totalDocuments - a.posts.totalDocuments;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    onFilter(filtered);
  }, [series, search, sort, onFilter]);

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <input
          type="search"
          placeholder="Search series..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 pl-10 text-sm text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
        />
        <svg
          className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm text-zinc-600 dark:text-zinc-400">
          Sort by:
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="posts">Most posts</option>
          <option value="name">Name</option>
        </select>
      </div>
    </div>
  );
}
