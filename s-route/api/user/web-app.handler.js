// [REQUIRE] //
const validator = require('validator')


// [REQUIRE] Personal //
const WebAppCollection = require('../../../s-collections/WebAppCollection')
const WebAppModel = require('../../../s-models/WebAppModel')


// [INIT] //
const location = '/web-app'


module.exports = {
	create: async ({ req }) => {
		try {
			const user_id = req.user_decoded._id
			const name = req.body.webApp.name

			// [VALIDATE] //
			if (!name) {
				return {
					executed: true,
					status: false,
					location: `${location}/create`,
					message: `${location}: Invalid Params`,
				}
			}

			// [COLLECTION][webApp][CREATE] //
			const STObj = await WebAppCollection.c_create({
				user_id: user_id,
				name: name,
			})

			if (!STObj.status) { return STObj }

			const webApps = await WebAppModel.find({ user: user_id })

			// [SUCCESS] //
			return {
				executed: true,
				status: true,
				createdWebApp: STObj.createdWebApp,
				webApps: webApps,
				message: 'CREATED webApp'
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


	deleteWebApp: async ({ user_id, webApp_id }) => {
		try {
			// [VALIDATE] webApp_id //
			if (!validator.isAscii(webApp_id)) {
				return {
					executed: true,
					status: false,
					location: `${location}/delete`,
					message: 'Invalid Params'
				}
			}

			// [COLLECTION][Post][DELETE] //
			const deletePostObj = await WebAppCollection.c_deleteOne_byIdAndUser({
				webApp_id: webApp_id,
				user_id: user_id
			})

			if (!deletePostObj.status) { return deletePostObj }
			
			return {
				executed: true,
				status: true,
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