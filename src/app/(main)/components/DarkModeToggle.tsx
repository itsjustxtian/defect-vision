import { useState, useEffect } from 'react';

const DarkModeToggle = () => {
	const [isDarkMode, setIsDarkMode] = useState(false);

	// Use useEffect to set the initial theme from localStorage
	useEffect(() => {
		const prefersDark =
			localStorage.getItem('theme') === 'dark' ||
			(!('theme' in localStorage) &&
				window.matchMedia('(prefers-color-scheme: dark)').matches);
		setIsDarkMode(prefersDark);
		if (prefersDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, []);

	const toggleDarkMode = () => {
		const newMode = !isDarkMode;
		setIsDarkMode(newMode);
		if (newMode) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	};

	return (
		<button
			onClick={toggleDarkMode}
			title={`Toggle ${isDarkMode ? 'Light Mode' : 'Dark Mode'}`}
			className="hover:scale-120 transition-all duration-300"
		>
			{isDarkMode ? '🌙' : '☀️'}
		</button>
	);
};

export default DarkModeToggle;
