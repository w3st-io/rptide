// [REQUIRE]
const bcrypt = require('bcryptjs');
const validator = require('validator');
const uuid = require('uuid')


// [REQUIRE] Personal
const UserModel = require('../../../s-models/UserModel');


// [INIT]
let returnObj = {
	executed: true,
	status: false,
	location: '/api/user',
	message: ''
};


module.exports = {
	/**
	 * @notice Update User profile image and bio
	 * @param {string} req.body.img_url
	 * @param {string} req.body.bio
	 * @returns {object} Updated user
	*/
	update: async ({ req }) => {
		let _returnObj = {
			...returnObj,
			location: returnObj.location + '/update',
			message: 'Updated profile'
		};

		try {
			// [VALIDATE]
			if (!validator.isAscii(req.body.img_url)) {
				return {
					..._returnObj,
					message: 'Invalid params',
				};
			}

			// [VALIDATE] bio
			if (
				req.body.bio.includes('<script') ||
				req.body.bio.includes('</script>')
			) {
				return {
					..._returnObj,
					message: 'XSS not allowed'
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
			).select('-password -api.publicKey -verified').exec();
	
			return {
				..._returnObj,
				status: true,
				updatedUser: updatedUser
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: err,
			};
		}
	},

	/**
	 * @notice Update user.workspace.webApp
	 * @param {string} req.body.webApp webApp to be updated too
	*/
	update_workspaceWebApp: async ({ req }) => {
		let _returnObj = {
			...returnObj,
			message: 'Updated workspace',
			location: returnObj.location + '/update/workspace-web-app',
		};

		try {
			// [UPDATE] Password for User
			const user = await UserModel.findOneAndUpdate(
				{ _id: req.user_decoded._id },
				{
					$set: {
						"workspace.webApp": req.body.webApp
					}
				},
				{ returnOriginal: false }
			);

			if (!user) {
				return {
					..._returnObj,
					message: 'No user found'
				};
			}

			return {
				..._returnObj,
				status: true,
				user
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: err
			};
		}
	},


	/**
	 * @notice Update user.password
	 * @param {string} req.body.currentPassword Old password
	 * @param {string} req.body.password New password
	*/
	update_password: async ({ req }) => {
		// [INIT]
		let _returnObj = {
			...returnObj,
			message: 'Updated password',
			location: returnObj.location + '/update/password',
		};

		try {
			if (
				!validator.isAscii(req.body.currentPassword) ||
				!validator.isAscii(req.body.password)
			) {
				return {
					..._returnObj,
					message: 'Invalid params',
				};
			}

			// [MONGODB][FIND] user
			const query = await UserModel.findOne({ _id: req.user_decoded._id });

			// [VALIDATE-PASSWORD]
			if (!bcrypt.compareSync(req.body.currentPassword, query.password)) {
				return {
					..._returnObj,
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
				..._returnObj,
				status: true,
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: err
			};
		}
	},


	/**
	 * 
	 * @notice Find user and generate a new API key
	 * @returns {Object} containing the new API Key
	*/
	generateApiKey: async ({ req }) => {
		// [INIT]
		let _returnObj = {
			...returnObj,
			message: 'Generated new API key',
			location: returnObj.location + '/generate-api-key'
		};
		
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
			);
	
			return {
				..._returnObj,
				status: true,
				privateKey: updatedUser.privateKey
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: err
			};
		}
	},
}