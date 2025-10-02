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
	user: UserData | null; // The user data is now part of the main props object
}

export default function NavBar({
	onMenuClick,
	isSidebarOpen,
	user,
}: NavBarProps) {
	return (
		<div className="sticky top-0 w-full h-15 bg-transparent flex items-center justify-between px-5 shadow-md">
			<button className="cursor-pointer" onClick={onMenuClick}>
				<Menu />
			</button>
			<div className="text-2xl flex items-center cursor-default gap-2">
				<Cpu />
				<p>DefectVision</p>
			</div>
			<div className="flex gap-2">
				<DarkModeToggle />
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Avatar className="rounded-xl drop-shadow-md">
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
							<p className="text-sm">{user ? `${user.email}` : ''}</p>
						</DropdownMenuLabel>

						<DropdownMenuSeparator />
						{
							<DropdownMenuItem onClick={signOutAction}>
								<LogOut /> Log out
							</DropdownMenuItem>
						}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
