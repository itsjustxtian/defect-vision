'use client';

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';
import ScanResult from '@/app/models/ScanResult';

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
}

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
			// Get the array of predictions
			const predictions = row.original.predictions.predictions;
			// Map over the array to get the class names
			const classNames = predictions.map((p) => p.class);
			const classesString = classNames.join(', ');

			// ✅ FIX: Directly return the JSX element (the <div>)
			return (
				<div
					className="max-w-[250px] truncate overflow-hidden whitespace-nowrap"
					title={classesString} // Add a title for full text on hover
				>
					{classesString}
				</div>
			);
		},
	},
];
