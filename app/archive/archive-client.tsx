'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PostFragment, PublicationFragment } from '../../generated/graphql';
import { DateFormatter } from '../../components/date-formatter';
import ChevronDownSVG from '../../components/icons/svgs/ChevronDownSVG';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface CollapsibleArchiveProps {
  postsByYearAndMonth: Array<{
    year: number;
    months: Array<{
      month: number;
      monthName: string;
      posts: PostFragment[];
      postCount: number;
    }>;
  }>;
  publication: PublicationFragment;
}

export function CollapsibleArchive({ postsByYearAndMonth, publication }: CollapsibleArchiveProps) {
  const [collapsedYears, setCollapsedYears] = useState<Set<number>>(new Set());
  const [collapsedMonths, setCollapsedMonths] = useState<Set<string>>(new Set());

  const toggleYear = (year: number) => {
    const newCollapsedYears = new Set(collapsedYears);
    if (newCollapsedYears.has(year)) {
      newCollapsedYears.delete(year);
    } else {
      newCollapsedYears.add(year);
    }
    setCollapsedYears(newCollapsedYears);
  };

  const toggleMonth = (year: number, month: number) => {
    const key = `${year}-${month}`;
    const newCollapsedMonths = new Set(collapsedMonths);
    if (newCollapsedMonths.has(key)) {
      newCollapsedMonths.delete(key);
    } else {
      newCollapsedMonths.add(key);
    }
    setCollapsedMonths(newCollapsedMonths);
  };

  const isYearCollapsed = (year: number) => collapsedYears.has(year);
  const isMonthCollapsed = (year: number, month: number) => collapsedMonths.has(`${year}-${month}`);

  return (
    <div className="space-y-12">
      {postsByYearAndMonth.map(({ year, months }) => (
        <section key={year}>
          <button
            onClick={() => toggleYear(year)}
            className="mb-6 flex w-full items-center justify-between text-left text-2xl font-bold text-zinc-900 dark:text-white hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            <span>{year}</span>
            <ChevronDownSVG
              className={`h-5 w-5 transition-transform duration-200 ${
                isYearCollapsed(year) ? '-rotate-90' : 'rotate-0'
              }`}
            />
          </button>

          {!isYearCollapsed(year) && (
            <div className="space-y-8">
              {months.map(({ month, monthName, posts, postCount }) => (
                <div key={month} className="space-y-3">
                  <button
                    onClick={() => toggleMonth(year, month)}
                    className="flex w-full items-center justify-between text-left text-lg font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                  >
                    <span>
                      {monthName} <span className="text-zinc-500">({postCount})</span>
                    </span>
                    <ChevronDownSVG
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isMonthCollapsed(year, month) ? '-rotate-90' : 'rotate-0'
                      }`}
                    />
                  </button>

                  {!isMonthCollapsed(year, month) && (
                    <ul className="space-y-4">
                      {posts.map((post) => (
                        <li key={post.id} className="group">
                          <Link
                            href={`/${post.slug}`}
                            className="flex flex-col space-y-1"
                          >
                            <span className="text-base text-zinc-900 group-hover:text-pink-500/90 dark:text-zinc-200">
                              {post.title}
                            </span>
                            <div className="text-sm text-zinc-500 dark:text-zinc-400">
                              <DateFormatter dateString={post.publishedAt} formatStr="MMMM d, yyyy" /> |
                              Estimated Reading Time: {post.readTimeInMinutes} min
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
