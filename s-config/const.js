// [REQUIRE]
require('dotenv').config()


module.exports = {
	// [LIMITS]
	limit: {
		webApp: [3, 10, 50],
		product: [25, 100, 500],
		productOptions: [20, 100, 500],
	},
}