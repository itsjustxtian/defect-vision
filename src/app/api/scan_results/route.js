import dbConnect from '../../../lib/dbConnect';
import ScanResult from '../../models/ScanResult';
import { NextResponse } from 'next/server';

export async function GET() {
	await dbConnect();

	try {
		const scanResults = await ScanResult.find({}, { output_image: 0 });
		return NextResponse.json(
			{ success: true, data: scanResults },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error); // Add this to see the server error
		return NextResponse.json(
			{ success: false, message: 'Server error' },
			{ status: 500 }
		);
	}
}
