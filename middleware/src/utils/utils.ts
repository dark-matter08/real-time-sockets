import otpGenerator from "otp-generator";
import bcrypt from "bcryptjs";

export default class Utils {
	public async generateOTP(count: number) {
		const code = otpGenerator.generate(count, {
			upperCaseAlphabets: false,
			specialChars: false,
			lowerCaseAlphabets: false
		});

		const salt = await bcrypt.genSalt(12);
		const signedCode = await bcrypt.hash(code, salt);

		return {
			code,
			signedCode
		};
	}
}
