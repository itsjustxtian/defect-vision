import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

interface OutputImageDialogProps {
	imageUrl: string | null;
	onClose: () => void;
}

// NOTE: We remove DialogTrigger and make this a controlled component
const OutputImageDialog = ({ imageUrl, onClose }: OutputImageDialogProps) => {
	// The dialog is open if an imageUrl is provided
	const isOpen = !!imageUrl;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[800px] h-auto">
				<DialogHeader>
					<DialogTitle>Defect Visualization</DialogTitle>
					<DialogDescription>
						Full-size view of the detected defects.
					</DialogDescription>
				</DialogHeader>

				{/* Display the image if imageUrl is available */}
				{imageUrl ? (
					<img
						src={imageUrl}
						alt="Defect Visualization Full Size"
						className="w-full h-auto object-contain max-h-[80vh]" // Styling for a large, responsive image
					/>
				) : (
					<div className="text-center py-8">Loading image...</div>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default OutputImageDialog;
