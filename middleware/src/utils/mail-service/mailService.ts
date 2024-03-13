import nodemailer from "nodemailer";
import { APPCONFIGS } from "../../configs";

const transporter = nodemailer.createTransport({
	host: APPCONFIGS.MAIL.SMTP_HOST,
	port: APPCONFIGS.MAIL.SMTP_PORT,
	secure: APPCONFIGS.MAIL.SMTP_SECURE,
	// requireTLS: true,
	// tls: { rejectUnauthorized: false },
	auth: {
		user: APPCONFIGS.MAIL.SMTP_USER,
		pass: APPCONFIGS.MAIL.SMTP_PASSWORD
	}
});

export default class MailService {
	public async sendMail(
		to: string,
		subject: string,
		text: string,
		attachments = []
	): Promise<any> {
		const mailOptions = {
			from: APPCONFIGS.MAIL.FROM,
			to: to,
			subject: subject,
			attachments: attachments,
			text: text
		};

		const results = await transporter.sendMail(mailOptions);

		if (results['accepted'].length !== 0) {
			return { sent: true };
		} else {
			return { sent: false, error: 'Error occured sending email' };
		}
		
	}
}
