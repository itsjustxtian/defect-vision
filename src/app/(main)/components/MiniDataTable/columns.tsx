'use client';

import { ColumnDef } from '@tanstack/react-table';
import ScanResult from '@/app/models/ScanResult';
import { CLASS_NAME_MAP } from '../DataTable/columns';

export interface ScanResult {
	id: string; // Add this if your documents have an 'id' field
	count_objects: number;
	output_image: string;
	image_name: string;
	timestamp: Date;
	predictions: {
		image: {
			width: number;
			height: number;
		};
		predictions: {
			width: number;
			height: number;
			x: number;
			y: number;
			confidence: number;
			class_id: number;
			class: string;
			detection_id: string;
			parent_id: string;
		}[];
	};
	email: string;
	json_parser?: {
		issue: string | null;
		severity: string | null;
		cause: string | null;
		fix: string | null;
		class: string | null;
		risk: string | null;
		error_status: boolean | null;
	};
	open_ai?: string | null;
}

const formatClassName = (rawName: string): string => {
	return CLASS_NAME_MAP[rawName] || rawName;
};

export const columns: ColumnDef<ScanResult>[] = [
	{
		accessorKey: 'timestamp',
		header: () => <div className="text-left max-w-[100px]">Date</div>,
		cell: ({ row }) => {
			const date = new Date(row.original.timestamp);
			const localdate = date.toLocaleDateString();

			return <div className="px-2">{localdate}</div>;
		},
	},
	{
		accessorKey: 'count_objects',
		header: () => <div className="text-wrap max-w-[100px]">No. of Defects</div>,
	},
	{
		accessorKey: 'predictions.predictions', // Correct accessor for the array
		header: () => <div className="text-left">Defects Detected</div>,
		cell: ({ row }) => {
			const predictions = row.original.predictions.predictions;

			const formattedClassNames = predictions.map((p) =>
				formatClassName(p.class)
			);

			const uniqueClassNames = Array.from(new Set(formattedClassNames));

			if (uniqueClassNames.length > 0) {
				return uniqueClassNames.join(', ');
			} else {
				return <p>No defects detected.</p>;
			}
		},
	},
];
