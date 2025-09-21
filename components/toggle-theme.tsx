'use client';

import { ComponentProps, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from './icons';

type Props = ComponentProps<'button'>;

export function ToggleTheme(props: Props) {
	const { setTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// useEffect only runs on the client, so now we can safely show the UI
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<button
				aria-label="toggle"
				className="hover:bg-background border-0"
				{...props}
			>
				<Sun className="aspect-square w-6" />
			</button>
		);
	}

	return (
		<button
			aria-label="toggle"
			className="hover:bg-background border-0"
			onClick={() => {
				setTheme(theme === 'dark' ? 'light' : 'dark');
			}}
			{...props}
		>
			<Sun className="aspect-square w-6 scale-100 dark:hidden dark:scale-0" />
			<Moon className="hidden aspect-square w-6 scale-0 dark:block dark:scale-100" />
		</button>
	);
}
