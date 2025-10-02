'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from '../components/DataTable/data-table';
import { columns } from '../components/DataTable/columns';
import OutputImageDialog from './OutputImageDialog';
import { LineSpinner } from 'ldrs/react';
import 'ldrs/react/LineSpinner.css';
import { ShieldAlert } from 'lucide-react';

const Page = () => {
	const [scanResults, setScanResults] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [spinnerColor, setSpinnerColor] = useState<string | null>(null);

	const [dialogImageUrl, setDialogImageUrl] = useState<string | null>(null);
	const openDialogHandler = (imageUrl: string) => {
		setDialogImageUrl(imageUrl);
	};
	const closeDialogHandler = () => {
		setDialogImageUrl(null);
	};
	const columnsWithHandler = React.useMemo(() => {
		return columns(openDialogHandler);
	}, []);

	useEffect(() => {
		const fetchScanResults = async () => {
			try {
				const response = await fetch('api/scan_results');

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const data = await response.json();

				setScanResults(data.data);

				console.log('Fetched Scan Results:', data.data);
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
		const color = 'your-theme-is-dark' ? 'white' : 'black';
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
					<DataTable columns={columnsWithHandler} data={scanResults} />
				</div>
				<div className="w-1/3">
					<p>This is where the details go.</p>
				</div>
			</div>
		</>
	);
};

export default Page;
