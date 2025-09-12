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

interface ScanResult {
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
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'timestamp',
		header: 'Date',
		cell: ({ row }) => {
			const date = new Date(row.original.timestamp);
			return date.toLocaleDateString();
		},
	},
	{
		accessorKey: 'count_objects',
		header: 'No. of Defects',
	},
	{
		accessorKey: 'predictions.predictions', // Correct accessor for the array
		header: 'Defects Detected',
		cell: ({ row }) => {
			// Get the array of predictions
			const predictions = row.original.predictions.predictions;
			// Map over the array to get the class names
			const classNames = predictions.map((p) => p.class);
			return classNames.join(', ');
		},
	},
	{
		accessorKey: 'output_image',
		header: 'Visualization',
		cell: ({ row }) => {
			// Check if the image path exists
			if (row.original.output_image) {
				// Prepend the data URL header to the Base64 string
				const dataUrl = `data:image/jpeg;base64,${row.original.output_image}`;

				// Return an image element
				return (
					<img
						src={dataUrl} // Use the data URL as the source
						alt="Defect Visualization"
						className="h-16 w-16 object-cover rounded-md"
					/>
				);
			}
			return 'No Image';
		},
	},
];
