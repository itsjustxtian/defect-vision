'use client';

import React from 'react';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { SampleData } from '../data/SampleData';

interface Prediction {
	class: string;
}

interface DataTableItem {
	count_objects: number;
	output_image: {
		video_metadata: {
			frame_timestamp: string;
		};
	};
	predictions: {
		predictions: Prediction[];
	};
}

export const columns: ColumnDef<DataTableItem>[] = [
	{
		accessorKey: 'output_image.video_metadata.frame_timestamp',
		header: 'Date Taken',
		cell: ({ row }) => {
			const date = new Date(
				row.original.output_image.video_metadata.frame_timestamp
			);
			return date.toLocaleDateString();
		},
	},
	{
		accessorKey: 'count_objects',
		header: 'Defects Detected',
	},
	{
		accessorKey: 'predictions.predictions[0].class',
		header: 'Class',
		cell: ({ row }) => {
			const firstPrediction = row.original.predictions.predictions[0];
			return firstPrediction ? firstPrediction.class : 'N/A';
		},
	},
];

const MiniDataTable = () => {
	return <div></div>;
};

export default MiniDataTable;
