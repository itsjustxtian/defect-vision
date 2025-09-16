import React, { useState } from 'react';

interface IPCameraStreamProps {
	streamUrl?: string;
	cameraName?: string;
	setIsConnected: (status: boolean) => void;
}

const IPCameraStream: React.FC<IPCameraStreamProps> = ({
	streamUrl,
	cameraName = 'IP Camera',
	setIsConnected,
}) => {
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const handleLoad = () => {
		setLoading(false);
		setIsConnected(true);
		setError(null);
	};

	const handleError = () => {
		setLoading(false);
		setError(`Failed to load stream from ${cameraName}. Please check the URL.`);
	};

	return (
		<div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md max-w-lg mx-auto my-4 transition-colors duration-300">
			<h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
				{cameraName}
			</h2>
			<div className="relative w-full aspect-video bg-gray-300 dark:bg-gray-700 rounded-md overflow-hidden flex items-center justify-center">
				{loading && (
					<div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
						<svg
							className="animate-spin h-8 w-8 text-blue-500"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						<span className="ml-2">Loading stream...</span>
					</div>
				)}
				{error ? (
					<div className="absolute inset-0 flex items-center justify-center bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 text-center">
						{error}
					</div>
				) : (
					<img
						src={streamUrl}
						alt={`Live stream from ${cameraName}`}
						onLoad={handleLoad}
						onError={handleError}
						className={`w-full h-full object-contain transition-opacity duration-300 ${
							loading ? 'opacity-0' : 'opacity-100'
						}`}
					/>
				)}
			</div>
			{!error && (
				<p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
					Viewing live feed from {cameraName}.
				</p>
			)}
		</div>
	);
};

export default IPCameraStream;
