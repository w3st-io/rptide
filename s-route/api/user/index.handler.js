// [REQUIRE] //
const bcrypt = require('bcryptjs');
const validator = require('validator');


// [REQUIRE] Personal //
const UserCollection = require('../../../s-collections/UserCollection');
const UserModel = require('../../../s-models/UserModel');


// [INIT] //
const location = '/user/index'


module.exports = {
	/**
	 * @notice Update User
	 * @param {string} req.body.img_url
	 * @returns {object} Updated user
	 */
	update: async ({ req }) => {
		try {
			// [VALIDATE] //
			if (!validator.isAscii(req.body.img_url)) {
				return {
					executed: true,
					status: false,
					location: `${location}`,
					message: 'Invalid params',
				}
			}

			const returned = await UserCollection.c_update({
				user_id: req.user_decoded._id,
				img_url: req.body.img_url,
				bio: req.body.bio
			})
	
			return returned
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}`,
				message: `Error --> ${err}`,
			}
		}
	},

	/**
	 * @notice Update user.workspace.webApp
	 * @param {string} req.body.webApp webApp to be updated too
	 */
	updateWorkspacewebApp: async ({ req }) => {
		// [UPDATE] Password for User //
		const userObj = await UserModel.findOneAndUpdate(
			{ _id: req.user_decoded._id },
			{
				$set: {
					"workspace.webApp": req.body.webApp
				}
			},
			{ returnOriginal: false }
		)

		console.log(userObj.workspace);

		return userObj
	},


	changePassword: async ({ req }) => {
		try {
			if (
				!validator.isAscii(req.body.currentPassword) ||
				!validator.isAscii(req.body.password)
			) {
				return {
					executed: true,
					status: false,
					location: `${location}/change-password`,
					message: `Invalid Params`,
				}
			}

			const userObj = await UserCollection.c_read(
				req.user_decoded._id
			)
			
			if (!userObj.status) { return userObj }

			// [VALIDATE-PASSWORD] //
			if (!bcrypt.compareSync(req.body.currentPassword, userObj.user.password)) {
				return {
					executed: true,
					status: false,
					location: `${location}/change-password`,
					message: `Invalid password`,
				}
			}

			// [MONGODB][UPDATE] user.password //
			await UserModel.findOneAndUpdate(
				{ _id: req.user_decoded._id },
				{
					$set: {
						password: await bcrypt.hash(req.body.password, 10)
					}
				}
			)

			return {
				executed: true,
				status: true,
				message: `${location}: Updated password`,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}/change-password`,
				message: `Error --> ${err}`,
			}
		}
	},


	generateApiKey: async ({ req }) => {
		try {
			const userObj = await UserCollection.c_read_select({
				user_id: req.user_decoded._id
			})
	
			const pk = await UserCollection.c_create_apiPrivateKey({
				user_id: userObj.user._id
			})
	
			return {
				executed: true,
				status: true,
				location: `${location}/generate-api-key`,
				privateKey: pk.privateKey
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}/generate-api-key`,
				message: `Error --> ${err}`,
			}
		}
	},
}