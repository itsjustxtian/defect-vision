import dbConnect from '../../../lib/dbConnect';
import ScanResult from '../../models/ScanResult';
import { NextResponse } from 'next/server';

export async function GET(request) {
	await dbConnect();

	try {
		// Extract query params (e.g., ?email=test@example.com)
		const { searchParams } = new URL(request.url);
		const email = searchParams.get('email');

		// Build filter object
		const filter = {};
		if (email) {
			filter.email = email;
		}

		// Query with filter
		const scanResults = await ScanResult.find(filter, { output_image: 0 });

		return NextResponse.json(
			{ success: true, data: scanResults },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ success: false, message: 'Server error' },
			{ status: 500 }
		);
	}
}
