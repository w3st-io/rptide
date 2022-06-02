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
				user: req.user_decoded._id,
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
			req.body.webContent.user = req.user_decoded._id

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
			// [WEB-CONTENT][SAVE] //
			const result = await WebContentModel.find({
				webApp: req.body.webApp,
			})

			return {
				status: true,
				executed: true,
				webContents: result,
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


	findOne: async ({ req }) => {
		try {
			// [WEB-CONTENT][SAVE] //
			const result = await WebContentModel.findOne({
				_id: req.body.webContent,
			})

			return {
				status: true,
				executed: true,
				webContent: result,
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

	findOneAndUpdate: async ({ req }) => {
		try {
			const result = await WebContentModel.findOneAndUpdate(
				{
					user: req.user_decoded._id,
					_id: req.body.webContent._id,
				},
				{
					$set: {
						name: req.body.webContent.name,
						connectedWalletRequired: req.body.webContent.connectedWalletRequired,
						WebContent_responseTo: req.body.webContent.WebContent_responseTo,
						tags: req.body.webContent.tags,
						likeCount: req.body.webContent.likeCount,
						liked: req.body.webContent.liked,
						draft: req.body.webContent.draft,
						cleanJSON: req.body.webContent.cleanJSON,
					}
				},
				{ new: true },
			).select().exec()

			return {
				status: true,
				executed: true,
				webContent: result,
				message: 'Successfully updated WebContent'
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: err
			}	
		}
	}
}