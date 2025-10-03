import React from 'react';

const Footer = () => {
	return (
		<div className="bg-background text-foreground border-t-2 py-4 px-6 text-center text-sm">
			<p>
				&copy; {new Date().getFullYear()} DefectVision. All Rights Reserved.
			</p>
		</div>
	);
};

export default Footer;
