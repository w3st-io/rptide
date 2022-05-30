// [REQUIRE] //
const validator = require('validator')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const WebAppModel = require('../../../s-models/WebAppModel')
const WebContentModel = require('../../../s-models/WebContentModel')


// [INIT] //
const location = '/web-app'


module.exports = {
	createWebContent: async ({ req }) => {
		try {
			// Check if owned
			const webApp = await WebAppModel.findOne({
				_id: req.body.webContent.webApp,
				user: req.user_decoded.user_id,
			})
			
			// does not own this webApp
			if (!webApp) {
				return {
					executed: true,
					status: false,
					message: 'You do not own this webApp',
				}
			}

			// [OVERRIDE] the user passed by the token //
			req.body.webContent.user = req.user_decoded.user_id

			// [WEB-CONTENT][SAVE] //
			const result = await new WebContentModel({
				_id: mongoose.Types.ObjectId(),
				...req.body.webContent,
			}).save()

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


	find: async ({ req }) => {
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