// [REQUIRE]
require('dotenv').config()


module.exports = {
	// [LIMITS]
	limit: {
		webApp: [3, 6, 10],
		product: [25, 100, 500],
		productOptions: [20, 100, 500],
	},
}