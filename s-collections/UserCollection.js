// [REQUIRE] //
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const UserModel = require('../s-models/UserModel')


// [INIT] //
const location = 'UserCollection'


module.exports = {
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
				user: user,
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