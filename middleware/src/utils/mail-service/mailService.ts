import nodemailer from "nodemailer";
import { APPCONFIGS } from "../../configs";

const transporter = nodemailer.createTransport({
	host: APPCONFIGS.MAIL.SMTP_HOST,
	port: APPCONFIGS.MAIL.SMTP_PORT,
	secure: false,
	requireTLS: true,
	tls: { rejectUnauthorized: false },
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
			html: text
		};

		transporter.sendMail(mailOptions, (error: any, info: any) => {
			if (error) {
				console.log(error);
				return { sent: false, error: error };
			}
			console.log(info);
			return { sent: true };
		});
	}
}
