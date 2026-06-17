const nodemailer = require('nodemailer');

const hasEmailConfig = () => {
	return Boolean(
		process.env.EMAIL_USER &&
		process.env.EMAIL_PASS &&
		process.env.EMAIL_USER !== 'your_email' &&
		process.env.EMAIL_PASS !== 'your_email_password'
	);
};

const createTransporter = () => {
	return nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS
		}
	});
};

const sendEmail = async ({ to, subject, html, text }) => {
	if (!hasEmailConfig()) {
		console.warn('EMAIL: SMTP not configured. Skipping real send.');
		return { sent: false, skipped: true };
	}

	const transporter = createTransporter();
	await transporter.sendMail({
		from: `FursaHub <${process.env.EMAIL_USER}>`,
		to,
		subject,
		html,
		text
	});

	return { sent: true, skipped: false };
};

module.exports = {
	sendEmail,
	hasEmailConfig
};
