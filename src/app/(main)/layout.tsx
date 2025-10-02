import { ReactNode } from 'react';
import LayoutClientWrapper from './LayoutClientWrapper';
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

async function getServerUser(): Promise<UserData | null> {
	try {
		const cookieStore = await cookies(); // Server component utility
		const session = cookieStore.get('session')?.value;
		if (!session) {
			// console.log("No session found."); // Optional: for debugging
			return null; // Return null if user is not authenticated
		}

		const payload = await decrypt(session);
		if (!payload?.userId) {
			// console.log("Invalid session payload."); // Optional: for debugging
			return null;
		}

		const idString =
			typeof payload.userId === 'string'
				? payload.userId
				: String(payload.userId);

		if (!mongoose.Types.ObjectId.isValid(idString)) {
			// console.log("Invalid userId format."); // Optional: for debugging
			return null;
		}

		await dbConnect();
		// Use a select/lean to only retrieve and return the necessary fields
		const user = (await User.findById(idString)
			.select('firstName lastName email')
			.lean()) as UserData | null;

		if (!user) {
			// console.log("User not found."); // Optional: for debugging
			return null;
		}

		// Destructure and return the clean object
		const { firstName, lastName, email } = user;
		return { firstName, lastName, email };
	} catch (e) {
		console.error('Failed to retrieve user data in Server Component:', e);
		return null;
	}
}

export default async function MainLayout({
	children,
}: {
	children: ReactNode;
}) {
	const user = await getServerUser();

	return <LayoutClientWrapper user={user}>{children}</LayoutClientWrapper>;
}
