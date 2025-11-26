import dbConnect from '@/lib/dbConnect';
import ScanResult from '@/app/models/ScanResult';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
	request: NextRequest,
	context: { params: { id: string } }
) {
	await dbConnect();

	const { id } = context.params; // comes from the [id] segment

	if (!id) {
		return NextResponse.json(
			{ success: false, message: 'Missing id parameter' },
			{ status: 400 }
		);
	}

	try {
		const deleted = await ScanResult.findByIdAndDelete(id);

		if (!deleted) {
			return NextResponse.json(
				{ success: false, message: 'Scan result not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ success: true, message: 'Scan result deleted successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error deleting scan result:', error);
		return NextResponse.json(
			{ success: false, message: 'Server error' },
			{ status: 500 }
		);
	}
}
