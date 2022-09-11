// [REQUIRE]
const bcrypt = require('bcryptjs');
const validator = require('validator');
const uuid = require('uuid')


// [REQUIRE] Personal
const UserModel = require('../../../s-models/UserModel');


// [INIT]
const location = '/user/index'


module.exports = {
	/**
	 * @notice Update User's profile image and bio
	 * @param {string} req.body.img_url
	 * @param {string} req.body.bio
	 * @returns {object} Updated user
	*/
	update: async ({ req }) => {
		try {
			// [VALIDATE]
			if (!validator.isAscii(req.body.img_url)) {
				return {
					executed: true,
					status: false,
					location: `${location}`,
					message: 'Invalid params',
				};
			}

			// [VALIDATE] bio //
			if (
				req.body.bio.includes('<script') ||
				req.body.bio.includes('</script>')
			) {
				return {
					executed: true,
					status: false,
					message: `${location}: XSS not aloud`
				};
			}
			
			const updatedUser = await UserModel.findOneAndUpdate(
				{ _id: req.user_decoded._id },
				{
					$set: {
						profile_img: req.body.img_url,
						bio: req.body.bio,
					}
				}
			).select('-password -api.publicKey -verified').exec()
	
			return {
				executed: true,
				status: true,
				message: 'Updated profile',
				updatedUser: updatedUser
			}
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
	update_workspacewebApp: async ({ req }) => {
		// [UPDATE] Password for User
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


	/**
	 * @notice Update user.password
	 * @param {string} req.body.currentPassword Old password
	 * @param {string} req.body.password New password
	*/
	update_password: async ({ req }) => {
		// [INIT]
		const subLocation = "/update/password";
		try {
			if (
				!validator.isAscii(req.body.currentPassword) ||
				!validator.isAscii(req.body.password)
			) {
				return {
					executed: true,
					status: false,
					location: `${location}${subLocation}`,
					message: 'Invalid params',
				};
			}

			// [MONGODB][FIND] user
			const query = await UserModel.findOne({ _id: req.user_decoded._id });

			// [VALIDATE-PASSWORD]
			if (!bcrypt.compareSync(req.body.currentPassword, query.password)) {
				return {
					executed: true,
					status: false,
					location: `${location}${subLocation}`,
					message: 'Invalid password',
				};
			}

			// [MONGODB][UPDATE] user.password
			await UserModel.findOneAndUpdate(
				{ _id: req.user_decoded._id },
				{
					$set: {
						password: await bcrypt.hash(req.body.password, 10)
					}
				}
			);

			return {
				executed: true,
				status: true,
				message: `${location}: Updated password`,
			};
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: `${location}${subLocation}`,
				message: `Error --> ${err}`,
			};
		}
	},


	generateApiKey: async ({ req }) => {
		try {
			// [UPDATE] Generate new API Key
			const updatedUser = await UserModel.findOneAndUpdate(
				{ _id: req.user_decoded._id },
				{
					$set: {
						api: {
							publicKey: uuid.v4(),
							privateKey: uuid.v4(),
						}
					}
				},
				{ new: true }
			)
	
			return {
				executed: true,
				status: true,
				location: `${location}/generate-api-key`,
				privateKey: updatedUser.privateKey
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