'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreVertical } from 'lucide-react';
import ScanResult from '@/app/models/ScanResult';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ScanResult {
	id: string;
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

export const CLASS_NAME_MAP: { [key: string]: string } = {
	CPU_FAN_NO_Screws: 'Missing CPU Fan Screws',
	0: 'Rust',
	CPU_fan: 'CPU Fan',
	CPU_fan_port: 'CPU Fan Port',
	CPU_fan_port_detached: 'Detached Fan Port',
	CPU_FAN_Screw_loose: 'Loose CPU Fan Screw',
	CPU_FAN_Screws: 'CPU Fan Screw',
	Incorrect_Screws: 'Incorrect Screws Used',
	Loose_Screws: 'Loose Screws',
	Motherboard: 'Motherboard',
	No_Screws: 'Missing Screws',
	over_heat: 'Overheating Damage',
	PCI_damage: 'Peripheral Component Damage',
	pin_damage: 'Damaged pins',
	RAM_damage: 'RAM Damage',
	Scratch: 'Scratch',
	Screws: 'Screws',
};

const formatClassName = (rawName: string): string => {
	return CLASS_NAME_MAP[rawName] || rawName;
};

type OpenDialogFn = (imageUrl: string) => void;

export const columns = (
	openDialog: OpenDialogFn,
	refreshFn?: () => void
): ColumnDef<ScanResult>[] => [
	{
		accessorKey: 'timestamp',
		header: ({ column }) => {
			return (
				<button
					className="flex items-center cursor-pointer"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Date
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</button>
			);
		},

		cell: ({ row }) => {
			const date = new Date(row.original.timestamp);
			return date.toLocaleDateString();
		},
	},
	{
		accessorKey: 'count_objects',
		header: ({ column }) => {
			return (
				<button
					className="flex items-center cursor-pointer"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					No. of Defects
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</button>
			);
		},
		cell: ({ row }) => {
			const defectcount = row.original.count_objects;
			if (defectcount == 0) {
				return <p className="text-defect-success-text">{defectcount}</p>;
			} else {
				return <p className="text-defect-text">{defectcount}</p>;
			}
		},
	},
	{
		accessorKey: 'predictions.predictions', // Correct accessor for the array
		header: 'Defects Detected',
		cell: ({ row }) => {
			const predictions = row.original.predictions.predictions;

			if (predictions.length == 0) {
				return <p className="text-defect-success-text">No defects detected.</p>;
			}

			const formattedClassNames = predictions.map((p) =>
				formatClassName(p.class)
			);

			const uniqueClassNames = Array.from(new Set(formattedClassNames));

			return <p className="text-defect-text">{uniqueClassNames.join(', ')}</p>;
		},
	},
	{
		header: 'Confidence Range',
		cell: ({ row }) => {
			const predictions = row.original.predictions.predictions;

			// Extract all confidence values
			const confidences = predictions.map((p) => p.confidence * 100);

			// Find lowest and highest
			const lowestConfidence = Math.min(...confidences);
			const highestConfidence = Math.max(...confidences);

			return (
				<p>
					{lowestConfidence.toFixed(2)}% - {highestConfidence.toFixed(2)}%
				</p>
			);
		},
	},
	{
		header: 'Average Confidence',
		cell: ({ row }) => {
			const predictions = row.original.predictions.predictions;
			const totalConfidence = predictions.reduce(
				(sum, pred) => sum + pred.confidence,
				0
			);
			const averageConfidence = totalConfidence / predictions.length;
			const averageConfidencePercent = averageConfidence * 100;

			return <p>{averageConfidencePercent.toFixed(2)} %</p>;
		},
	},
	{
		header: 'Actions',
		cell: ({ row }) => {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							className="cursor-pointer"
							onClick={(e) => e.stopPropagation()}
						>
							<MoreVertical size={20} />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem
							onClick={async () => {
								console.log('Delete clicked.');
								const id = row.original.id;

								try {
									const res = await fetch(`/api/delete_scan_result/${id}`, {
										method: 'DELETE',
									});

									if (!res.ok) {
										throw new Error(`HTTP error! status: ${res.status}`);
									}

									const data = await res.json();

									if (data.success) {
										console.log(`Document ID ${id} successfully deleted!`);
										if (refreshFn) refreshFn();
									} else {
										console.error(`Delete failed: ${data.message}`);
									}
								} catch (err) {
									console.error('Error deleting document:', err);
								}
							}}
						>
							Delete
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								try {
									const json = JSON.stringify(row.original, null, 2); // pretty print
									navigator.clipboard.writeText(json);
									console.log('Row copied to clipboard:', json);
								} catch (err) {
									console.error('Failed to copy row JSON:', err);
								}
							}}
						>
							Copy as JSON
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
