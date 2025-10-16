'use client';

import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from '../components/DataTable/data-table';
import { columns as baseColumns } from '../components/DataTable/columns';
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

	// Add Action column with three dots
	const columnsWithHandler = React.useMemo(() => {
		const actionColumn = {
			id: 'action',
			header: 'Action',
			cell: ({ row }: any) => (
				<div style={{ position: 'relative' }} ref={actionMenuRef}>
					<button
						onClick={() =>
							setActionMenuRow(
								actionMenuRow === row.original ? null : row.original
							)
						}
						style={{ background: 'none', border: 'none', cursor: 'pointer' }}
						aria-label="Actions"
					>
						<MoreVertical size={20} />
					</button>
					{actionMenuRow && actionMenuRow === row.original && (
						<div
							style={{
								position: 'absolute',
								right: 0,
								top: '100%',
								background: 'white',
								border: '1px solid #ddd',
								borderRadius: 4,
								boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
								zIndex: 10,
								minWidth: 120,
								color: 'black',
							}}
						>
							<button
								style={{
									display: 'block',
									width: '100%',
									padding: '8px 16px',
									background: 'none',
									border: 'none',
									textAlign: 'left',
									cursor: 'pointer',
								}}
								onClick={async () => {
									const id = row.original._id || row.original.id;

									const res = await fetch(`/api/delete_scan_result?id=${id}`, {
										method: 'DELETE',
									});

									const data = await res.json();

									if (data.success) {
										setScanResults((prev) => prev.filter((r) => r.id !== id));
									} else {
										console.error(data.message);
									}

									setActionMenuRow(null);
								}}
							>
								Delete
							</button>
							<button
								style={{
									display: 'block',
									width: '100%',
									padding: '8px 16px',
									background: 'none',
									border: 'none',
									textAlign: 'left',
									cursor: 'pointer',
								}}
								onClick={() => {
									navigator.clipboard.writeText(
										JSON.stringify(row.original, null, 2)
									);
									setActionMenuRow(null);
								}}
							>
								Copy as JSON
							</button>
							{/* ❌ Removed Close button */}
						</div>
					)}
				</div>
			),
		};
		return [...baseColumns(openDialogHandler), actionColumn];
	}, [actionMenuRow]);

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
				setScanResults(data.data);
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
						columns={columnsWithHandler}
						data={scanResults}
						onRowClick={handleRowClick}
					/>
				</div>
				<div className="w-1/3">
					{/* <p>This is where the details go.</p> */}
					<ResultsPreview latestScan={currentlySelectedRow} />
				</div>
			</div>
		</>
	);
};

export default Page;
