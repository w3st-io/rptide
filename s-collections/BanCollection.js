// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const BanModel = require('../s-models/BanModel')


module.exports = {
	/******************* [CRUD] *******************/
	// [CREATE] //
	c_create: async (user_id, hours) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'BanCollection: Invalid user_id'
				}
			}
	
			// [VALIDATE] hours //
			if (!Number.isInteger(hours)) {
				return {
					executed: true,
					status: false,
					message: 'BanCollection: Invalid hours (must be numeric)'
				}
			}
	
			let banTime = new Date()
			banTime.setHours(banTime.getHours() + hours)
	
			const createdBan = await new BanModel({
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				bannedTill: banTime,
			}).save()
	
			return {
				executed: true,
				status: true,
				createdBan: createdBan,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `BanCollection: Error --> ${err}`,
			}
		}
	},


	/******************* [OTHER-CRUD] *******************/
	// [DELETE] //
	c_delete_byUser: async (user_id) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'BanCollection: Invalid user_id'
				}
			}
	
			const ban = await BanModel.deleteMany({ user: user_id })
	
			return {
				executed: true,
				status: true,
				ban: ban,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `BanCollection: Error --> ${err}`,
			}
		}
	},


	/******************* [EXISTANCE] *******************/
	// [EXISTANCE] //
	c_existance: async (user_id) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'BanCollection: Invalid user_id',
				}
			}
	
			const foundBan = await BanModel.findOne({ user: user_id })
	
			if (!foundBan) {
				return {
					executed: true,
					status: true,
					message: 'Ban does NOT exists',
					existance: false,
				}
			}
	
			return {
				executed: true,
				status: true,
				message: 'Ban does exists',
				existance: true,
				foundBan: foundBan,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `banCollection: Error --> ${err}`,
			}
		}
	},
}
