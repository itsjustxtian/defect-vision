export async function POST(req: Request) {
	const { piNgrokUrl, authToken, email } = await req.json();

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
			body: JSON.stringify({ email }),
		});

		const data = await res.json();

		if (!res.ok) {
			// Bubble up the Pi server’s status and message directly
			return new Response(
				JSON.stringify({
					status: 'error',
					message: data.message || 'Pi server returned an error.',
					details: data.error || null,
				}),
				{
					status: res.status, // preserve Pi server’s status code
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		// Success case
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
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
				status: 502, // Bad Gateway (since Pi is unreachable)
				headers: { 'Content-Type': 'application/json' },
			}
		);
	}
}
