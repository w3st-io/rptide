// [REQUIRE] Personal
import rateLimit from "express-rate-limit";


// [INIT] Const
const defaultMessage = "Too many requests, please try again later";


export default {
	// [GLOBAL]
	global: rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 500,
		message: {
			executed: true,
			status: false,
			message: defaultMessage,
		}
	}),


	// [REGISTRATION]
	registration: rateLimit({
		windowMs: 60 * 60 * 1000,
		max: 20,
		message: {
			executed: true,
			status: false,
			message: defaultMessage,
		}
	}),


	// [GENERATE-API-KEY]
	generateApiKey: rateLimit({
		windowMs: 60 * 60 * 1000,
		max: 1,
		message: {
			executed: true,
			status: false,
			message: defaultMessage,
		}
	}),
};