'use client';

import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from '../components/DataTable/data-table';
import { columns } from '../components/DataTable/columns';
import OutputImageDialog from './OutputImageDialog';
import { LineSpinner } from 'ldrs/react';
import 'ldrs/react/LineSpinner.css';
import { ShieldAlert, MoreVertical } from 'lucide-react';
import ResultsPreview from '../components/ResultsPreview';
import { ScanResult } from '../components/MiniDataTable/columns';

const Page = () => {
	const [scanResults, setScanResults] = useState<ScanResult[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [spinnerColor, setSpinnerColor] = useState<string | null>(null);
	const [currentlySelectedRow, setCurrentlySelectedRow] =
		useState<ScanResult | null>(null);
	const [dialogImageUrl, setDialogImageUrl] = useState<string | null>(null);
	const [actionMenuRow, setActionMenuRow] = useState<any | null>(null);
	const actionMenuRef = useRef<HTMLDivElement | null>(null);

	const openDialogHandler = (imageUrl: string) => {
		setDialogImageUrl(imageUrl);
	};
	const closeDialogHandler = () => {
		setDialogImageUrl(null);
	};

	useEffect(() => {
		console.log(scanResults);
	}, [scanResults]);

	useEffect(() => {
		if (scanResults.length > 0 && !currentlySelectedRow) {
			setCurrentlySelectedRow(scanResults[0]);
		}
	}, [scanResults, currentlySelectedRow]);

	// Close on outside click
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				actionMenuRef.current &&
				!actionMenuRef.current.contains(event.target as Node)
			) {
				setActionMenuRow(null);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleRowClick = (row: any) => {
		setCurrentlySelectedRow(row);
	};

	useEffect(() => {
		const fetchScanResults = async () => {
			try {
				const response = await fetch('api/scan_results');
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();

				// Sort by timestamp descending (most recent first)
				const sortedResults = data.data.sort(
					(
						a: { timestamp: string | number | Date },
						b: { timestamp: string | number | Date }
					) => {
						// 2. Sort the array: convert timestamps to milliseconds and compare
						const dateA = new Date(a.timestamp).getTime();
						const dateB = new Date(b.timestamp).getTime();

						// Return dateB - dateA for descending order (most recent first)
						return dateB - dateA;
					}
				);

				const normalized = sortedResults.map((doc: any) => ({
					...doc,
					id: doc._id, // ensure id exists
				}));

				console.log(normalized);

				setScanResults(normalized);
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError('An unknown error occurred.');
				}
			} finally {
				setLoading(false);
			}
		};
		fetchScanResults();
	}, []);

	useEffect(() => {
		const color = window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'white'
			: 'black';
		setSpinnerColor(color);
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen px-20 py-10 flex justify-center items-center">
				<div className="w-2/3 flex flex-col gap-4 justify-center items-center">
					<LineSpinner
						size="40"
						stroke="3"
						speed="1"
						color={spinnerColor || undefined}
					/>
					<p>Fetching data from database...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full min-h-screen flex flex-col gap-4 justify-center items-center">
				<ShieldAlert />
				<p>Error: {error}</p>
			</div>
		);
	}

	return (
		<>
			<OutputImageDialog
				imageUrl={dialogImageUrl}
				onClose={closeDialogHandler}
			/>
			<div className="min-h-screen px-20 py-10 flex gap-20">
				<div className="w-2/3">
					<DataTable
						columns={columns(openDialogHandler)}
						data={scanResults}
						onRowClick={handleRowClick}
					/>
				</div>
				<div className="max-h-[90vh] w-1/3">
					{/* <p>This is where the details go.</p> */}
					<ResultsPreview latestScan={currentlySelectedRow} />
				</div>
			</div>
		</>
	);
};

export default Page;
