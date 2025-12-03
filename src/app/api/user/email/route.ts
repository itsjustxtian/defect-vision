import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/sessions';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';

interface UserEmail {
	email: string;
}

export async function GET() {
	try {
		const cookieStore = cookies();
		const session = (await cookieStore).get('session')?.value;
		if (!session) {
			return NextResponse.json({ email: null }, { status: 200 });
		}

		const payload = await decrypt(session);
		if (!payload?.userId) {
			return NextResponse.json({ email: null }, { status: 200 });
		}

		const idString =
			typeof payload.userId === 'string'
				? payload.userId
				: String(payload.userId);

		if (!mongoose.Types.ObjectId.isValid(idString)) {
			return NextResponse.json({ email: null }, { status: 200 });
		}

		await dbConnect();
		const user = await User.findById(idString)
			.select('email')
			.lean<UserEmail | null>();

		return NextResponse.json({ email: user?.email || null }, { status: 200 });
	} catch (e) {
		console.error('Failed to retrieve user email:', e);
		return NextResponse.json({ email: null }, { status: 500 });
	}
}
