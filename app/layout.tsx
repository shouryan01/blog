import { ThemeProvider } from '../components/theme-provider';
import type { Metadata } from 'next';
import '../styles/index.css';

export const metadata: Metadata = {
	title: {
		default: 'Shouryan Nikam',
		template: '%s | Shouryan Nikam',
	},
	description: 'Shouryan Nikam\'s website',
	metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body suppressHydrationWarning className="bg-white dark:bg-zinc-950">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
