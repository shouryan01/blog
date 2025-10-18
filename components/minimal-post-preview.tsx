import Link from 'next/link';
import { User } from '../generated/graphql';
import { DateFormatter } from './date-formatter';

type Author = Pick<User, 'name'>;

type Props = {
	title: string;
	date: string;
	author: Author;
	slug: string;
	commentCount: number;
	brief?: string | null;
	readTimeInMinutes: number;
};

export const MinimalPostPreview = ({ title, date, slug, commentCount, brief, author, readTimeInMinutes }: Props) => {
	const postURL = `/${slug}`;

	return (
		<article className="group relative rounded-lg border-zinc-200 bg-white pl-4 py-2 transition-colors hover:bg-zinc-100 dark:bg-zinc-800">
			<div className="flex flex-col gap-2">
				<h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
					<Link href={postURL} className="after:absolute after:inset-0">
						{title}
					</Link>
				</h2>

				{/* {brief && (
					<p className="line-clamp-2 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
						{brief}
					</p>
				)} */}

				<div className="flex flex-wrap items-center gap-x-3 text-sm text-zinc-500 dark:text-zinc-400">
					<span><DateFormatter dateString={date} /></span>
					{/* <span>|</span>
					<span>Estimated Reading Time: {readTimeInMinutes} min</span> */}
					{/* <span>|</span>
					<span>Author: {author.name}</span> */}
					{commentCount > 0 && (
						<>
							<span>|</span>
							<span>Comments: {commentCount}</span>
						</>
					)}
				</div>
			</div>
		</article>
	);
};
