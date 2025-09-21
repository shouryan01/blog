'use client';

import Link from 'next/link';
import { useAppContext } from './contexts/appContext';
import { ToggleTheme } from './toggle-theme';
import { useRouter, usePathname } from 'next/navigation';

export const PersonalHeader = () => {
  const { publication, post, page } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const renderNavItems = () => (
    <ul className="flex items-center gap-5">
      {!isHome && (
        <li>
          <Link href="/" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            Home
          </Link>
        </li>
      )}
      <li>
        <Link href="/tags" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
          Tags
        </Link>
      </li>
      <li>
        <Link href="/series" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
          Series
        </Link>
      </li>
      <li>
        <Link href="/archive" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
          Archive
        </Link>
      </li>
      <li>
        <Link href="/about" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
          About
        </Link>
      </li>
      <li>
        <div className="flex items-center space-x-4">
          <Link
            href="/search"
            className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            title="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
            </svg>
          </Link>
          <ToggleTheme />
        </div>
      </li>
    </ul>
  );


  return (
    <header className="flex items-center justify-between">
      <div>
        <Link
          href="/"
          className="text-2xl font-bold text-slate-900 hover:text-slate-700 dark:text-white dark:hover:text-slate-200"
        >
          {publication.title}
        </Link>
      </div>
      <nav>{renderNavItems()}</nav>
    </header>
  );
};
