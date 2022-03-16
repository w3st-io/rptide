// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const NotificationModel = require('../s-models/NotificationModel')


module.exports = {
	/******************* [CRUD] *******************/
	// [CREATE] //
	c_create: async (user_id, comment_id, type) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'NotificationCollection: Invalid user_id',
					updated: false,
				}
			}
	
			// [VALIDATE] comment_id //
			if (!mongoose.isValidObjectId(comment_id)) {
				return {
					executed: true,
					status: false,
					message: 'NotificationCollection: Invalid comment_id',
					updated: false,
				}
			}
	
			// [VALIDATE] type //
			if (!validator.isAscii(type)) {
				return {
					executed: true,
					status: false,
					message: 'NotificationCollection: Invalid type',
					updated: false,
				}
			}
	
			// [SAVE] // 
			const notification = await new NotificationModel({
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				comment: comment_id,
				type,
			}).save()
	
			return {
				executed: true,
				status: true,
				createdNotification: notification,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `NotificationCollection: Error --> ${err}`,
			}
		}
	},


	/******************* [OTHER-CRUD] *******************/
	// [READ-ALL] //
	c_readAll_sorted_byUser: async (user_id, sort, limit, skip) => {
		try {
			// [SANTIZE] //
			sort = parseInt(sort)
			limit = parseInt(limit)
			skip = parseInt(skip)
	
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'NotificationCollection: Invalid user_id',
					updated: false,
				}
			}
	
			// [VALIDATE] sort //
			if (!Number.isInteger(sort)) {
				return {
					executed: true,
					status: false,
					message: 'NotificationCollection: Invalid sort',
					updated: false,
				}
			}
	
			// [VALIDATE] limit //
			if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
				return {
					executed: true,
					status: false,
					message: 'NotificationCollection: Invalid limit',
					updated: false,
				}
			}
	
			// [VALIDATE] skip //
			if (!Number.isInteger(skip)) {
				return {
					executed: true,
					status: false,
					message: 'NotificationCollection: Invalid skip',
					updated: false,
				}
			}
	
			if (sort == 0) { sort = {} }
			else { sort = { createdAt: -1 } }
	
			const notifications = await NotificationModel.find({ user: user_id })
				.sort(sort)
				.limit(limit)
				.skip(skip)
				.populate({
					path: 'comment',
					populate: {
						path: 'user',
						select: 'username',
					}
				})
				.populate({
					path: 'comment',
					populate: {
						path: 'post',
						select: 'title',
					}
				})
				.exec()
		
			return {
				executed: true,
				status: true,
				notifications: notifications
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `nofiticationsCollection: Error --> ${err}`
			}
		}
	},


	// [READ-ALL] Sort Unread //
	c_readAll_sorted_byUserAndUnread: async (user_id, sort, limit, skip) => {
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
					message: 'NotificationCollection: Invalid sort',
					updated: false,
				}
			}
	
			// [VALIDATE] limit //
			if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
				return {
					executed: true,
					status: false,
					message: 'NotificationCollection: Invalid limit',
					updated: false,
				}
			}
	
			// [VALIDATE] skip //
			if (!Number.isInteger(skip)) {
				return {
					executed: true,
					status: false,
					message: 'NotificationCollection: Invalid skip',
					updated: false,
				}
			}
	
			if (sort == 0) { sort = {} }
			else { sort = { createdAt: -1 } }
	
			const notifications = await NotificationModel.find({
				user: user_id,
				read: false,
			})
				.sort(sort)
				.limit(limit)
				.skip(skip)
				.populate({
					path: 'comment',
					populate: {
						path: 'user',
						select: 'username',
					}
				})
				.populate({
					path: 'comment',
					populate: {
						path: 'post',
						select: 'title',
					}
				})
				.exec()
		
			return {
				executed: true,
				status: true,
				notifications: notifications
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `nofiticationsCollection: Error --> ${err}`
			}
		}
	},

	
	// [DELETE] Comment //
	c_deleteAll_byComment: async (comment_id) => {
		try {
			// [VALIDATE] comment_id //
			if (!mongoose.isValidObjectId(comment_id)) {
				return {
					executed: true,
					status: false,
					message: 'NotificationCollection: Invalid comment_id',
				}
			}
	
			const deletedNotications = await NotificationModel.deleteMany({
				comment: comment_id
			})
	
			return {
				executed: true,
				status: true,
				deletedNotications: deletedNotications,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `NotificationCollection: Error --> ${err}`,
			}
		}
	},


	// [DELETE] Custom //
	c_delete_custom: async (filter) => {
		try {
			// [VALIDATE] filter //
			if (!filter || filter == {}) {
				return {
					executed: true,
					status: false,
					message: 'PostFollowCollection: No filter passed',
					updated: false,
				}
			}
	
	
			const deletedNotications = await NotificationModel.deleteMany(filter)
	
			return {
				executed: true,
				status: true,
				deletedNotications: deletedNotications,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `NotificationCollection: Error --> ${err}`,
			}
		}
	},


	/******************* [MARK-READ-STATUS] *******************/
	c_markRead: async (notification_id) => {
		try {
			// [VALIDATE] notification_id //
			if (!mongoose.isValidObjectId(notification_id)) {
				return {
					executed: true,
					status: false,
					message: 'NotificationCollection: Invalid notification_id',
				}
			}
	
			const notification = await NotificationModel.updateOne(
				{ _id: notification_id },
				{ read: true },
			)
				
			return {
				executed: true,
				status: true,
				markedRead: true,
				notification: notification
			}
		}	
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `NotificationCollection: Error --> ${err}`,
				markedRead: true,
			}
		}
	},


	/******************* [COUNT] *******************/
	c_count: async (user_id) => {
		try {
			// [VALIDATE] post_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'NotificationCollection: Invalid user_id'
				}
			}
	
			const count = await NotificationModel.countDocuments({ user: user_id })
	
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
				message: `CommentCollection: Error --> ${err}`
			}
		}
	},


	c_count_byUnread: async (user_id) => {
		try {
			// [VALIDATE] post_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'NotificationCollection: Invalid user_id'
				}
			}
	
			const count = await NotificationModel.countDocuments({
				user: user_id,
				read: false,
			})
	
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
				message: `CommentCollection: Error --> ${err}`
			}
		}
	},
}
