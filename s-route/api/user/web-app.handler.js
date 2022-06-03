// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const WebAppModel = require('../../../s-models/WebAppModel')


// [INIT] //
const location = '/web-app'


module.exports = {
	create: async ({ req }) => {
		try {
			// [VALIDATE] //
			if (!req.body.webApp.name) {
				return {
					executed: true,
					status: false,
					location: `${location}/create`,
					message: `${location}: Invalid Params`,
				}
			}

			// [COLLECTION][webApp][SAVE] //
			const result = await new WebAppModel({
				_id: mongoose.Types.ObjectId(),
				user: req.user_decoded._id,
				name: req.body.webApp.name,
			}).save()

			const resultWebApp = await WebAppModel.find({
				user: req.user_decoded._id
			})

			// [SUCCESS] //
			return {
				executed: true,
				status: true,
				message: 'Created webApp',
				createdWebApp: result,
				webApps: resultWebApp,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}/create`,
				message: `${location}: Error --> ${err}`,
			}
		}
	},


	findOne: async ({ req }) => {
		const result = await WebAppModel.findOne({
			user: req.user_decoded._id,
			_id: req.body.webApp._id,
		})

		return {
			status: true,
			executed: true,
			webApp: result,
		}
	},


	deleteOne: async ({ req }) => {
		try {
			const user_id = req.user_decoded._id
			const webApp_id = req.body.webApp._id

			// [VALIDATE] webApp_id //
			if (!validator.isAscii(webApp_id)) {
				return {
					executed: true,
					status: false,
					location: `${location}/delete`,
					message: 'Invalid Params'
				}
			}

			// [WebApp][DELETE] //
			const result = await WebAppModel.deleteOne({
				_id: webApp_id,
				user: user_id
			})

			const webApps = await WebAppModel.find({ user: user_id })
			
			return {
				executed: true,
				status: true,
				deleted: {
					webApp: result,
				},
				webApps: webApps,
				location: `${location}/delete`,
				message: 'DELETED SectionText',
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}/delete`,
				message: `Error --> ${err}`,
			}
		}
	}
}