// [REQUIRE] //
require('dotenv').config()


module.exports = {
	// [HEROKU] NODE_ENV - PORT //
	nodeENV: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 5000,
	
	// [APP] //
	app: {
		// [MONGODB] //
		mongoURI: process.env.APP__MONGO_URI || '',
		
		// [CUSTOM-HOME] //
		customHome: process.env.APP__CUSTOM_HOME || 'false',
		
		// [SECRET] //
		secretKey: process.env.APP__SECRET_KEY || 'secret',

		// [BASE-URL] //
		baseURL: {
			client: process.env.APP__BASE_URL || 'http://localhost:8080',
			server: process.env.APP__BASE_URL || 'http://localhost:5000',
		}
	},
	
	// [COMPANY] //
	company: {
		name: process.env.COMPANY__NAME || 'Company Name',

		products: {
			subscriptions: {
				tier1PriceId: process.env.COMPANY__PRODUCTS__SUBSCRIPTIONS__TIER_1_PRICE_ID,
				tier2PriceId: process.env.COMPANY__PRODUCTS__SUBSCRIPTIONS__TIER_2_PRICE_ID,
			},
		},
	},
	
	// [FUNCTIONALITY] //
	functionality: {
		admin: process.env.FUNCTIONALITY__ADMIN || 'false',
		blogPost: process.env.FUNCTIONALITY__BLOG_POST || 'false',
		user: process.env.FUNCTIONALITY__USER || 'false',
		payment: process.env.FUNCTIONALITY__PAYMENT || 'false',
		post: process.env.FUNCTIONALITY__POST || 'false',
		comment: process.env.FUNCTIONALITY__COMMENT || 'false',
	},
	
	// [EMAIL] //
	email: {
		address: process.env.EMAIL__ADDRESS || '',
	},

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
}