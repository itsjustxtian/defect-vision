import { ScanEye } from 'lucide-react';
import { QuickActionItems } from './data/MenuItems';
import MiniDataTable from './components/MiniDataTable';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Dashboard',
};

export default function Home() {
	return (
		<div className="min-h-[calc(100vh-3.75rem)] flex flex-col">
			<main className="flex flex-1">
				<div
					id="column-1"
					className="flex-1 flex flex-col gap-20 justify-center items-center text-sm"
				>
					<div className="flex items-center text-6xl">
						<ScanEye />
						<p>DefectVision</p>
					</div>
					<div className="flex flex-col gap-5 items-start">
						{QuickActionItems.map((items) => (
							<a
								key={items.id}
								href={items.url}
								className="flex gap-2 hover:text-black/70 hover:scale-110 transition-all duration-150"
							>
								<div className="flex items-center gap-2">
									<items.icon className="h-4 w-4" />
									<span className="font-semibold text-lg">{items.title}</span>
								</div>
							</a>
						))}
					</div>
				</div>
				<div id="column-2" className="flex-1 flex justify-center items-center">
					<MiniDataTable />
				</div>
			</main>
		</div>
	);
}
