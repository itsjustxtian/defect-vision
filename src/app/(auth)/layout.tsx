'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	const toggleTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	};

	return (
		<div className="flex min-h-screen items-center justify-center relative">
			<button
				onClick={toggleTheme}
				className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
				aria-label="Toggle theme"
			>
				{mounted && (theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />)}
			</button>
			{children}
		</div>
	);
}
