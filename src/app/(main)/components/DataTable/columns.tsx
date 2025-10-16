'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUpDown } from 'lucide-react';
import ScanResult from '@/app/models/ScanResult';
import Image from 'next/image';

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

export const columns = (openDialog: OpenDialogFn): ColumnDef<ScanResult>[] => [
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
	},
	{
		accessorKey: 'predictions.predictions', // Correct accessor for the array
		header: 'Defects Detected',
		cell: ({ row }) => {
			const predictions = row.original.predictions.predictions;

			const formattedClassNames = predictions.map((p) =>
				formatClassName(p.class)
			);

			const uniqueClassNames = Array.from(new Set(formattedClassNames));

			return uniqueClassNames.join(', ');
		},
	},
	{
		accessorKey: 'output_image',
		header: 'Visualization',
		cell: ({ row }) => {
			if (row.original.output_image) {
				// Prepend the data URL header to the Base64 string
				const dataUrl = `data:image/jpeg;base64,${row.original.output_image}`;

				return (
					<Image
						src={dataUrl}
						alt="Defect Visualization"
						width={64}
						height={64}
						className="object-cover rounded-md cursor-pointer transition hover:scale-[1.05]"
						onClick={() => openDialog(dataUrl)}
					/>
				);
			}
			return 'No Image';
		},
	},
];
