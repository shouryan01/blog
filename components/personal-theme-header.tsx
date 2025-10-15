'use client';

import Link from 'next/link';
import { useAppContext } from './contexts/appContext';
import ThemeSwitch from './toggle-theme';
import { useRouter, usePathname } from 'next/navigation';
import { AnimatedThemeToggler } from './ui/animated-theme-toggler';

export const PersonalHeader = () => {
  const { publication, post, page } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isBlog = pathname === '/blog';
  const isAbout = pathname === '/about';
  const isSearch = pathname === '/search';

  const renderNavItems = () => (
    <div className="flex items-center space-x-6">
      {/* {!isHome && (
        <Link href="/" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
          Home
        </Link>
      )} */}
      {/* <Link href="/tags" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
        Tags
      </Link>
      <Link href="/series" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
        Series
      </Link> */}
      <Link
        href="/blog"
        className={`flex items-center justify-center rounded-lg px-3 py-2 transition-transform duration-200 hover:scale-110 hover:bg-zinc-100 hover:dark:bg-zinc-900 ${
          isBlog
            ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-medium'
            : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
        }`}
      >
        Blog
      </Link>
      {/* <Link href="/archive" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
        Archive
      </Link> */}
      <Link
        href="/about"
        className={`flex items-center justify-center rounded-lg px-3 py-2 transition-transform duration-200 hover:scale-110 hover:bg-zinc-100 hover:dark:bg-zinc-900 ${
          isAbout
            ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-medium'
            : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
        }`}
      >
        About
      </Link>
      <Link
        href="/search"
        className={`flex items-center justify-center rounded-lg px-3 py-2 transition-transform duration-200 hover:scale-110 hover:bg-zinc-100 hover:dark:bg-zinc-900 ${
          isSearch
            ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white'
            : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
        }`}
        title="Search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
        </svg>
      </Link>
      <ThemeSwitch />
    </div>
  );


  return (
    <header className="flex items-center justify-between">
      <div>
        <Link
          href="/"
          className="text-2xl font-bold text-zinc-900 hover:text-zinc-700 dark:text-white dark:hover:text-zinc-200"
        >
          {publication.title}
        </Link>
      </div>
      <nav>{renderNavItems()}</nav>
    </header>
  );
};
