// [REQUIRE] //
const validator = require('validator')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const WebContentModel = require('../../../s-models/WebContentModel')


// [INIT] //
const location = '/web-app'


module.exports = {
	createWebApp: async ({ user_id }) => {
		try {
			// [WEB-CONTENT][SAVE] //
			const result = await new WebContentModel({
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				webApp: '62927b911537e8cc8ea960ff'
			}).save()
	
			console.log(result);
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