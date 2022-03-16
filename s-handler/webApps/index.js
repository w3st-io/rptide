// [REQUIRE] //
const validator = require('validator')


// [REQUIRE] Personal //
const WebAppCollection = require('../../s-collections/WebAppCollection')


// [INIT] //
const location = '/s-handler/web-app'


module.exports = {
	createWebApp: async ({ user_id, title }) => {
		try {
			// [VALIDATE] //
			if (!title) {
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
				title: title,
			})

			if (!STObj.status) { return STObj }

			// [SUCCESS] //
			return {
				executed: true,
				status: true,
				createdWebApp: STObj.createdWebApp,
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