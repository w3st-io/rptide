// [REQUIRE]
const mongoose = require('mongoose')


// [REQUIRE] Personal
const WebAppModel = require('../../../s-models/WebAppModel')
const WebContentModel = require('../../../s-models/WebContentModel')


// [INIT]
const location = '/web-content'


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

			// [WEB-CONTENT][SAVE]
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
				message: err,
				location,
			}
		}
	},


	find: async ({ req }) => {
		try {
			// [WEB-CONTENT][SAVE]
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
				message: err,
				location,
			}
		}
	},


	findPaginated: async ({ req }) => {
		try {
			// [INIT] Const //
			const limit = parseInt(req.params.limit)
			const skip = (parseInt(req.params.page) - 1) * limit

			// [INIT]
			let query = { user: req.user_decoded._id }
			let sort

			// [query]
			if (req.body.webApp) {
				query = {
					...query,
					webApp: req.body.webApp,
				}
			}

			if (req.body.visible) {
				query = {
					...query,
					visible: req.body.visible,
				}
			}

			if (req.body.tags) {
				query = {
					...query,
					tags: { $all: req.body.tags } 
				}
			}

			if (req.body.notInTags) {
				query = {
					...query,
					tags: { $nin: req.body.notInTags } 
				}
			}

			// [sort]
			switch (req.query.sort) {
				case 'newest':
					sort = { createdTimeStamp: -1 }
				break
			
				default:
					sort = {}
				break
			}

			// [limit]
			if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
				return {
					executed: true,
					status: false,
					location: location,
					message: `${location}: Invalid limit`,
				}
			}
			
			console.log(query);

			// [WEB-CONTENT][FIND]
			const result = await WebContentModel.find(query)
				.sort(sort)
				.limit(limit)
				.skip(skip)
			.exec()

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
				location,
				message: `Caught error ${err}`,
			}
		}
	},


	findOne: async ({ req }) => {
		try {
			// [WEB-CONTENT][SAVE]
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
				message: err,
				location,
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
						visible: req.body.webContent.visible,
						cleanJSON: req.body.webContent.cleanJSON,
					}
				},
				{ new: true },
			).select().exec()

			return {
				status: true,
				executed: true,
				webContent: result,
				location,
				message: 'Successfully updated WebContent'
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: err,
				location,
			}
		}
	},

	deleteOne: async ({ req }) => {
		try {
			const result = await WebContentModel.deleteOne(
				{
					user: req.user_decoded._id,
					_id: req.body.webContent._id,
				},
				
			).exec()

			return {
				status: true,
				executed: true,
				webContent: result,
				location,
				message: 'Successfully deleted WebContent'
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location,
				message: err
			}
		}
	},
}