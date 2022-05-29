// [REQUIRE] //
const validator = require('validator')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const WebContentModel = require('../../../s-models/WebContentModel')


// [INIT] //
const location = '/web-app'


module.exports = {
	createWebApp: async ({ req }) => {
		try {
			// [OVERRIDE] the user passed by the token //
			req.body.webContent.user = req.user_decoded.user_id

			// [WEB-CONTENT][SAVE] //
			const result = await new WebContentModel({
				_id: mongoose.Types.ObjectId(),
				user: req.user_decoded.user_id,
				...req.body.webContent,
			}).save()
	
			console.log(result)

			return {
				status: true,
				executed: true,
				result: result,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: err
			}	
		}
	},
}