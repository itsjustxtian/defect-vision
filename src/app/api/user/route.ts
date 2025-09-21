import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import { decrypt } from '@/lib/sessions';
import mongoose from 'mongoose';

interface UserData {
	firstName: string;
	lastName: string;
	email: string;
}

export async function GET() {
	try {
		const cookieStore = await cookies();
		const session = cookieStore.get('session')?.value;
		if (!session)
			return NextResponse.json({ error: 'No session' }, { status: 401 });

		const payload = await decrypt(session);
		if (!payload?.userId)
			return NextResponse.json(
				{ error: 'Invalid session payload' },
				{ status: 401 }
			);

		const idString =
			typeof payload.userId === 'string'
				? payload.userId
				: String(payload.userId);
		if (!mongoose.Types.ObjectId.isValid(idString)) {
			return NextResponse.json(
				{ error: 'Invalid userId format' },
				{ status: 400 }
			);
		}

		await dbConnect();
		const user = (await User.findById(idString).lean()) as UserData | null;
		if (!user)
			return NextResponse.json({ error: 'User not found' }, { status: 404 });

		const { firstName, lastName, email } = user;
		return NextResponse.json({ firstName, lastName, email });
	} catch (error) {
		console.error('Error fetching user:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
