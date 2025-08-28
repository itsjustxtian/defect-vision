'use client';

import React, { useState } from 'react';
import IPCameraStream from '../components/IPCameraStream';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

	return (
		<div className="min-h-[calc(100vh-3.75rem)] p-10 flex flex-col md:flex-row gap-8">
			<div className="flex-1 flex flex-col gap-4 justify-center items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
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
			</div>
		</div>
	);
};

export default Page;
