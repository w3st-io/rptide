// [REQUIRE] //
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const validator = require('validator')
const uuid = require('uuid')


// [REQUIRE] Personal //
const UserModel = require('../s-models/UserModel')


// [INIT] //
const location = 'UserCollection'


module.exports = {
	/******************* [CRUD] *******************/
	c_create_apiPrivateKey: async ({ user_id }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid user_id`
				}
			}

			// Generate a hash to be used at a token //
			const publicKey = uuid.v4()
			const privateKey = uuid.v4()

			// [READ] Old User //
			const preEditUser = await UserModel.findOne({ _id: user_id })

			// [UPDATE] Generate new API Key //
			const updatedUser = await UserModel.findOneAndUpdate(
				{ _id: user_id },
				{
					$set: {
						api: {
							publicKey: publicKey,
							privateKey: privateKey,
						}
					}
				},
				{ new: true }
			)

			console.log(updatedUser);

			return {
				executed: true,
				status: true,
				location: location,
				privateKey: updatedUser.api.privateKey
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `${location}: Error --> ${err}`
			}
		}
	},
	

	c_read: async (_id) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'Invalid _id'
				}
			}
		
			// [QUERY] //
			const queryResult = await UserModel.findOne({ _id })
				.select('-password -api.publicKey')
				.exec()
	
			// [NOTHING-FOUND] //
			if (!queryResult) {
				return {
					executed: true,
					status: false,
					location: location,
					message: 'No User object found',
				}
			}

			// [SUCCESS] //
			return {
				executed: true,
				status: true,
				location: location,
				user: queryResult,
				message: 'User object found',
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: location,
				message: `Error --> ${err}`
			}
		}
	},


	// [UPDATE] Profile Picture //
	c_update: async ({ user_id, img_url, bio }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					location: location,
					message: `Invalid user_id`
				}
			}
	
			// [VALIDATE] img_url //
			if (!validator.isURL(img_url)) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid URL (Must be URL)`
				}
			}
	
			// [VALIDATE] bio //
			if (bio.includes('<script') || bio.includes('</script>')) {
				return {
					executed: true,
					status: false,
					message: `${location}: XSS not aloud`
				}
			}
	
			const updatedUser = await UserModel.findOneAndUpdate(
				{ _id: user_id },
				{
					$set: {
						profile_img: img_url,
						bio: bio,
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
				message: `${location}: Error --> ${err}`
			}
		}
	},


	/******************* [OTHER-CRUD] *******************/
	// [CREATE] User (with password) //
	c_register: async ({ email, password }) => {
		try {

			// [VALIDATE] email //
			if (!validator.isEmail(email)) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid email`
				}
			}
	
			// [VALIDATE] password //
			if (!validator.isAscii(password)) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid password`
				}
			}
	
			// Email Check //
			if (await UserModel.findOne({ email })) {
				return {
					executed: true,
					status: true,
					message: 'That email is already registered',
					created: false,
				}
			}
	
			// Password Length //
			if (password.length < 8 || password.length > 50) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid password`,
					created: false,
				}
			}
	
			// [ENCRYPT] Hash Password //
			const hashedPassword = await bcrypt.hash(password, 10)
	
			// [SAVE] //
			const user = await new UserModel({
				_id: mongoose.Types.ObjectId(),
				email: email,
				password: hashedPassword,
			}).save()
			
			return {
				executed: true,
				status: true,
				message: 'Successfully created account',
				created: true,
				user: user,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `${location}: Error --> ${err}`,
				created: false,
			}
		}
	},


	// [READ-ALL] Sorted (No password) //
	c_readAll_sorted: async ({ sort = 0, limit, skip }) => {
		try {
			// [SANTIZE] //
			sort = parseInt(sort)
			limit = parseInt(limit)
			skip = parseInt(skip)
	
			// [VALIDATE] sort //
			if (!Number.isInteger(sort)) {
				return {
					executed: true,
					status: false,
					message: 'UserCollection: Invalid sort',
				}
			}
	
			// [VALDIATE] limit //
			if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
				return {
					executed: true,
					status: false,
					message: 'UserCollection: Invalid limit',
				}
			}
	
			// [VALIDATE] skip //
			if (!Number.isInteger(skip)) {
				return {
					executed: true,
					status: false,
					message: 'UserCollection: Invalid skip',
				}
			}
	
			// Set Sort //
			if (sort == 0) { sort = {} }
			else if (sort == 1) { sort = { createdAt: -1 } }
			else {
				return {
					executed: true,
					status: false,
					message: 'UserCollection: Unknown filter'
				}
			}
	
	
			const users = await UserModel.find()
				.sort(sort)
				.limit(limit)
				.skip(skip)
				.select('-password')
				.exec()
			
			return {
				executed: true,
				status: true,
				users: users
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `UserCollection: Error --> ${err}`
			}
		}
	},


	// [READ-ALL] Sorted (No password) //
	c_read_select: async ({ user_id, select = undefined }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid user_id`
				}
			}
	
			// [VALIDATE] user_id //
			if (select != undefined && !validator.isAscii(select)) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid select`
				}
			}
		
			const user = await UserModel.findOne({ _id: user_id }).select(select)
	
			return {
				executed: true,
				status: true,
				user: user
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `UserCollection: Error --> ${err}`
			}
		}
	},


	// [READ] Email //
	c_read_byEmail: async (email) => {
		try {
			// [VALIDATE] Email //
			if (!validator.isEmail(email)) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid email`
				}
			}
	
			const user = await UserModel.findOne({ email })
	
			if (!user) {
				return {
					executed: true,
					status: false,
					message: `${location}: No user found`
				}
			}
	
			return {
				executed: true,
				status: true,
				user: user
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


	c_read_byApiPrivateKey: async ({ privateKey }) => {
		try {
			// [READ] //
			const uo = await UserModel.findOne({
				"api.privateKey": privateKey
			})

			console.log(privateKey);
			
			if (uo) {
				return {
					executed: true,
					status: true,
					location: location,
					user: uo
				}
			}

			return {
				executed: true,
				status: false,
				location: location,
				message: `No User Found`
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `UserCollection: Error --> ${err}`
			}
		}
	},


	// [UPDATE] //
	c_update_password: async (user_id, password) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid user_id`
				}
			}
			
			// [VALIDATE] password //
			if (!validator.isAscii(password)) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid password`
				}
			}
	
			// Password Length //
			if (password.length < 8 || password.length > 50) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid password (8 < password < 50)`,
				}
			}
		
			// Hash Password //
			const hashedPassword = await bcrypt.hash(password, 10)
			
			// [UPDATE] Password for User //
			const user = await UserModel.findOneAndUpdate(
				{ _id: user_id },
				{ $set: { password: hashedPassword } }
			)
	
			return {
				executed: true,
				status: true,
				message: `${location}: Updated password`,
				user: user
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


	/******************* [VERIFY] *******************/
	c_verify: async (user_id) => {
		try {
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid user_id`
				}
			}
	
			const user = await UserModel.findOneAndUpdate(
				{ _id: user_id },
				{ $set: { verified: true } }
			)
	
			return {
				executed: true,
				status: true,
				message: `${location}: Verified profile`,
				user: user
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


	c_verifiedStatus: async (user_id) => {
		try {
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid user_id`
				}
			}
	
			const user = await UserModel.findOne({
				_id: user_id,
				verified: true,
			})
	
			if (user) {
				return {
					executed: true,
					status: true,
					message: 'User verified',
					user: user,
				}
			}
			else {
				return {
					executed: true,
					status: false,
					message: 'User NOT verified',
					user: user,
				}
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
	c_count: async () => {
		try {
			const count = await UserModel.countDocuments()
	
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
				message: `${location}: Error --> ${err}`
			}
		}
	},


	/******************* [FUZZY-SEARCH] *******************/
	c_fuzzySearch: async (user_id, query) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid user_id`
				}
			}
			
			// [VALIDATE] post_id //
			if (!validator.isAscii(query)) {
				return {
					executed: true,
					status: false,
					message: `${location}: Invalid query`,
					existance: false,
				}
			}
	
			// [INIT] //
			let exactMatch = []
	
			// [READ] //
			const users = await UserModel.fuzzySearch({ query: query })
				.select('-password')
				.exec()
				
			// [EXACT-MATCH] //
			exactMatch = await UserModel.find({ email: query })
				.select('-password')
				.exec()
	
			if (exactMatch.length == 0) {
				exactMatch = await UserModel.find({ username: query })
					.select('-password')
					.exec()
			}
	
			if (users.length == 0 && exactMatch.length == 1) {
				users.push(exactMatch[0])
			}
	
			return {
				executed: true,
				status: true,
				users: users,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `${location}: Error --> ${err}`,
				existance: false,
			}
		}
	},


	c_fuzzySearchCount: async (query) => {
		try {
			// [VALIDATE] post_id //
			if (!validator.isAscii(query)) {
				return {
					executed: true,
					status: false,
					message: 'UserCollection: Invalid query',
					existance: false,
				}
			}
			
			// [COUNT] //
			let count = await UserModel.fuzzySearch({ query: query }).countDocuments()
	
			// [EXACT-MATCH] //
			exactMatch = await UserModel.find({ email: query }).countDocuments()
	
			if (exactMatch == 0) {
				exactMatch = await UserModel.find({ username: query }).countDocuments()
			}
	
			if (count == 0 && exactMatch == 1) { count = 1 }
	
			return {
				executed: true,
				status: true,
				count: count,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `${location}: Error --> ${err}`,
				existance: false,
			}
		}
	},
}