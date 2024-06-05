import type {APIRoute} from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({request}) => {
	const data = await request.formData();
	const firstName = data.get('first-name');
	const lastName = data.get('last-name');
	const email = data.get('email');
	const phoneNumber = data.get('phone-number');
	const message = data.get('message');
	const response = await fetch('yourworkerdomain', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			firstName,
			lastName,
			email,
			phoneNumber,
			message,
		}),
	});
	return new Response(response.statusText, {status: 200});
};
