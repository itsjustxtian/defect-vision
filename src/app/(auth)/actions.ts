'use server';

import { redirect } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import bcrypt from 'bcrypt';
import { signUpSchema, type TSignUpSchema } from '@/lib/schema';
import { ZodError } from 'zod';
import { createSession, decrypt } from '@/lib/sessions';
import { cookies } from 'next/headers';

export interface UserData {
	firstName: string;
	lastName: string;
	email: string;
}

// This is the server action function
export async function signUpAction(formData: TSignUpSchema) {
	let redirectPath: string | null = null;

	try {
		const validatedData = signUpSchema.parse(formData);

		await dbConnect();

		// Hash the password for security
		const hashedPassword = await bcrypt.hash(validatedData.password, 10);

		// Create a new user instance using the Mongoose model
		const newUser = new User({
			firstName: validatedData.firstName,
			lastName: validatedData.lastName,
			email: validatedData.email,
			password: hashedPassword, // Store the hashed password
		});

		// Save the new user to the database
		await newUser.save();

		// Create and store the session with the user's ID
		await createSession(newUser._id);

		redirectPath = '/';
	} catch (e) {
		if (e instanceof ZodError) {
			return { errors: e.flatten().fieldErrors };
		}

		// Handle duplicate email error
		if (
			e instanceof Error &&
			'code' in e &&
			(e as { code: number }).code === 11000
		) {
			return { error: 'Email already exists. Please use a different one.' };
		}

		console.error(e);
		return { error: 'Failed to sign up. Please try again.' };
	} finally {
		if (redirectPath) {
			redirect(redirectPath);
		}
	}
}

// Define the shape of your form state
export interface SignInFormState {
	error: string | null;
}

export async function signInAction(
	prevState: SignInFormState,
	formData: FormData
): Promise<SignInFormState> {
	try {
		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();

		if (!email || !password) {
			return { error: 'Please enter both email and password.' };
		}

		await dbConnect();
		const user = await User.findOne({ email });

		if (!user || !(await bcrypt.compare(password, user.password))) {
			return { error: 'Invalid email or password.' };
		}

		await createSession(user._id);
	} catch (e) {
		console.error(e);
		return { error: 'An unexpected error occurred. Please try again.' };
	}

	redirect('/');
}

export async function getUserData(): Promise<UserData | null> {
	const session = (await cookies()).get('session')?.value;
	if (!session) {
		return null; // No session, so no user data
	}

	try {
		const payload = await decrypt(session);

		if (!payload || !payload.userId) {
			return null; // Invalid session payload
		}

		await dbConnect();
		const user = await User.findById(payload.userId).lean<UserData>();

		console.log('User: ');
		console.log(user);
		if (user) {
			return {
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
			};
		}
	} catch (e) {
		console.error('Failed to get user data:', e);
		return null;
	}

	return null;
}

export async function signOutAction() {
	(await cookies()).delete('session');
	redirect('/login');
}
