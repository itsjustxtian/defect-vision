import type { Metadata } from 'next';
import React from 'react';
import { SignUpForm } from './SignUpForm';

export const metadata: Metadata = {
	title: 'Sign Up',
};

const page = () => {
	return (
		<div className="min-h-screen flex justify-center items-center">
			<SignUpForm />
		</div>
	);
};

export default page;
