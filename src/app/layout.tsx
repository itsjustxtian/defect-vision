import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import RootLayoutClient from './RootLayoutClient';
import { ThemeProvider } from './components/theme-provider';

export const metadata: Metadata = {
	title: {
		default: 'DefectVision',
		template: '%s | DefectVision',
	},
	description: 'An AI-Assisted Defect Detection Application for Motherboards',
};

const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} antialiased flex`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<RootLayoutClient>{children}</RootLayoutClient>
				</ThemeProvider>
			</body>
		</html>
	);
}
