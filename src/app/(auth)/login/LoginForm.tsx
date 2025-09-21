'use client';

import { Eye, EyeOff, ScanEye } from 'lucide-react';
import React, { useState, useActionState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { signInAction, SignInFormState } from '@/app/(auth)/actions';

export function LoginForm() {
	const [showPassword, setShowPassword] = useState(false);

	// Use useFormState to get the state from the form action
	const [state, formAction] = useActionState<SignInFormState, FormData>(
		signInAction,
		{ error: null }
	);
	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<form
			className="flex flex-col gap-2 min-w-[300px] rounded-lg p-10"
			action={formAction} // Use formAction here
		>
			<div className="flex justify-center items-center text-6xl mb-8">
				<ScanEye />
				<p>DefectVision</p>
			</div>
			<div className="mb-8 flex flex-col gap-2">
				<h1 className="font-bold text-lg">Login Form</h1>
				<p className="text-sm">
					Don't have an account yet?{' '}
					<a href="/signup" className="font-bold hover:underline">
						Sign Up
					</a>
					.
				</p>
			</div>
			<div>
				<input
					type="text"
					placeholder="Email"
					name="email"
					className="px-4 py-2 w-full rounded-md border bg-primary-foreground"
				/>
			</div>
			<div className="flex gap-2">
				<input
					type={`${!showPassword ? 'password' : 'text'}`}
					placeholder="Password"
					name="password"
					className="px-4 py-2 w-full rounded-md border bg-primary-foreground"
				/>
				<button
					onClick={togglePasswordVisibility}
					className="p-2 text-foreground hover:bg-white/20 rounded-md"
					type="button"
				>
					{showPassword ? <Eye /> : <EyeOff />}
				</button>
			</div>
			{state?.error && (
				<div className="text-red-500 text-center text-sm mt-4">
					{state.error}
				</div>
			)}
			<div className="flex justify-end mt-8">
				<SubmitButton />
			</div>
		</form>
	);
}

// SubmitButton remains the same
function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<button
			disabled={pending}
			type="submit"
			className="bg-primary-foreground hover:bg-primary/50 hover:text-primary-foreground min-w-[100px] px-4 py-2 rounded-md transition-all duration-250"
		>
			Log In
		</button>
	);
}
