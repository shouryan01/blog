'use client';

import Link from 'next/link';
import { useAppContext } from './contexts/appContext';
import ThemeSwitch from './toggle-theme';
import { useRouter, usePathname } from 'next/navigation';

export const Header = () => {
  const { publication, post, page } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isBlog = pathname === '/blog';
  const isAbout = pathname === '/about';
  const isSearch = pathname === '/search';

  const renderNavItems = () => (
    <div className="flex items-center space-x-6">
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
      <ThemeSwitch />
    </div>
  );


  return (
  <header className="flex items-center justify-between">
      <div>
        <Link
          href="/"
        >
          <div className="text-2xl font-bold duration-200 hover:scale-105 text-zinc-900 hover:text-pink-500/90 dark:text-white dark:hover:text-pink-500/90">
            {publication.title}
          </div>
        </Link>
      </div>
      <nav>{renderNavItems()}</nav>
    </header>
  );
};
