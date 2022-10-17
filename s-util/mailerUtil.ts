// [IMPORT]
import validator from "validator";
import mongoose from "mongoose";


// [IMPORT] Personal
import config from '../s-config';


// [REQUIRE]
const SibApiV3Sdk = require('sib-api-v3-sdk');


// [SibApiV3Sdk] Configure API key authorization: api-key
let apiKey = SibApiV3Sdk.ApiClient.instance.authentications['api-key'];


// [SET]
apiKey.apiKey = config.api.sendinBlue.key;


function mail({ to, subject, textContent }) {
	let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
	let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

	sendSmtpEmail = {
		sender: {
			email: config.email.address
		},
		
		to: [
			{ email: to },
		],

		subject: subject,
		textContent: textContent,
	};

	apiInstance.sendTransacEmail(sendSmtpEmail)
		.then(
			function (data) { console.log('[MAIL-SENT]:', data) },
			function (err) { console.log('Mailer Util --> [ERROR]:', err) }
		)
	;
}


export default {
	// [VERIFICATION]
	sendVerificationMail: async function (to, user_id, VCode) {
		try {
			// [VALIDATE]
			if (
				!validator.isEmail(to) ||
				!mongoose.isValidObjectId(user_id) ||
				!validator.isAscii(VCode)
			) {
				return {
					executed: true,
					status: false,
					message: 'mailerUtil: Invalid params'
				};
			}

			mail({
				to: to,
				subject: `Verify Your RpTide Account`,
				textContent: `
					<h1>
						Thank you for creating an account at RpTide!
					<h1/>
					<h3>
						Please click the button below to verify your account
					</h3>
					<a href="${config.app.baseURL.client}/user/verify/${user_id}/${VCode}">
						<button>Click to Verify</button>
					</a>
				`
			});
	
			return {
				executed: true,
				status: true,
				message: 'Email Sent',
			};
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `mailerUtil: Error --> ${err}`,
			};
		}
	},


	// [RESET-PASSWORD]
	sendPasswordResetEmail: async function (to, user_id, VCode) {
		try {
			// [VALIDATE]
			if (
				!validator.isEmail(to) ||
				!mongoose.isValidObjectId(user_id) ||
				!validator.isAscii(VCode)
			) {
				return {
					executed: true,
					status: false,
					message: 'mailerUtil: Invalid params'
				};
			}

			mail({
				to: to,
				subject: `RpTide: Password Reset`,
				textContent: `
					<h1>Click the Link Below to Reset Your Password<h1/>
					<h3>
						If you did not request to change your password please ignore this email
					</h3>
					<a href="${config.app.baseURL.client}/password/reset/${user_id}/${VCode}">
						<button>Click to Reset Password</button>
					</a>
				`
			});
	
			return {
				executed: true,
				status: true,
				message: 'Email Sent'
			};
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `mailerUtil: Error --> ${err}`,
			};
		}
	},
}