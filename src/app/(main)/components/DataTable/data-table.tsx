'use client';

import * as React from 'react';
import {
	ColumnDef,
	SortingState,
	getSortedRowModel,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getPaginationRowModel,
} from '@tanstack/react-table';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	onRowClick?: (row: TData) => void; // Add optional onRowClick prop
}

export function DataTable<TData, TValue>({
	columns,
	data,
	onRowClick,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [selectedRowId, setSelectedRowId] = React.useState<string | null>(null);
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	});

	return (
		<div>
			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={selectedRowId === row.id ? 'selected' : undefined}
									onClick={() => {
										setSelectedRowId(row.id);
										onRowClick?.(row.original); // still call parent handler if provided
									}}
									style={{ cursor: 'pointer' }}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<button
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
					className="flex justify-center border px-4 py-2 rounded-lg hover:scale-x-110 transition duration-250"
				>
					<ChevronLeft /> <p>Previous</p>
				</button>
				<button
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
					className="flex justify-center border px-4 py-2 rounded-lg hover:scale-x-110 transition duration-250"
				>
					<p>Next</p> <ChevronRight />
				</button>
			</div>
		</div>
	);
}
