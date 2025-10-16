import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { ScanResult } from '../components/MiniDataTable/columns';
import Image from 'next/image';

interface ScanPreviewProps {
	latestScan: ScanResult;
}

const LatestScanPreviewDialog = ({ latestScan }: ScanPreviewProps) => {
	return (
		<Dialog>
			<DialogTrigger>
				<Image
					src={`data:image/jpeg;base64,${latestScan.output_image}`}
					alt={`Scan Result ${latestScan.image_name}`}
					className="max-h-30 w-auto object-cover rounded-md cursor-pointer hover:scale-[1.05] hover:shadow-md transition-all duration-250"
				/>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[800px] h-auto">
				<DialogHeader>
					<DialogTitle>Defect Visualization</DialogTitle>
					<DialogDescription>
						Full-size view of the detected defects.
					</DialogDescription>
				</DialogHeader>

				{latestScan.output_image ? (
					<Image
						src={`data:image/jpeg;base64,${latestScan.output_image}`}
						alt="Defect Visualization Full Size"
						className="w-full h-auto object-contain max-h-[80vh]"
					/>
				) : (
					<div className="text-center py-8">Loading image...</div>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default LatestScanPreviewDialog;
