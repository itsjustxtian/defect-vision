'use client';

import React, { useState } from 'react';
import { Menu, Cpu } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';

interface NavBarProps {
	onMenuClick: () => void;
	isSidebarOpen: boolean;
}

const NavBar = ({ onMenuClick, isSidebarOpen }: NavBarProps) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	return (
		<div className="sticky top-0 w-full h-15 bg-transparent flex items-center justify-between px-5">
			<button className="cursor-pointer" onClick={onMenuClick}>
				<Menu />
			</button>
			<div className="text-2xl flex items-center cursor-default gap-2">
				<Cpu />
				<p>DefectVision</p>
			</div>
			<DarkModeToggle />
		</div>
	);
};

export default NavBar;
