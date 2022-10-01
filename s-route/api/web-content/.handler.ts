// [IMPORT]
import mongoose from "mongoose";


// [IMPORT] Personal
import WebAppModel from "../../../s-models/WebApp.model";
import WebContentModel from "../../../s-models/WebContentModel";


// [INIT]
let returnObj: any = {
	executed: true,
	status: false,
	location: "/api/web-content",
	message: ""
};


export default {
	"/create": async ({ req }: any): Promise<object> => {
		// [INIT]
		let _returnObj: any = {
			...returnObj,
			message: "Created WebContent",
			location: returnObj.location + "/create"
		};

		try {
			// Check if owned
			const webApp = await WebAppModel.findOne({
				_id: req.body.webContent.webApp,
				user: req.user_decoded._id,
			});
			
			// does not own this webApp
			if (!webApp) {
				return {
					..._returnObj,
					message: "You do not own this webApp",
				};
			}

			// [OVERRIDE] the user passed by the token
			req.body.webContent.user = req.user_decoded._id;

			// [WEB-CONTENT][SAVE]
			const result = await new WebContentModel({
				_id: new mongoose.Types.ObjectId(),
				...req.body.webContent,
			}).save();

			return {
				..._returnObj,
				status: true,
				result: result,
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`
			};
		}
	},


	/**
	 * 
	 * @param {String} req.body.webApp Filter WebContents by this
	 * @returns {Object}
	*/
	"/find": async ({ req }: any): Promise<object> => {
		// [INIT]
		let _returnObj: any = {
			...returnObj,
			message: "Found WebContent",
			location: returnObj.location + "/find"
		};

		try {
			// [WEB-CONTENT][SAVE]
			const result = await WebContentModel.find({
				webApp: req.body.webApp,
			});

			return {
				..._returnObj,	
				status: true,
				webContents: result,
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`
			};
		}
	},


	"/find-paginated/:limit/:page": async ({ req }: any): Promise<object> => {
		// [INIT]
		let _returnObj: any = {
			...returnObj,
			message: "WebContent(s) found",
			location: returnObj.location + "/find-paginated"
		};

		try {
			// [INIT] Const
			const limit = parseInt(req.params.limit);
			const skip = (parseInt(req.params.page) - 1) * limit;

			// [query]
			let query: any = { user: req.user_decoded._id };

			if (req.body.webApp) {
				query = {
					...query,
					webApp: req.body.webApp,
				};
			}

			if (req.body.visible) {
				query = {
					...query,
					visible: req.body.visible,
				};
			}

			if (req.body.tags) {
				query = {
					...query,
					tags: { $all: req.body.tags }
				};
			}

			if (req.body.notInTags) {
				query = {
					...query,
					tags: { $nin: req.body.notInTags } 
				};
			}

			// [sort]
			let sort;

			switch (req.query.sort) {
				case "newest":
					sort = { createdTimeStamp: -1 };
				break;
			
				default:
					sort = {};
				break;
			}

			// [limit]
			if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
				return {
					..._returnObj,
					message: "Invalid limit"
				};
			}

			// [WEB-CONTENT][FIND]
			const result = await WebContentModel.find(query)
				.sort(sort)
				.limit(limit)
				.skip(skip)
			.exec();

			return {
				..._returnObj,
				webContents: result
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`
			};
		}
	},


	"/find-one": async ({ req }: any): Promise<object> => {
		// [INIT]
		let _returnObj: any = {
			...returnObj,
			message: "WebContent found",
			location: returnObj.location + "/find-one"
		};

		try {
			// [WEB-CONTENT][SAVE]
			const result = await WebContentModel.findOne({
				_id: req.body.webContent
			});

			return {
				..._returnObj,
				status: true,
				webContent: result
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`
			};
		}
	},

	"/find-one-and-update": async ({ req }: any): Promise<object> => {
		// [INIT]
		let _returnObj: any = {
			...returnObj,
			message: "Successfully updated WebContent",
			location: returnObj.location + "/find-one-and-update"
		};

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
			);

			return {
				..._returnObj,
				status: true,
				webContent: result
			}
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`
			}
		}
	},

	"/delete-one": async ({ req }: any): Promise<object> => {
		// [INIT]
		let _returnObj: any = {
			...returnObj,
			message: "Successfully deleted WebContent",
			location: returnObj.location + "/find-one-and-update"
		};

		try {
			// [MONGODB][WebContent]
			const result = await WebContentModel.deleteOne(
				{
					user: req.user_decoded._id,
					_id: req.body.webContent._id,
				},
				
			).exec()

			return {
				..._returnObj,
				status: true,
				webContent: result,
			}
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`
			}
		}
	},
}