// app/(main)/LayoutClientWrapper.tsx (OR keep the old name if you prefer)
'use client';

import { useState, ReactNode } from 'react'; // REMOVED useEffect
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './components/Sidebar';
import SidebarMobile from './components/SidebarMobile';
import { useIsMobile } from '@/hooks/use-mobile';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

interface UserData {
	firstName: string;
	lastName: string;
	email: string;
}

// 1. Accepts 'user' prop from the Server Component Layout
export default function LayoutClientWrapper({
	children,
	user,
}: {
	children: ReactNode;
	user: UserData | null;
}) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const isMobile = useIsMobile();
	// Removed ALL useEffect and local state for user data.

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
					{/* 2. Pass the user data prop to NavBar */}
					<NavBar
						onMenuClick={toggleSidebar}
						isSidebarOpen={isSidebarOpen}
						user={user}
					/>
					<div className="main-content-container">
						<main className="page-content">{children}</main>
					</div>
					<Footer />
				</div>
			</SidebarProvider>
		</>
	);
}
