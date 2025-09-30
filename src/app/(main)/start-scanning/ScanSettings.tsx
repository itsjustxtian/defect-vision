import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ScanSettingsProps {
	piNgrokUrl: string;
	setPiNgrokUrl: (url: string) => void;
	authToken: string;
	setAuthToken: (authToken: string) => void;
}

const ScanSettings = ({
	piNgrokUrl,
	setPiNgrokUrl,
	authToken,
	setAuthToken,
}: ScanSettingsProps) => {
	const [localNgrokUrl, setLocalNgrokUrl] = useState(piNgrokUrl);
	const [localAuthToken, setLocalAuthToken] = useState(authToken);

	useEffect(() => {
		setLocalNgrokUrl(piNgrokUrl);
		setLocalAuthToken(authToken);
	}, [piNgrokUrl, authToken]);

	const handleSave = () => {
		setPiNgrokUrl(localNgrokUrl);
		setAuthToken(localAuthToken);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					className="hover:bg-white/5 rounded-full py-2 px-4 cursor-pointer"
					title="Change settings"
				>
					<Settings />
				</button>
			</PopoverTrigger>
			<PopoverContent className="min-w-80 space-y-4">
				<div className="space-y-2">
					<h4 className="leading-none font-medium">Ngrok Settings</h4>
					<p className="text-muted-foreground text-sm">
						Update your Ngrok settings to match your scanner.
					</p>
				</div>
				<div className="grid grid-cols-3 gap-4 items-center">
					<p className="text-sm font-bold">Ngrok URL</p>
					<input
						className="col-span-2 h-8 border-2 rounded-sm px-2"
						value={localNgrokUrl}
						onChange={(e) => setLocalNgrokUrl(e.target.value)}
					/>
				</div>
				<div className="grid grid-cols-3 gap-4 items-center">
					<p className="text-sm font-bold">Auth Token</p>
					<input
						className="col-span-2 h-8 border-2 rounded-sm px-2"
						type="password"
						value={localAuthToken}
						onChange={(e) => setLocalAuthToken(e.target.value)}
					/>
				</div>

				<div className="flex justify-end pt-2">
					<button
						className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-sm font-medium transition-all duration-200"
						onClick={handleSave}
					>
						Save Changes
					</button>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default ScanSettings;
