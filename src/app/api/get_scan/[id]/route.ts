import dbConnect from '@/lib/dbConnect';
import ScanResult from '@/app/models/ScanResult';
import { NextResponse } from 'next/server';

export async function GET(
	request: Request,
	context: { params: Promise<{ id: string }> } // params is async
) {
	await dbConnect();

	const { id } = await context.params; // ✅ await params

	if (!id) {
		return NextResponse.json(
			{ success: false, message: 'Missing id parameter' },
			{ status: 400 }
		);
	}

	try {
		const scanDocument = await ScanResult.findById(id);

		if (!scanDocument) {
			return NextResponse.json(
				{ success: false, message: 'Scan result not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ success: true, data: scanDocument },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error retrieving scan result:', error);
		return NextResponse.json(
			{ success: false, message: 'Server error' },
			{ status: 500 }
		);
	}
}
