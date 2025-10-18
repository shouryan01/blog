'use client';

import Link from 'next/link';
import { HistorySVG } from './icons/svgs';

export function HistoryFilter() {
  return (
    <Link
      href="/archive"
      className="flex items-center justify-center h-8 w-8 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
      title="View Archive"
    >
      <HistorySVG className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
    </Link>
  );
}
