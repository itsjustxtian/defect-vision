'use client';

import React, { useState, useEffect } from 'react';
import { Menu, Cpu, LogOut } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOutAction } from '@/app/(auth)/actions';

interface UserData {
	firstName: string;
	lastName: string;
	email: string;
}

interface NavBarProps {
	onMenuClick: () => void;
	isSidebarOpen: boolean;
	user: UserData | null;
}

export default function NavBar({ onMenuClick, user }: NavBarProps) {
	// 1. New state to track scroll position
	const [scrolled, setScrolled] = useState(false);

	// 2. useEffect to add and clean up the scroll listener
	useEffect(() => {
		const handleScroll = () => {
			// Check if the scroll position is past a certain threshold (e.g., 5 pixels)
			const isScrolled = window.scrollY > 5;
			if (isScrolled !== scrolled) {
				setScrolled(isScrolled);
			}
		};

		// Attach the event listener when the component mounts
		window.addEventListener('scroll', handleScroll);

		// Clean up the event listener when the component unmounts
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [scrolled]); // Dependency array includes 'scrolled' to prevent infinite loop

	// Tailwind classes for the conditional background
	const backgroundClasses = scrolled
		? 'bg-background/80 backdrop-blur-md shadow-lg transition-all duration-300'
		: 'bg-transparent shadow-md transition-all duration-300';

	return (
		<div
			className={`sticky top-0 w-full h-15 flex items-center justify-between px-5 z-40 ${backgroundClasses} transition-all duration-250`}
		>
			<button className="cursor-pointer" onClick={onMenuClick}>
				<Menu />
			</button>
			<div className="text-2xl flex items-center cursor-default gap-2">
				<Cpu />
				<p>DefectVision</p>
			</div>
			<div className="flex gap-4">
				<DarkModeToggle />
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Avatar className="rounded-xl drop-shadow-md cursor-pointer">
							<AvatarFallback>
								{user ? `${user.firstName[0]}${user.lastName[0]}` : '??'}
							</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56" align="start">
						<DropdownMenuLabel>
							<p className="text-lg">
								{user ? `${user.firstName} ${user.lastName}` : 'Guest'}
							</p>
							<p className="text-sm text-muted-foreground">
								{user ? `${user.email}` : ''}
							</p>
						</DropdownMenuLabel>

						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={signOutAction}
							className="cursor-pointer"
						>
							<LogOut className="mr-2 h-4 w-4" /> Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
