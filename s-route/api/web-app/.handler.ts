// [IMPORT]
import express from "express";
import mongoose from "mongoose";

// [IMPORT] Personal
import UserModel from "../../../s-model/User.model";
import WebAppModel, { IWebApp } from "../../../s-model/WebApp.model";
import WebContentModel from "../../../s-model/WebContent.model";


// [REQUIRE] Personal
const config = require("../../../s-config");


// [INIT]
let returnObj: any = {
	executed: true,
	status: false,
	location: "/api/web-app",
	message: ""
};


export default {
	/**
	 * @notice Create a Web App
	 * @param {String} req.body.webApp.name Name of the WebApp
	 * @returns {Object}
	*/
	"/create": async (req: express.Request): Promise<object> => {
		// [INIT]
		let _returnObj: any = {
			...returnObj,
			location: returnObj.location + "/create",
			message: "Created WebApp"
		};

		try {
			// [COLLECTION][webApp]
			const result = await new WebAppModel({
				_id: new mongoose.Types.ObjectId(),
				user: req.body.user_decoded._id,
				name: req.body.webApp.name,
			}).save();

			const results: IWebApp[] = await WebAppModel.find({
				user: req.body.user_decoded._id
			});

			// [200] Success
			return {
				..._returnObj,
				status: true,
				createdWebApp: result,
				webApps: results,
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
	"/find-one": async (req: express.Request): Promise<object> => {
		// [INIT]
		let _returnObj: any = {
			...returnObj,
			location: returnObj.location + "/find-one",
		};

		const result: IWebApp = await WebAppModel.findOne({
			user: req.body.user_decoded._id,
			_id: req.body.webApp._id,
		});

		// [200] Success
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
	"/find-one-and-update": async (req: express.Request): Promise<object> => {
		// [INIT]
		let _returnObj: any = {
			...returnObj,
			location: returnObj.location + "/find-one-and-update",
			message: "Successfully updated WebContent"
		};

		try {
			const result: IWebApp = await WebAppModel.findOneAndUpdate(
				{
					user: req.body.user_decoded._id,
					_id: req.body.webApp._id,
				},
				{
					$set: {
						name: req.body.webApp.name,
					}
				},
				{ new: true },
			);

			const resultWebApp: IWebApp[] = await WebAppModel.find({
				user: req.body.user_decoded._id
			});

			// [200] Success
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
	"/delete-one": async (req: express.Request): Promise<object> => {
		// [INIT]
		let _returnObj: any = {
			...returnObj,
			location: returnObj.location + "/delete-one",
			message: "Deleted WebApp",
			deleted: {},
		};

		try {
			// [VALIDATE] webApp_id
			if (!mongoose.isValidObjectId(req.body.webApp._id)) {
				return {
					..._returnObj,
					message: "Invalid params"
				};
			}

			// [WebApp][DELETE]
			_returnObj.deleted = {
				..._returnObj.deleted,
				webApp: await WebAppModel.deleteOne({
					_id: req.body.webApp._id,
					user: req.body.user_decoded._id
				})
			};

			// If Safe Mode is off
			if (!config.app.safeMode) {
				// [WebApp][DELETE] All associated Web Contents
				_returnObj.deleted = {
					..._returnObj.deleted,
					webContents: await WebContentModel.deleteMany({
						webApp: req.body.webApp._id,
						user: req.body.user_decoded._id
					})
				};
			}

			// [RESET] workspace.webApp
			await UserModel.findOneAndUpdate(
				{ user: req.body.user_decoded._id },
				{
					$set: {
						"workspace.webApp": ""
					}
				}
			);

			const webApps: IWebApp[] = await WebAppModel.find({
				user: req.body.user_decoded._id
			});
			
			// [200] Success
			return {
				..._returnObj,
				status: true,
				webApps: webApps
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