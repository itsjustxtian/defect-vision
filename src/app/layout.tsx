import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import RootLayoutClient from './RootLayoutClient';

export const metadata: Metadata = {
	title: { default: 'BillShare', template: '%s | Bill Share' },
	description: 'Organize your bills easily.',
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
