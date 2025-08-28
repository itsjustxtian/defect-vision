import React from 'react';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { items } from '../data/MenuItems';
import { Wallet } from 'lucide-react';

interface SidebarMobileProps {
	isSidebarOpen: boolean;
	onMenuClick: () => void;
}

const SidebarMobile = ({ isSidebarOpen, onMenuClick }: SidebarMobileProps) => {
	return (
		<Sheet open={isSidebarOpen} onOpenChange={onMenuClick}>
			<SheetContent side="left">
				<SheetHeader>
					<SheetTitle>
						<a href="#" className="flex gap-2">
							<Wallet />
							<span>BillShare</span>
						</a>
					</SheetTitle>
				</SheetHeader>
				{items.map((item) => (
					<div key={item.title} className="px-4 py-2">
						<a href={item.url} className="flex gap-2">
							<item.icon />
							<span>{item.title}</span>
						</a>
					</div>
				))}
			</SheetContent>
		</Sheet>
	);
};

export default SidebarMobile;
