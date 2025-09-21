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
		<article className="group relative rounded-lg border border-slate-200 bg-white p-6 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
			<div className="flex flex-col gap-4">
				{/* 标题 */}
				<h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
					<Link href={postURL} className="after:absolute after:inset-0">
						{title}
					</Link>
				</h2>

				{/* 摘要 */}
				{brief && (
					<p className="line-clamp-2 text-base leading-relaxed text-slate-600 dark:text-slate-400">
						{brief}
					</p>
				)}

				{/* 元信息 */}
				<div className="flex flex-wrap items-center gap-x-3 text-sm text-slate-500 dark:text-slate-400">
					<span>Date: <DateFormatter dateString={date} /></span>
					<span>|</span>
					<span>Estimated Reading Time: {readTimeInMinutes} min</span>
					<span>|</span>
					<span>Author: {author.name}</span>
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
