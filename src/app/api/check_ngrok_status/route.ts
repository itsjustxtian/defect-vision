export async function POST(req: Request) {
	try {
		const { piNgrokUrl } = await req.json();

		if (!piNgrokUrl) {
			return new Response(
				JSON.stringify({ status: 'error', message: 'Missing ngrok URL.' }),
				{ status: 400, headers: { 'Content-Type': 'application/json' } }
			);
		}

		const res = await fetch(`${piNgrokUrl}/ngrok-status`);
		const raw = await res.text();

		try {
			const data = JSON.parse(raw);
			return new Response(JSON.stringify(data), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} catch {
			return new Response(
				JSON.stringify({
					status: 'error',
					message: 'Response from Pi is not valid JSON.',
					raw,
				}),
				{ status: 502, headers: { 'Content-Type': 'application/json' } }
			);
		}
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		return new Response(
			JSON.stringify({
				status: 'error',
				message: 'Failed to check ngrok status.',
				details: errorMessage,
			}),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}
