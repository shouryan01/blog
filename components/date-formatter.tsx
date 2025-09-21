import { format, parseISO } from 'date-fns';

type Props = {
	dateString: string;
	/**
	 * Format string for date-fns
	 * @default 'MMM d, yyyy'
	 */
	formatStr?: string;
};

export const DateFormatter = ({ dateString, formatStr = 'MMM d, yyyy' }: Props) => {
	if (!dateString) return <></>;
	const date = parseISO(dateString);

	return <time dateTime={dateString}>{format(date, formatStr)}</time>;
};
