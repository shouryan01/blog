import Link from 'next/link';
import Image from 'next/image';
import { SeriesFragment } from '../../generated/graphql';

type Props = {
  series: SeriesFragment;
};

export function SeriesCard({ series }: Props) {
  return (
    <Link
      href={`/series/${series.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      {series.coverImage && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={series.coverImage}
            alt={series.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
          {series.name}
        </h2>
        {series.description?.text && (
          <p className="mb-4 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
            {series.description.text}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm text-zinc-500 dark:text-zinc-500">
            {series.posts.totalDocuments} {series.posts.totalDocuments === 1 ? 'post' : 'posts'}
          </span>
          {series.posts.edges[0]?.node.publishedAt && (
            <span className="text-sm text-zinc-500 dark:text-zinc-500">
              Last updated{' '}
              {new Date(series.posts.edges[0].node.publishedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
