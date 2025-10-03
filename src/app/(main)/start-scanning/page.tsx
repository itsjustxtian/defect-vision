'use client';

import React, { useEffect, useState } from 'react';
import { UserData } from '@/app/(auth)/actions';
import {
	CircleAlert,
	CircleCheckBig,
	FileScan,
	FileSearch,
} from 'lucide-react';
import { TailChase } from 'ldrs/react';
import 'ldrs/react/TailChase.css';
import ScanSettings from './ScanSettings';
import { ScanResult } from '../components/MiniDataTable/columns';
import LatestScanPreviewDialog from './LatestScanPreviewDialog';
import { SampleData } from '../data/SampleData';
import { CLASS_NAME_MAP } from '../components/DataTable/columns';

type ApiResponse = {
	status: string;
	message: string;
	output?: string;
	inserted_id?: string;
	details?: string;
	error?: string;
};

const Page = () => {
	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState<ApiResponse | null>(null);
	const [piNgrokUrl, setPiNgrokUrl] = useState(
		'https://see-perturbable-hayes.ngrok-free.app'
	);
	const [authToken, setAuthToken] = useState(
		'v6Rl8fhspdf8QGeQAhBwhgji2x4Kf50r'
	);
	const [user, setUser] = useState<{ email: string } | null>(null);
	const [ngrokStatus, setNgrokStatus] = useState('waiting');
	const [latestScan, setLatestScan] = useState<ScanResult | null>(null);

	useEffect(() => {
		//gets the user details on render
		const fetchUser = async () => {
			const res = await fetch('/api/user');
			const data = await res.json();
			setUser(data);
		};
		fetchUser();
		checkNgrokStatus();
	}, []);

	const handleClick = async () => {
		//handles sending instructions to the raspberry pi to initiate scanning
		setLoading(true);
		setResponse(null);

		// Call the local Next.js API route, passing the URL and token in the body.
		try {
			const res = await fetch('/api/run_pi_script', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				// Send the user-provided URL and token to the API route.
				body: JSON.stringify({ piNgrokUrl, authToken, email: user?.email }),
			});

			const data = await res.json();
			setResponse(data);
			console.log(data);

			if (data.status === 'success' && user?.email) {
				await fetchLatestScan(user.email);
			}
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			setResponse({
				status: 'error',
				message: 'Failed to connect to API route.',
				details: errorMessage,
			});
			console.error('Failed to fetch:', error);
		} finally {
			setLoading(false);
		}
	};

	const checkNgrokStatus = async () => {
		setNgrokStatus('waiting');
		try {
			const res = await fetch('/api/check_ngrok_status', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ piNgrokUrl }),
			});

			const data = await res.json();

			if (data?.status == 'active') {
				setNgrokStatus(data.status);
			} else if (data?.status == 'error') {
				setNgrokStatus('inactive');
			} else {
				setNgrokStatus('waiting');
			}

			console.log(data);
		} catch (error) {
			setNgrokStatus('inactive');
			console.error('Error checking ngrok status:', error);
		}
	};

	useEffect(() => {
		const intervalId = setInterval(() => {
			checkNgrokStatus();
		}, 600000);

		return () => clearInterval(intervalId);
	}, [piNgrokUrl]);

	const fetchLatestScan = async (userEmail: string) => {
		try {
			const url = `/api/get_recent_scan?userEmail=${userEmail}`;
			const res = await fetch(url);
			const result = await res.json();

			if (result.success && result.data) {
				setLatestScan(result.data);
				console.log('Fetched new scan result:', result.data);
			} else if (result.success && result.data === null) {
				setLatestScan(null); // No results found
			} else {
				console.error('Failed to fetch latest scan:', result.message);
			}
		} catch (error) {
			console.error('Network error fetching latest scan:', error);
		}
	};

	const sampleFetch = async () => {
		if (user?.email) {
			console.log('Fetching from email: ', user.email);
			await fetchLatestScan(user.email);
		}
	};

	return (
		<div id="page" className="p-10 flex flex-col min-h-[calc(100vh-3.75rem)]">
			<div id="header" className="flex justify-end pb-6 mb-6 border-b">
				<button
					onClick={checkNgrokStatus}
					title="Click to refresh the connection."
					className="cursor-pointer hover:scale-105 transition-all duration-250 flex justify-center items-center gap-2 px-6 py-2 bg-card border-2 rounded-full w-40"
				>
					{ngrokStatus == 'active' ? (
						<div className="flex justify-center items-center gap-2">
							<span className="w-2 h-2 bg-green-700 rounded-full"></span>
							<p>Connected</p>
						</div>
					) : ngrokStatus == 'waiting' ? (
						<div className="flex justify-center items-center gap-2">
							<span className="w-2 h-2 bg-amber-300 rounded-full"></span>
							<p>Connecting...</p>
						</div>
					) : (
						<div className="flex">
							<div className="flex justify-center items-center gap-2">
								<span className="w-2 h-2 bg-red-700 rounded-full"></span>
								<p>Disconnected</p>
							</div>
						</div>
					)}
				</button>
				{/*<button
					className="px-4 py-2 bg-red-600 cursor-pointer"
					onClick={sampleFetch}
				>
					Sample Fetch
				</button>*/}
			</div>
			<div id="content" className="flex gap-2 flex-grow overflow-y-auto">
				<div id="controls" className="flex-1 flex justify-center">
					<div
						id="controls"
						className="flex flex-col py-8 px-20 text-left justify-center"
					>
						<h1 className="text-3xl font-bold mb-4">Start Scanning</h1>
						<p className="text-foreground/70 mb-6">
							Place your motherboard inside the box and start scanning below or
							adjust your settings.
						</p>
						<div className="flex gap-2">
							<button
								onClick={handleClick}
								disabled={
									loading ||
									!piNgrokUrl ||
									!authToken ||
									ngrokStatus != 'active'
								}
								className={`px-6 py-3 w-full rounded-full text-white font-semibold transition-colors duration-200 ${
									loading ||
									!piNgrokUrl ||
									!authToken ||
									ngrokStatus != 'active'
										? 'bg-gray-400 cursor-not-allowed'
										: 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
								}`}
								title={`${
									!piNgrokUrl
										? "Ngrok URL is missing. Can't connect to the raspberry pi."
										: !authToken
										? "Authorization token is missing. Can't connect to the raspberry pi."
										: ngrokStatus == 'active'
										? 'Click to start scanning.'
										: 'Disconnected from the scanner. Cannot proceed.'
								}`}
							>
								{loading ? 'Sending Command...' : 'Run Pi Script'}
							</button>
							<ScanSettings
								piNgrokUrl={piNgrokUrl}
								setPiNgrokUrl={setPiNgrokUrl}
								authToken={authToken}
								setAuthToken={setAuthToken}
							/>
						</div>
						{response && (
							<div className="mt-6 p-4 rounded-md text-sm border">
								<h3 className="font-semibold text-left mb-2">
									Response from Pi:
								</h3>
								<pre className="whitespace-pre-wrap text-left text-gray-800">
									{JSON.stringify(response, null, 2)}
								</pre>
							</div>
						)}
					</div>
				</div>
				{latestScan ? (
					<div className="flex-1 flex flex-col bg-card border-2 rounded-lg">
						<div className="flex-1 p-15 overflow-y-auto">
							<h2 className="text-3xl font-bold mb-4 flex gap-2 items-center border-b pb-2">
								<FileScan />
								Scan Analysis
							</h2>

							<div className="flex justify-between">
								<div className="mb-6 space-y-2 text-sm">
									<p className="font-semibold text-lg">
										Defects Detected:
										<span
											className={`ml-2 px-3 py-1 rounded-full font-bold ${
												latestScan.count_objects > 0
													? 'bg-defect-border text-white'
													: 'bg-defect-success-background text-defect-success-text'
											}`}
										>
											{latestScan.count_objects}
										</span>
									</p>
									<p className="text-muted-foreground">
										<span className="font-semibold text-foreground/70">
											Scanned by:
										</span>{' '}
										{latestScan.email}
									</p>
									<p className="text-muted-foreground">
										<span className="font-semibold text-foreground/70">
											Date Scanned:
										</span>{' '}
										{new Date(latestScan.timestamp).toUTCString()}
									</p>
								</div>

								<LatestScanPreviewDialog latestScan={latestScan} />
							</div>

							<h3 className="text-xl font-bold mb-3 border-b pb-2">
								Detected Defects List
							</h3>

							{latestScan.predictions.predictions.length > 0 ? (
								<ul className="space-y-3">
									{latestScan.predictions.predictions.map(
										(prediction, index) => (
											<li
												key={index}
												className="p-3 bg-defect-background border-l-4 border-defect-border rounded-md shadow-sm"
											>
												<p className="text-base font-semibold text-defect-text">
													Defect:{' '}
													<span className="font-bold">
														{CLASS_NAME_MAP[prediction.class] ||
															prediction.class}
													</span>
												</p>
												<p className="text-sm text-defect-confidence mt-1">
													Confidence: {(prediction.confidence * 100).toFixed(2)}
													%
												</p>
											</li>
										)
									)}
								</ul>
							) : (
								<div className="text-center p-8 bg-defect-success-background rounded-lg">
									<CircleCheckBig className="h-8 w-8 mx-auto mb-3 text-defect-success-text" />
									<p className="font-medium text-defect-success-text">
										No defects detected in this scan.
									</p>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="flex-1 flex flex-col justify-center items-center bg-white border-2 rounded-lg shadow-lg gap-2 text-gray-600">
						<FileSearch size={40} />
						<p>Your scan will appear here.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Page;
