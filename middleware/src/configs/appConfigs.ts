import * as dotenv from "dotenv";

dotenv.config();

const APPCONFIGS = {
	PORT: process.env.PORT || 8000,
	BASE_PATH: "/api",
	BASE_URL: process.env.BASE_URL,
	DIRECTUS: {
		ENDPOINT: process.env.DIRECTUS_ENDPOINT,
		TOKEN: process.env.DIRECTUS_TOKEN,
		USER: process.env.DIRECTUS_USER,
		PASSWORD: process.env.DIRECTUS_PASSWORD,
		PORTAL: process.env.DIRECTUS_PORTAL
	},
	MAIL: {
		TRANSPORT: process.env.EMAIL_TRANSPORT,
		FROM: process.env.EMAIL_FROM,
		SMTP_HOST: process.env.EMAIL_SMTP_HOST,
		SMTP_PORT: process.env.EMAIL_SMTP_PORT,
		SMTP_USER: process.env.EMAIL_SMTP_USER,
		SMTP_PASSWORD: process.env.EMAIL_SMTP_PASSWORD,
		SMTP_SECURE: process.env.EMAIL_SMTP_SECURE,
		OTP_SUBJECT: process.env.EMAIL_OTP_SUBJECT
	},
	JWT: {
		EXPIRATION: Math.floor(Date.now() / 1000) + 60 * 60, //1h
		COOKIE_EXPIRATION: 360,
		SECRET: process.env.JWT_SECRET
	},
	SESSION: {
		SESSION_SECRET: process.env.SESSION_SECRET
	},
	PASSPORT: {
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
		APPLE_SERVICE_ID: process.env.APPLE_SERVICE_ID,
		APPLE_TEAM_ID: process.env.APPLE_TEAM_ID,
		KEY_IDENTIFIER: process.env.KEY_IDENTIFIER
	},
	STRIPE: {
		KEY: {
			PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
			SECRET_KEY: process.env.STRIPE_SECRET_KEY,
			//WEBHOOK_SECRET_LOCAL: "whsec_b2ca57723a099c1a2fc9dd60bf686305c07d17684609b02df78232881a96dc37"
			WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
		}
	},
	PAYPAL: {
		KEY: {
			CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
			CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
			WEBHOOK_SECRET: process.env.PAYPAL_WEBHOOK_SECRET
		},
		VERSION: "v1",
		URL: {
			SANDBOX: process.env.PAYPAL_SANDBOX_URL,
			LIVE: process.env.PAYPAL_LIVE_URL
		}
	},
	SOCIAL_MEDIA: {
		GOOGLE: {
			NAME: "GOOGLE",
			TOKEN_AUTH_URL: "https://www.googleapis.com/oauth2/v3/tokeninfo"
		},
		APPLE: {
			NAME: "APPLE"
		}
	}
};

export default APPCONFIGS;
