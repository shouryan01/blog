import { PublicationFragment } from '../generated/graphql';

type Props = {
	publication: PublicationFragment;
};

export const Footer = ({ publication }: Props) => {

	return (
		<footer className="border-t pt-10 pb-10 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
			<div className="container mx-auto flex flex-col items-center gap-2 px-5">
				<div>
					&copy; {new Date().getFullYear()} {publication.title}
				</div>
				{/* <div className="flex items-center gap-2">
					<span>Powered by</span>
					<a href="https://hashnode.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
						Hashnode
					</a>
					<span>•</span>
					<a href="https://codeium.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
						Codeium
					</a>
					<span>•</span>
					<span>
						Built by duizhang
					</span>
				</div> */}
			</div>
		</footer>
	);
};
