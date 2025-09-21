import { ThemeProvider } from '../components/theme-provider';
import type { Metadata } from 'next';
import '../styles/index.css';

export const metadata: Metadata = {
	title: {
		default: 'Blog',
		template: '%s | Blog',
	},
	description: 'A personal blog built with Next.js and Hashnode API',
	metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body suppressHydrationWarning>
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
