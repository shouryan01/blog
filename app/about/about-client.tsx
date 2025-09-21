'use client';

import { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';

type Props = {
  page: {
    title: string;
    content: {
      markdown: string;
    };
  } | null;
};

export function AboutClient({ page }: Props) {
  useEffect(() => {
    Prism.highlightAll();
  }, [page?.content.markdown]);

  if (page) {
    return (
      <article
        className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-lg prose-pre:bg-slate-900"
        dangerouslySetInnerHTML={{ __html: page.content.markdown }}
      />
    );
  }

  return (
    <p className="text-center text-slate-500 dark:text-slate-400">
      No about page content found. Please create an about page in your Hashnode dashboard.
    </p>
  );
}
