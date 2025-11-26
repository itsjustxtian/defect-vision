'use client';

import React, { useEffect, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { ScanResult } from '../components/MiniDataTable/columns';

interface ScanPreviewProps {
	latestScan: ScanResult;
}

const LatestScanPreviewDialog = ({ latestScan }: ScanPreviewProps) => {
	const [outputImage, setOutputImage] = useState<string | null>(
		latestScan.output_image || null
	);
	const [loading, setLoading] = useState(false);

	// Helper to fetch output_image if missing
	const getOutputImage = async (id: string) => {
		try {
			setLoading(true);
			const res = await fetch(`/api/get_scan/${id}`);
			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}
			const data = await res.json();
			if (data?.data?.output_image) {
				setOutputImage(data.data.output_image);
			}
		} catch (err) {
			console.error('Error fetching output image:', err);
		} finally {
			setLoading(false);
		}
	};

	// Trigger fetch if output_image is initially null
	useEffect(() => {
		if (!latestScan.output_image && latestScan.id) {
			getOutputImage(latestScan.id);
		}
	}, [latestScan]);

	return (
		<Dialog>
			<DialogTrigger>
				<div className="relative">
					{outputImage ? (
						<img
							src={`data:image/jpeg;base64,${outputImage}`}
							alt={`Scan Result ${latestScan.image_name}`}
							className="max-h-30 object-contain rounded-md cursor-pointer hover:scale-[1.05] hover:shadow-md transition-all duration-250"
						/>
					) : (
						<div className="text-center py-8">Loading preview...</div>
					)}
				</div>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[800px] h-auto">
				<DialogHeader>
					<DialogTitle>Defect Visualization</DialogTitle>
					<DialogDescription>
						Full-size view of the detected defects.
					</DialogDescription>
				</DialogHeader>

				<div className="flex justify-center items-center">
					{outputImage ? (
						<img
							src={`data:image/jpeg;base64,${outputImage}`}
							alt="Defect Visualization Full Size"
							className="object-contain max-h-[80vh]"
						/>
					) : loading ? (
						<div className="text-center py-8">Loading image...</div>
					) : (
						<div className="text-center py-8">No image available</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default LatestScanPreviewDialog;
