'use client';

import React from 'react';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { SampleData } from '../data/SampleData';
import { format } from 'date-fns';

const MiniDataTable = () => {
	// Sort the data by timestamp in descending order and get the top 5
	const mostRecentScans = [...SampleData]
		.sort((a, b) => {
			const dateA = new Date(
				a.output_image.video_metadata.frame_timestamp
			).getTime();
			const dateB = new Date(
				b.output_image.video_metadata.frame_timestamp
			).getTime();
			return dateB - dateA;
		})
		.slice(0, 5);

	return (
		<Table>
			<TableCaption>A list of your recent scans.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[100px]">Date</TableHead>
					<TableHead>Defect Count</TableHead>
					<TableHead>Detected Classes</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{/* Check if the sorted array is empty */}
				{mostRecentScans.length === 0 ? (
					<TableRow>
						<TableCell colSpan={3} className="h-24 text-center">
							No recent scans.
						</TableCell>
					</TableRow>
				) : (
					// If there is data, map over it to render the rows
					mostRecentScans.map((scan, index) => {
						const defectClasses = scan.predictions.predictions.map(
							(prediction) => prediction.class
						);
						const uniqueDefectClasses = [...new Set(defectClasses)].join(', ');

						return (
							<TableRow key={index}>
								<TableCell className="font-medium">
									{format(
										new Date(scan.output_image.video_metadata.frame_timestamp),
										'MM/dd/yyyy'
									)}
								</TableCell>
								<TableCell>{scan.count_objects}</TableCell>
								<TableCell>{uniqueDefectClasses}</TableCell>
							</TableRow>
						);
					})
				)}
			</TableBody>
		</Table>
	);
};

export default MiniDataTable;
