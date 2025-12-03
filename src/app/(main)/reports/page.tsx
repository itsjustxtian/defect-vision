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

	useEffect(() => {
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
						columns={columns(openDialogHandler, fetchScanResults)}
						data={scanResults}
						onRowClick={handleRowClick}
					/>
				</div>
				<div className="max-h-[90vh] w-1/3">
					{}
					<ResultsPreview latestScan={currentlySelectedRow} />
				</div>
			</div>
		</>
	);
};

export default Page;
