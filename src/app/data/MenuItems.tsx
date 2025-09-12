import {
	History,
	Home,
	ScanEye,
	ScrollText,
	Search,
	Settings,
} from 'lucide-react';

export const items = [
	{
		title: 'Home',
		url: '/',
		icon: Home,
	},
	{
		title: 'Scan',
		url: '/start-scanning',
		icon: ScanEye,
	},
	{
		title: 'Reports',
		url: '/reports',
		icon: ScrollText,
	},
	{
		title: 'History',
		url: '#',
		icon: History,
	},
];

export const QuickActionItems = [
	{
		id: 1,
		title: 'Start Scanning...',
		url: '/start-scanning',
		icon: ScanEye,
	},
	{
		id: 2,
		title: 'View Reports...',
		url: '/reports',
		icon: ScrollText,
	},
	{
		id: 3,
		title: 'View History...',
		url: '#',
		icon: History,
	},
];
