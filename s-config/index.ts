// [REQUIRE]
require('dotenv').config();

export default {
	// [HEROKU]
	nodeENV: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 5000,
	
	// [APP]
	app: {
		safeMode: process.env.APP__SAFE_MODE || true,

		// [MONGODB]
		mongoURI: process.env.APP__MONGO_URI || '',
		
		// [CUSTOM-HOME]
		customHome: process.env.APP__CUSTOM_HOME || 'false',
		
		// [SECRET]
		secretKey: process.env.APP__SECRET_KEY || 'secret',

		// [BASE-URL]
		baseURL: {
			client: process.env.APP__BASE_URL || 'http://localhost:8080',
			server: process.env.APP__BASE_URL || 'http://localhost:5000',
		}
	},
	
	// [FUNCTIONALITY]
	functionality: {
		user: process.env.FUNCTIONALITY__USER || 'false',
		commerce: process.env.FUNCTIONALITY__COMMERCE || 'false',
	},
	
	// [EMAIL]
	email: {
		address: process.env.EMAIL__ADDRESS || '',
	},

	// [API]
	api: {
		stripe: {
			secretKey: process.env.API__STRIPE__SECRET_KEY || '',
			priceTier1: process.env.API__STRIPE__PRICE_TIER_1 || '',
			priceTier2: process.env.API__STRIPE__PRICE_TIER_2 || '',
		},

		sendinBlue: {
			key: process.env.API__SENDINBLUE__KEY || '',
		},
	},

	// Time between each stripe check
	cycleHours: process.env.CYCLE_HOURS || .5
};