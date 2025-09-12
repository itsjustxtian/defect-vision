export async function POST(req: Request) {
	const { piNgrokUrl, authToken } = await req.json();

	if (!piNgrokUrl || !authToken) {
		return new Response(
			JSON.stringify({
				status: 'error',
				message: 'Missing ngrok URL or auth token.',
			}),
			{
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}

	try {
		const res = await fetch(`${piNgrokUrl}/run-python-script`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authToken}`,
			},
		});

		const data = await res.json();

		if (!res.ok) {
			// Re-throw the error with details from the server
			throw new Error(
				`Pi server responded with status: ${res.status}, error: ${data.error}`
			);
		}

		return new Response(JSON.stringify(data), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error);

		console.error('Error communicating with Raspberry Pi:', error);
		return new Response(
			JSON.stringify({
				status: 'error',
				message: 'Failed to connect to Raspberry Pi server.',
				details: errorMessage,
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
	}
}
