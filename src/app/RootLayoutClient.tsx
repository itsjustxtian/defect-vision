'use client';

import { useState, ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './components/Sidebar';
import SidebarMobile from './components/SidebarMobile';
import { useIsMobile } from '@/hooks/use-mobile';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

export default function RootLayoutClient({
	children,
}: {
	children: ReactNode;
}) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const isMobile = useIsMobile();

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<>
			<SidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
				{!isMobile ? (
					<AppSidebar />
				) : (
					<SidebarMobile
						isSidebarOpen={isSidebarOpen}
						onMenuClick={toggleSidebar}
					/>
				)}
				<div className="w-full">
					<NavBar onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
					<div className="main-content-container">
						<main className="page-content">{children}</main>
					</div>
					<Footer />
				</div>
			</SidebarProvider>
		</>
	);
}
