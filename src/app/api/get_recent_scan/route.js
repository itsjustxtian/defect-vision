import dbConnect from '../../../lib/dbConnect';
import ScanResult from '../../models/ScanResult';
import { NextResponse } from 'next/server';

export async function GET(request) {
	await dbConnect();

	try {
		const { searchParams } = new URL(request.url);
		const userEmail = searchParams.get('userEmail');

		if (!userEmail) {
			return NextResponse.json(
				{ success: false, message: 'Missing userEmail query parameter.' },
				{ status: 400 }
			);
		}

		const latestResult = await ScanResult.findOne({ email: userEmail })
			.sort({ timestamp: -1 })
			.lean();

		if (!latestResult) {
			return NextResponse.json(
				{
					success: true,
					data: null,
					message: 'No scan results found for this user.',
				},
				{ status: 200 }
			);
		}

		return NextResponse.json(
			{ success: true, data: latestResult },
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
