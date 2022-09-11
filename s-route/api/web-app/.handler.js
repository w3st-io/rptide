// [REQUIRE]
const mongoose = require('mongoose');
const validator = require('validator');


// [REQUIRE] Personal
const WebAppModel = require('../../../s-models/WebAppModel');
const WebContentModel = require('../../../s-models/WebContentModel');


// [INIT]
let returnObj = {
	executed: true,
	status: false,
	location: '/api/web-app',
	message: '',
};


module.exports = {
	create: async ({ req }) => {
		// [INIT]
		let childReturnObj = {
			...returnObj,
			location: returnObj.location + '/create',
			message: 'Created WebApp'
		};

		try {
			// [VALIDATE] //
			if (!req.body.webApp.name) {
				console.log('RUNNING');
				return {
					...childReturnObj,
					message: 'Invalid Params'
				};
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
				...childReturnObj,
				status: true,
				createdWebApp: result,
				webApps: resultWebApp,
			}
		}
		catch (err) {
			return {
				...childReturnObj,
				executed: false,
				message: err,
			}
		}
	},


	findOne: async ({ req }) => {
		// [INIT]
		let childReturnObj = {
			...returnObj,
			location: returnObj.location + '/find-one',
		};

		const result = await WebAppModel.findOne({
			user: req.user_decoded._id,
			_id: req.body.webApp._id,
		})

		return {
			...childReturnObj,
			status: true,
			webApp: result,
		}
	},


	findOneAndUpdate: async ({ req }) => {
		// [INIT]
		let childReturnObj = {
			...returnObj,
			location: returnObj.location + '/find-one-and-update',
			message: 'Successfully updated WebContent'
		};

		try {
			const result = await WebAppModel.findOneAndUpdate(
				{
					user: req.user_decoded._id,
					_id: req.body.webApp._id,
				},
				{
					$set: {
						name: req.body.webApp.name,
					}
				},
				{ new: true },
			).select().exec()

			const resultWebApp = await WebAppModel.find({
				user: req.user_decoded._id
			})

			return {
				...childReturnObj,
				status: true,
				webContent: result,
				webApps: resultWebApp,
			}
		}
		catch (err) {
			return {
				...childReturnObj,
				executed: false,
				message: err,
			}	
		}
	},


	deleteOne: async ({ req }) => {
		// [INIT]
		let childReturnObj = {
			...returnObj,
			location: returnObj.location + '/delete-one',
			message: 'Deleted WebApp',
		};

		try {
			const user_id = req.user_decoded._id
			const webApp_id = req.body.webApp._id

			// [VALIDATE] webApp_id //
			if (!validator.isAscii(webApp_id)) {
				return {
					...childReturnObj,
					message: 'Invalid Params'
				}
			}

			// [WebApp][DELETE] //
			const result = await WebAppModel.deleteOne({
				_id: webApp_id,
				user: user_id
			})

			// [WebApp][DELETE] //
			const resultWebContents = await WebContentModel.deleteMany({
				webApp: webApp_id,
				user: user_id
			})

			const webApps = await WebAppModel.find({ user: user_id })
			
			return {
				...childReturnObj,
				status: true,
				deleted: {
					webApp: result,
					webContents: resultWebContents,
				},
				webApps: webApps
			}
		}
		catch (err) {
			return {
				...childReturnObj,
				executed: false,
				message: err,
			}
		}
	}
}