export default {
	async fetch(request, env) {
		if (request.method !== 'POST') {
			const message = 'Method Not Allowed';
			return new Response(JSON.stringify(message), {status: 405});
		}

		let requestBody;
		try {
			requestBody = await request.json();
		} catch (jsonError) {
			return new Response(
				JSON.stringify({message: 'Invalid JSON data in request'}),
				{status: 400}
			);
		}

		const {firstName, lastName, email, phoneNumber, message} = requestBody;

		if (!firstName || !lastName || !email || !phoneNumber || !message) {
			const message = 'Missing values';
			return new Response(JSON.stringify(message), {status: 400});
		}
		let send_request = new Request('https://api.mailchannels.net/tx/v1/send', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				personalizations: [
					{
						to: [{email: 'youremail', name: `${firstName}${lastName}`}],
						dkim_domain: 'yourdomain.com',
						dkim_selector: 'mailchannels',
						dkim_private_key: env.DKIM_PRIVATE_KEY,
					},
				],
				from: {
					email: env.EMAIL,
					name: 'New Contact Submission',
				},
				subject: 'New Contact Submission',
				content: [
					{
						type: 'text/html',
						value: `
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone Number:</strong> ${phoneNumber}</p>
            <p><strong>Message:</strong> ${message}</p>
            `,
					},
				],
			}),
		});
		try {
			let response = await fetch(send_request);
			if (response.status !== 200) {
				return new Response(`Error: ${response.statusText}`, {
					status: response.status,
				});
			}
			return new Response('Email sent successfully', {status: 200});
		} catch (error) {
			console.error('Error sending email:', error);
			return new Response('Failed to send email', {status: 500});
		}
	},
};
