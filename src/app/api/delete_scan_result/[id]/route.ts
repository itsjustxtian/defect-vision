import dbConnect from '@/lib/dbConnect';
import ScanResult from '@/app/models/ScanResult';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
	await dbConnect();

	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');

		if (!id) {
			return NextResponse.json(
				{ success: false, message: 'Missing id parameter' },
				{ status: 400 }
			);
		}

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
