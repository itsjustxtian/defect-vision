'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from '../components/DataTable/data-table';
import { columns } from '../components/DataTable/columns';
import { LineSpinner } from 'ldrs/react';
import 'ldrs/react/LineSpinner.css';
import { ShieldAlert } from 'lucide-react';

const Page = () => {
	// State to hold the fetched data
	const [scanResults, setScanResults] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [spinnerColor, setSpinnerColor] = useState<string | null>(null);

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
	}, []); // The empty dependency array ensures this effect runs only once when the component mounts

	useEffect(() => {
		// This code only runs after the component has hydrated on the client.
		// It correctly determines the color based on the client's theme.
		const color = 'your-theme-is-dark' ? 'white' : 'black';
		setSpinnerColor(color);
	}, []); // Empty dependency array ensures this runs only once

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
		<div className="min-h-screen px-20 py-10 flex gap-20">
			<div className="w-2/3">
				<DataTable columns={columns} data={scanResults} />
				{/* You can now use the scanResults state to render your data */}
			</div>
			<div className="w-1/3">
				<p>This is where the details go.</p>
			</div>
		</div>
	);
};

export default Page;
