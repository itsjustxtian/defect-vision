'use client';

import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { useFormStatus } from 'react-dom';

export function LoginForm() {
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};
	return (
		<form className="flex flex-col gap-2 min-w-[300px] rounded-lg p-10">
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
					className="px-4 py-2 w-full rounded-md border bg-primary-foreground"
				/>
			</div>
			<div className="flex gap-2">
				<input
					type={`${showPassword ? 'password' : 'text'}`}
					placeholder="Password"
					className="px-4 py-2 w-full rounded-md border bg-primary-foreground"
				/>
				<button
					onClick={togglePasswordVisibility}
					className="p-2 text-foreground hover:bg-white/20 rounded-md"
					type="button"
				>
					{!showPassword ? <Eye /> : <EyeOff />}
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
			Log In
		</button>
	);
}
