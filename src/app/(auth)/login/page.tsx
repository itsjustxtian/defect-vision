import type { Metadata } from 'next';
import React from 'react';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
	title: 'Log In',
};

const page = () => {
	return (
		<div className="min-h-screen flex justify-center items-center">
			<LoginForm />
		</div>
	);
};

export default page;
