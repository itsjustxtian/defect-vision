'use client';

import React, { useEffect, useState } from 'react';
import { MiniTable } from './MiniDataTable/data-table';
import { columns, ScanResult } from './MiniDataTable/columns';
import { Skeleton } from '@/components/ui/skeleton';

const MiniDataTable = () => {
	const [scanResults, setScanResults] = useState<ScanResult[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchScanResults = async () => {
			try {
				const emailRes = await fetch('/api/user/email');
				if (!emailRes.ok) throw new Error('Failed to fetch user email');
				const { email } = await emailRes.json();

				if (!email) {
					setError('No user email found');
					setLoading(false);
					return;
				}

				const response = await fetch(
					`/api/scan_results?email=${encodeURIComponent(email)}`
				);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();

				const sortedResults = data.data.sort(
					(
						a: { timestamp: string | number | Date },
						b: { timestamp: string | number | Date }
					) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
				);

				const normalized = sortedResults.map((doc: any) => ({
					...doc,
					id: doc._id,
				}));

				setScanResults(normalized);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'An unknown error occurred.'
				);
			} finally {
				setLoading(false);
			}
		};

		fetchScanResults();
	}, []);

	const mostRecentScans = scanResults
		.slice()
		.sort((a, b) => {
			const dateA = new Date(a.timestamp).getTime();
			const dateB = new Date(b.timestamp).getTime();

			return dateB - dateA;
		})
		.slice(0, 5);

	if (loading) {
		return (
			<div className="p-6 flex flex-col justify-center items-center h-40 space-y-2">
				<div className="flex gap-2">
					<Skeleton className="h-[20px] w-[100px] rounded-full" />
					<Skeleton className="h-[20px] w-[100px] rounded-full" />
					<Skeleton className="h-[20px] w-[250px] rounded-full" />
				</div>
				<div className="flex gap-2">
					<Skeleton className="h-[20px] w-[100px] rounded-full" />
					<Skeleton className="h-[20px] w-[100px] rounded-full" />
					<Skeleton className="h-[20px] w-[250px] rounded-full" />
				</div>
				<div className="flex gap-2">
					<Skeleton className="h-[20px] w-[100px] rounded-full" />
					<Skeleton className="h-[20px] w-[100px] rounded-full" />
					<Skeleton className="h-[20px] w-[250px] rounded-full" />
				</div>
				<div className="flex gap-2">
					<Skeleton className="h-[20px] w-[100px] rounded-full" />
					<Skeleton className="h-[20px] w-[100px] rounded-full" />
					<Skeleton className="h-[20px] w-[250px] rounded-full" />
				</div>
				<div className="flex gap-2">
					<Skeleton className="h-[20px] w-[100px] rounded-full" />
					<Skeleton className="h-[20px] w-[100px] rounded-full" />
					<Skeleton className="h-[20px] w-[250px] rounded-full" />
				</div>
				<p className="pt-6">Loading recent scan data...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-900/50 text-white p-6 rounded-lg">
				<p className="font-bold">Error loading data:</p>
				<p>{error}</p>
			</div>
		);
	}

	return (
		<div className="p-6">
			<MiniTable columns={columns} data={mostRecentScans} />
			<p className="text-center pt-6 text-foreground/70">
				A list of your previous scans.
			</p>
		</div>
	);
};

export default MiniDataTable;
