import { Analytics } from './analytics';
import { Integrations } from './integrations';
import { Meta } from './meta';
import { Scripts } from './scripts';
import { PublicationFragment } from '../generated/graphql';

type Props = {
	children: React.ReactNode;
	publication: PublicationFragment;
};

export const Layout = ({ children, publication }: Props) => {
	return (
		<>
			<Meta publication={publication} />
			<Scripts />
			<div className="min-h-screen bg-white dark:bg-neutral-950">
				<main>{children}</main>
			</div>
			<Analytics />
			<Integrations />
		</>
	);
};
