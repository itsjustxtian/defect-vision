import { z } from 'zod';

export const signUpSchema = z
	.object({
		firstName: z.string().min(1, { message: 'First name is required.' }),
		lastName: z.string().min(1, { message: 'Last name is required.' }),
		email: z.string().email({ message: 'A valid email is required.' }),
		password: z
			.string()
			.min(8, { message: 'Password must be at least 8 characters long.' }),
		confirmPassword: z
			.string()
			.min(1, { message: 'Confirm password is required.' }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match.',
		path: ['confirmPassword'],
	});

export type TSignUpSchema = z.infer<typeof signUpSchema>;
