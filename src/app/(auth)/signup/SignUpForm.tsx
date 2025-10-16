'use client';

import { Eye, EyeOff, ScanEye } from 'lucide-react';
import React, { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { signUpSchema, type TSignUpSchema } from '@/lib/schema';
import { ZodError } from 'zod';
import { signUpAction } from '../actions';

export function SignUpForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [errors, setErrors] = useState<Partial<TSignUpSchema>>();
	const [message, setMessage] = useState('');

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const toggleConfirmPasswordVisibility = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setMessage(''); // Clear previous messages

		// Convert form data from HTML form to an object
		const formData = Object.fromEntries(
			new FormData(event.currentTarget).entries()
		);

		try {
			// Client-side validation (for immediate user feedback)
			signUpSchema.parse(formData);
			setErrors(undefined);

			// Now, call the server action with the validated data
			const result = await signUpAction(formData as TSignUpSchema);

			if (result?.errors) {
				// If server-side validation failed
				setErrors(result.errors);
				setMessage('Please correct the form errors.');
			} else {
				// Handle a general server error
				setMessage(result?.error || 'An unexpected error occurred.');
			}
		} catch (e) {
			if (e instanceof ZodError) {
				const newErrors: Partial<TSignUpSchema> = {};
				for (const issue of e.issues) {
					if (issue.path.length > 0) {
						newErrors[issue.path[0] as keyof TSignUpSchema] = issue.message;
					}
				}
				setErrors(newErrors);
				setMessage('Please correct the form errors.');
			} else {
				console.error(e);
				setMessage(
					'An unexpected error occurred during client-side validation.'
				);
			}
		}
	};

	return (
		<form
			className="flex flex-col gap-2 min-w-[300px] rounded-lg p-10"
			onSubmit={handleFormSubmit}
		>
			<div className="flex justify-center items-center text-6xl mb-8">
				<ScanEye />
				<p>DefectVision</p>
			</div>
			<div className="mb-8 flex flex-col gap-2">
				<h1 className="font-bold text-lg">Signup Form</h1>
				<p className="text-sm">
					Already have an account?{' '}
					<a href="/login" className="font-bold hover:underline">
						Log In
					</a>
					.
				</p>
			</div>

			{message && (
				<div
					className={`p-4 rounded-md text-sm ${
						message.includes('success')
							? 'bg-green-100 text-green-800'
							: 'bg-red-100 text-red-800'
					}`}
				>
					{message}
				</div>
			)}

			<div className="flex gap-2">
				<div className="flex flex-col w-full">
					<input
						type="text"
						name="firstName"
						placeholder="First Name"
						className="px-4 py-2 w-full rounded-md border bg-primary-foreground"
					/>
					{errors?.firstName && (
						<p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
					)}
				</div>
				<div className="flex flex-col w-full">
					<input
						type="text"
						name="lastName"
						placeholder="Last Name"
						className="px-4 py-2 w-full rounded-md border bg-primary-foreground"
					/>
					{errors?.lastName && (
						<p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
					)}
				</div>
			</div>
			<div className="flex flex-col">
				<input
					type="email"
					name="email"
					placeholder="E-mail address"
					className="px-4 py-2 w-full rounded-md border bg-primary-foreground"
				/>
				{errors?.email && (
					<p className="text-red-500 text-sm mt-1">{errors.email}</p>
				)}
			</div>
			<div className="flex gap-2">
				<div className="flex flex-col w-full">
					<input
						type={`${!showPassword ? 'password' : 'text'}`}
						name="password"
						placeholder="Password"
						className="px-4 py-2 w-full rounded-md border bg-primary-foreground"
					/>
					{errors?.password && (
						<p className="text-red-500 text-sm mt-1">{errors.password}</p>
					)}
				</div>
				<button
					onClick={togglePasswordVisibility}
					className="p-2 text-foreground hover:bg-white/20 rounded-md"
					type="button"
				>
					{showPassword ? <Eye /> : <EyeOff />}
				</button>
			</div>
			<div className="flex gap-2">
				<div className="flex flex-col w-full">
					<input
						type={`${!showConfirmPassword ? 'password' : 'text'}`}
						name="confirmPassword"
						placeholder="Confirm Password"
						className="px-4 py-2 w-full rounded-md border bg-primary-foreground"
					/>
					{errors?.confirmPassword && (
						<p className="text-red-500 text-sm mt-1">
							{errors.confirmPassword}
						</p>
					)}
				</div>
				<button
					onClick={toggleConfirmPasswordVisibility}
					className="p-2 text-foreground hover:bg-white/20 rounded-md"
					type="button"
				>
					{showConfirmPassword ? <Eye /> : <EyeOff />}
				</button>
			</div>
			<div className="flex justify-end mt-8">
				<SubmitButton />
			</div>
		</form>
	);
}

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<button
			disabled={pending}
			type="submit"
			className="bg-primary-foreground hover:bg-primary/50 hover:text-primary-foreground min-w-[100px] px-4 py-2 rounded-md transition-all duration-250"
		>
			Sign Up
		</button>
	);
}
