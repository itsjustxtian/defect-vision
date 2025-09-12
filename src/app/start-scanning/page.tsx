'use client';

import React, { useState } from 'react';
import IPCameraStream from '../components/IPCameraStream';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type ApiResponse = {
	status: string;
	message: string;
	output?: string;
	inserted_id?: string;
	details?: string;
	error?: string;
};

const Page = () => {
	const [cameraIP, setCameraIP] = useState<string>('');
	const [cameraPort, setCameraPort] = useState<string>('');
	const [streamSourceUrl, setStreamSourceUrl] = useState<string | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);

	const handleConnect = () => {
		if (cameraIP && cameraPort) {
			const fullStreamUrl = `http://${cameraIP}:${cameraPort}/video`;
			setStreamSourceUrl(fullStreamUrl);
			console.log(fullStreamUrl);
		} else {
			alert('Please enter both Camera IP Address and Port.');
		}
	};

	const [loading, setLoading] = useState(false);
	const [response, setResponse] = useState<ApiResponse | null>(null);
	const [piNgrokUrl, setPiNgrokUrl] = useState('');
	const [authToken, setAuthToken] = useState('your-very-secret-token');

	const handleClick = async () => {
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
				body: JSON.stringify({ piNgrokUrl, authToken }),
			});

			const data = await res.json();
			setResponse(data);
			console.log(data);
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

	return (
		<div className="min-h-[calc(100vh-3.75rem)] p-10 flex flex-col md:flex-row justify-center items-center gap-8">
			{/*<div className="flex-1 flex flex-col gap-4 justify-center items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
					Connect to IP Camera
				</h2>
				<div className="flex flex-col md:flex-row w-full max-w-md gap-2 items-center">
					<p className="text-nowrap text-gray-700 dark:text-gray-300">
						Camera IP Address:
					</p>
					<Input
						type="text"
						placeholder="e.g., 192.168.1.100"
						value={cameraIP}
						onChange={(e) => setCameraIP(e.target.value)}
						className="flex-grow rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
					/>
				</div>
				<div className="flex flex-col md:flex-row w-full max-w-md gap-2 items-center">
					<p className="text-nowrap text-gray-700 dark:text-gray-300">
						Camera Port:
					</p>
					<Input
						type="text"
						placeholder="e.g., 8080"
						value={cameraPort}
						onChange={(e) => setCameraPort(e.target.value)}
						className="flex-grow rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
					/>
				</div>
				<div className="w-full max-w-md flex justify-end mt-4">
					<Button
						onClick={handleConnect}
						className="bg-blue-600 text-white rounded-md hover:bg-blue-700 px-6 py-2 transition-all duration-150 shadow-lg"
					>
						Connect
					</Button>
				</div>
			</div>

			<div className="flex-1 flex flex-col justify-center items-center p-4">
				{streamSourceUrl ? (
					<IPCameraStream
						streamUrl={streamSourceUrl}
						cameraName={`Camera (${cameraIP}:${cameraPort})`}
						setIsConnected={setIsConnected}
					/>
				) : (
					<div className="text-gray-500 dark:text-gray-400 text-lg">
						Enter camera details and click Connect to view stream.
					</div>
				)}
				{isConnected && (
					<button className="bg-blue-600 text-white rounded-md hover:bg-blue-700 px-6 py-2 transition-all duration-150 shadow-lg">
						Scan
					</button>
				)}
			</div>*/}
			<div className="bg-white/5 p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
				<h1 className="text-3xl font-bold mb-4">Control Your Raspberry Pi</h1>
				<p className="text-gray-600 mb-6">
					Enter the ngrok URL and your auth token to connect.
				</p>
				<div className="mb-4">
					<input
						type="text"
						placeholder="Enter ngrok URL (e.g., https://abcde1234.ngrok-free.app)"
						value={piNgrokUrl}
						onChange={(e) => setPiNgrokUrl(e.target.value)}
						className="w-full px-4 py-2 border rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div className="mb-6">
					<input
						type="password"
						placeholder="Enter your auth token"
						value={authToken}
						onChange={(e) => setAuthToken(e.target.value)}
						className="w-full px-4 py-2 border rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<button
					onClick={handleClick}
					disabled={loading || !piNgrokUrl || !authToken}
					className={`px-6 py-3 rounded-full text-white font-semibold transition-colors duration-200 ${
						loading || !piNgrokUrl || !authToken
							? 'bg-gray-400 cursor-not-allowed'
							: 'bg-blue-600 hover:bg-blue-700'
					}`}
				>
					{loading ? 'Sending Command...' : 'Run Pi Script'}
				</button>
				{response && (
					<div className="mt-6 p-4 rounded-md text-sm border">
						<h3 className="font-semibold text-left mb-2">Response from Pi:</h3>
						<pre className="whitespace-pre-wrap text-left text-gray-800">
							{JSON.stringify(response, null, 2)}
						</pre>
					</div>
				)}
			</div>
		</div>
	);
};

export default Page;
