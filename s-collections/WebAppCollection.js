// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const WebAppModel = require('../s-models/WebAppModel')


// [INIT] //
const location = 'WebAppCollection'


module.exports = {
	/******************* [CRUD] *******************/
	// [READ] //
	c_read: async (user_id, webApp_id) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'WebAppCollection: Invalid user_id',
				}
			}
	
			// [VALIDATE] webApp_id //
			if (!mongoose.isValidObjectId(webApp_id)) {
				return {
					executed: true,
					status: false,
					message: 'WebAppCollection: Invalid webApp_id',
				}
			}
	
			let webApp = await WebAppModel.findById(webApp_id)
				.populate({
					path: 'user',
					select: 'username email bio profile_img',
				})
				.exec()
	
			// Check if webApp found //	
			if (!webApp) {
				return {
					executed: true,
					status: false,
					webApp: webApp,
					message: 'WebAppCollection: No webApp found'
				}
			}
			
			return {
				executed: true,
				status: true,
				webApp: webApp
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `${location}: Error --> ${err}`
			}
		}
	},


	// [DELETE] //
	c_delete: async (webApp_id) => {
		try {
			// [VALIDATE] webApp_id //
			if (!mongoose.isValidObjectId(webApp_id)) {
				return {
					executed: true,
					status: false,
					message: 'WebAppCollection: Invalid webApp_id',
					deleted: false,
				}
			}
	
			const deletedWebApp = await WebAppModel.findByIdAndDelete(webApp_id)
			
			return {
				executed: true,
				status: true,
				deleted: true,
				deletedWebApp: deletedWebApp,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `${location}: Error --> ${err}`,
				deleted: false,
			}
		}
	},


	/******************* [BLOG-CRUD] *******************/
	// [BLOG] //
	c_readAll_sorted_byUser: async ({ user_id, sort = 0, limit, skip }) => {
		try {
			// [SANITIZE] //
			sort = parseInt(sort)
			limit = parseInt(limit)
			skip = parseInt(skip)
	
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'WebAppCollection: Invalid user_id',
				}
			}
	
			// [VALIDATE] sort //
			if (!Number.isInteger(sort)) {
				return {
					executed: true,
					status: false,
					message: 'WebAppCollection: Invalid sort',
				}
			}
	
			// [VALIDATE] limit //
			if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
				return {
					executed: true,
					status: false,
					message: 'WebAppCollection: Invalid limit',
				}
			}
	
			// [VALIDATE] skip //
			if (!Number.isInteger(skip)) {
				return {
					executed: true,
					status: false,
					message: 'WebAppCollection: Invalid skip',
				}
			}
	
			// Set Sort //
			if (sort == 0) { sort = { createdAt: -1 } }
			else {
				return {
					executed: true,
					status: false,
					message: 'WebAppCollection: Unknown filter'
				}
			}
	
			const webApps = await WebAppModel.find({ user: user_id })
				.sort(sort)
				.limit(limit)
				.skip(skip)
				.populate({
					path: 'user',
					select: 'username bio profile_img',
				})
				.exec()
	
			return {
				executed: true,
				status: true,
				webApps: webApps,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `${location}: Error --> ${err}`,
			}
		}
	},


	/******************* [COUNT] *******************/
	c_count_byUser: async ({ user_id }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'WebAppCollection: Invalid user_id',
					updated: false,
				}
			}
	
			const count = await WebAppModel.countDocuments({ user: user_id })
	
			return {
				executed: true,
				status: true,
				count: count
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `${location}: Error --> ${err}`,
			}
		}
	},
}