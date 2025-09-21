'use client';

import React, { useEffect, useState } from 'react';
import { UserData } from '@/app/(auth)/actions';

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

	useEffect(() => {
		const fetchUser = async () => {
			const res = await fetch('/api/user');
			const data = await res.json();
			setUser(data);
		};
		fetchUser();
	}, []);

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
				body: JSON.stringify({ piNgrokUrl, authToken, email: user?.email }),
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

	const [ngrokStatus, setNgrokStatus] = useState<string | null>(null);

	const checkNgrokStatus = async () => {
		try {
			const res = await fetch('/api/check_ngrok_status', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ piNgrokUrl }),
			});

			const data = await res.json();
			setNgrokStatus(
				data.status === 'active'
					? '🟢 Pi is online!'
					: data.status === 'inactive'
					? '🔴 Pi is offline.'
					: '⚠️ Unexpected response.'
			);
		} catch (error) {
			setNgrokStatus('⚠️ Unable to reach Pi.');
			console.error('Error checking ngrok status:', error);
		}
	};

	return (
		<div className="min-h-[calc(100vh-3.75rem)] p-10 flex flex-col md:flex-row justify-center items-center gap-8">
			<div className="bg-white/5 p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
				<h1 className="text-3xl font-bold mb-4">Control Your Raspberry Pi</h1>
				<p className="text-gray-600 mb-6">
					Enter the ngrok URL and your auth token to connect.
				</p>
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
				<button
					onClick={checkNgrokStatus}
					className="px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold"
				>
					Check Pi Status
				</button>

				{ngrokStatus && (
					<div className="mt-4 text-sm text-center text-gray-800">
						{ngrokStatus}
					</div>
				)}
			</div>
		</div>
	);
};

export default Page;
