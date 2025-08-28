import { ScanEye } from 'lucide-react';
import { QuickActionItems } from './data/MenuItems';
import Image from 'next/image';

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex flex-1">
				<div
					id="column-1"
					className="flex-1 flex flex-col gap-20 justify-center items-center text-sm bg-gray-200"
				>
					<div className="flex text-6xl">
						<ScanEye />
						<p>DefectVision</p>
					</div>
					<div className="flex flex-col gap-5 items-start">
						{QuickActionItems.map((items) => (
							<a
								href={items.url}
								className="flex gap-2 hover:text-black/70 hover:scale-110 transition-all duration-150"
							>
								<items.icon />
								<p>{items.title}</p>
							</a>
						))}
					</div>
				</div>
				<div id="column-2" className="flex-1 bg-gray-400">
					<p>Mini-table here...</p>
				</div>
			</main>
		</div>
	);
}
