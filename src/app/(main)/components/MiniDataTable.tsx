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
		// Function to fetch data from the API
		const fetchScanResults = async () => {
			try {
				// Make a GET request to your API route
				const response = await fetch('api/scan_results');

				// Check if the request was successful
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data = await response.json();

				// Set the fetched data to state
				setScanResults(data.data);

				// Print the data to the console
				console.log('Fetched Scan Results:', data.data);
			} catch (err) {
				// This is where you solve the 'unknown' error
				if (err instanceof Error) {
					// Now TypeScript knows 'err' is an Error object, so 'err.message' is safe.
					// The state is set to a string.
					setError(err.message);
				} else {
					// Handle other cases, e.g., a non-Error object was thrown.
					setError('An unknown error occurred.');
				}
			} finally {
				setLoading(false);
			}
		};

		fetchScanResults();
	}, []);

	const mostRecentScans = scanResults
		.slice() // 1. Create a shallow copy to prevent mutating the original state array
		.sort((a, b) => {
			// 2. Sort the array: convert timestamps to milliseconds and compare
			const dateA = new Date(a.timestamp).getTime();
			const dateB = new Date(b.timestamp).getTime();

			// Return dateB - dateA for descending order (most recent first)
			return dateB - dateA;
		})
		.slice(0, 5); // 3. Slice the first 5 entries

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
				<p>Loading recent scan data...</p>
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
		</div>
	);
};

export default MiniDataTable;
