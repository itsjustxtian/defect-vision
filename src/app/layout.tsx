import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import RootLayoutClient from './RootLayoutClient';

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
		<html lang="en">
			<body className={`${inter.className} antialiased flex`}>
				<RootLayoutClient>{children}</RootLayoutClient>
			</body>
		</html>
	);
}
