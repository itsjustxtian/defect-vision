import React from 'react';
import { ScanResult } from './MiniDataTable/columns';
import { CircleCheckBig, FileScan } from 'lucide-react';
import LatestScanPreviewDialog from '../start-scanning/LatestScanPreviewDialog';
import { CLASS_NAME_MAP } from './DataTable/columns';

interface ResultsPreviewProps {
	latestScan: ScanResult | null;
}

const ResultsPreview = ({ latestScan }: ResultsPreviewProps) => {
	// 🛡️ Guard for undefined/null
	if (!latestScan) {
		return (
			<div className="flex-1 flex flex-col bg-card border-2 rounded-lg p-6 text-center text-muted-foreground">
				<p>No scan selected yet.</p>
			</div>
		);
	}

	return (
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

				{latestScan.predictions?.predictions?.length > 0 ? (
					<ul className="space-y-3">
						{latestScan.predictions.predictions.map((prediction, index) => (
							<li
								key={index}
								className="p-3 bg-defect-background border-l-4 border-defect-border rounded-md shadow-sm"
							>
								<p className="text-base font-semibold text-defect-text">
									Defect:{' '}
									<span className="font-bold">
										{CLASS_NAME_MAP[prediction.class] || prediction.class}
									</span>
								</p>
								<p className="text-sm text-defect-confidence mt-1">
									Confidence: {(prediction.confidence * 100).toFixed(2)}%
								</p>
							</li>
						))}
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
	);
};

export default ResultsPreview;
