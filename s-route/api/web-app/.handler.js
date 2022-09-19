// [REQUIRE]
const mongoose = require('mongoose');
const validator = require('validator');


// [REQUIRE] Personal
const config = require('../../../s-config');
const UserModel = require('../../../s-models/UserModel');
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
	/**
	 * @notice Create a Web App
	 * @param {String} req.body.webApp.name Name of the web app
	 * @returns {Object}
	*/
	create: async ({ req }) => {
		// [INIT]
		let _returnObj = {
			...returnObj,
			location: returnObj.location + '/create',
			message: 'Created WebApp'
		};

		try {
			// [VALIDATE]
			if (!req.body.webApp.name) {
				console.log('RUNNING');
				return {
					..._returnObj,
					message: 'Invalid params'
				};
			}

			// [COLLECTION][webApp]
			const result = await new WebAppModel({
				_id: mongoose.Types.ObjectId(),
				user: req.user_decoded._id,
				name: req.body.webApp.name,
			}).save();

			const resultWebApp = await WebAppModel.find({
				user: req.user_decoded._id
			});

			// [SUCCESS]
			return {
				..._returnObj,
				status: true,
				createdWebApp: result,
				webApps: resultWebApp,
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`,
			};
		}
	},


	/**
	 * @notice Find One Web App
	 * @param {String} req.body.webApp._id
	 * @returns {Object}
	*/
	findOne: async ({ req }) => {
		// [INIT]
		let _returnObj = {
			...returnObj,
			location: returnObj.location + '/find-one',
		};

		const result = await WebAppModel.findOne({
			user: req.user_decoded._id,
			_id: req.body.webApp._id,
		});

		return {
			..._returnObj,
			status: true,
			webApp: result,
		};
	},


	/**
	 * @notice Find One Web App & Update
	 * @param {String} req.body.webApp._id
	 * @param {String} req.body.webApp.name
	 * @returns {Object}
	*/
	findOneAndUpdate: async ({ req }) => {
		// [INIT]
		let _returnObj = {
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
			).select().exec();

			const resultWebApp = await WebAppModel.find({
				user: req.user_decoded._id
			});

			return {
				..._returnObj,
				status: true,
				webContent: result,
				webApps: resultWebApp,
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`,
			};
		}
	},


	/**
	 * @notice Find One Web App by _id and user_id
	 * @param {String} req.body.webApp._id
	*/
	deleteOne: async ({ req }) => {
		// [INIT]
		let _returnObj = {
			...returnObj,
			location: returnObj.location + '/delete-one',
			message: 'Deleted WebApp',
			deleted: {},
		};

		try {
			// [VALIDATE] webApp_id
			if (!validator.isAscii(req.body.webApp._id)) {
				return {
					..._returnObj,
					message: 'Invalid params'
				};
			}

			// [WebApp][DELETE]
			_returnObj.deleted = {
				..._returnObj.deleted,
				webApp: await WebAppModel.deleteOne({
					_id: req.body.webApp._id,
					user: req.user_decoded._id
				})
			};

			if (!config.app.safeMode) {
				// [WebApp][DELETE] All associated Web Contents
				_returnObj.deleted = {
					..._returnObj.deleted,
					webContents: await WebContentModel.deleteMany({
						webApp: req.body.webApp._id,
						user: req.user_decoded._id
					})
				};
			}

			// [RESET] workspace.webApp
			await UserModel.findOneAndUpdate(
				{ user: req.user_decoded._id },
				{
					$set: {
						"workspace.webApp": ""
					}
				}
			);
			
			// [200]
			return {
				..._returnObj,
				status: true,
				webApps: await WebAppModel.find({ user: req.user_decoded._id })
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`,
			};
		}
	}
}