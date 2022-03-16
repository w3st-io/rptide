// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const ActivityModel = require('../s-models/ActivityModel')


module.exports = {
	/******************* [CRUD] *******************/
	// [CREATE] //
	c_create: async ({
		user_id,
		type,
		blogPost_id,
		post_id,
		createdBlogPost_id,
		createdComment_id,
		createdPost_id,
		createdUser_id
	}) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Invalid user_id',
				}
			}


			// [VALIDATE] type //
			if (!validator.isAscii(type)) {
				return {
					executed: true,
					status: false,
					message: 'AdminCollection: Invalid type (must be ASCII)'
				}
			}

			// [VALIDATE] blogPost_id //
			if (!mongoose.isValidObjectId(blogPost_id)) {
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Invalid blogPost_id',
				}
			}

			// [VALIDATE] post_id //
			if (!mongoose.isValidObjectId(post_id)) {
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Invalid post_id',
				}
			}

			// [VALIDATE] createdBlogPost_id //
			if (!mongoose.isValidObjectId(createdBlogPost_id)) {
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Invalid createdBlogPost_id',
				}
			}

			// [VALIDATE] createdComment_id //
			if (!mongoose.isValidObjectId(createdComment_id)) {
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Invalid createdComment_id',
				}
			}

			// [VALIDATE] createdPost_id //
			if (!mongoose.isValidObjectId(createdPost_id)) {
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Invalid createdPost_id',
				}
			}

			// [VALIDATE] createdUser_id //
			if (!mongoose.isValidObjectId(createdUser_id)) {
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Invalid createdUser_id',
				}
			}

			const activity = await ActivityModel({
				_id: mongoose.Types.ObjectId(),
				type: type,
				blogPost: blogPost_id,
				post: post_id,
				user: user_id,
				createdBlogPost: createdBlogPost_id,
				createdComment: createdComment_id,
				createdPost: createdPost_id,
				createdUser: createdUser_id,
			}).save()

			return {
				executed: true,
				status: true,
				activity: activity,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `ActivityCollection: Error --> ${err}`,
			}
		}
	},


	/******************* [OTHER-CRUD] *******************/
	// [READ-ALL] Sort //
	c_readAll_sorted: async ({ sort = 0, limit, skip }) => {
		try {
			// [SANITIZE] //
			sort = parseInt(sort)
			limit = parseInt(limit)
			skip = parseInt(skip)
	
			// [VALIDATE] sort //
			if (!Number.isInteger(sort)) {
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Invalid sort',
				}
			}
	
			// [VALIDATE] limit //
			if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Invalid limit',
				}
			}
	
			// [VALIDATE] skip //
			if (!Number.isInteger(skip)) {
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Invalid skip',
				}
			}
	
			// Set Sort //
			if (sort == 0) { sort = {} }
			else if (sort == 1) { sort = { createdAt: -1 } }
			else {
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Unknown filter'
				}
			}
	
			const activities = await ActivityModel.find()
				.sort(sort)
				.limit(limit)
				.skip(skip)
				// user //
				.populate({
					path: 'user',
					select: 'username bio profile_img'
				})
				.populate({ path: 'post' })
				.populate({ path: 'comment' })
				.populate({ path: 'createdComment' })
				.populate({
					path: 'createdUser',
					select: 'username bio profile_img'
				})
				.populate({ path: 'createdPost' })
				.exec()
	
			return {
				executed: true,
				status: true,
				activities: activities,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `ActivityCollection: Error --> ${err}`,
			}
		}
	},


	// [READ-ALL] Sort //
	c_readAll_sorted_byUser: async ({ user_id, sort = 0, limit, skip }) => {
		try {
			// [SANITIZE] //
			sort = parseInt(sort)
			limit = parseInt(limit)
			skip = parseInt(skip)
	
			// [VALIDATE] sort //
			if (!Number.isInteger(sort)) {
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Invalid sort',
				}
			}
	
			// [VALIDATE] limit //
			if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Invalid limit',
				}
			}
	
			// [VALIDATE] skip //
			if (!Number.isInteger(skip)) {
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Invalid skip',
				}
			}
	
			// Set Sort //
			if (sort == 0) { sort = {} }
			else if (sort == 1) { sort = { createdAt: -1 } }
			else {
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Unknown filter'
				}
			}
			
			const activities = await ActivityModel.find({ user: user_id })
				.sort(sort)
				.limit(limit)
				.skip(skip)
				.populate({ path: 'user', select: 'username bio profile_img' })
				.populate({ path: 'post' })
				.populate({ path: 'comment' })
				.populate({ path: 'createdComment' })
				.populate({ path: 'createdUser', select: 'username bio profile_img' })
				.populate({ path: 'createdPost' })
				.exec()
	
			return {
				executed: true,
				status: true,
				activities: activities,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `ActivityCollection: Error --> ${err}`,
			}
		}
	},


	// [DELETE] User Activity //
	c_deleteAll_ByUser: async (user_id) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Invalid user_id',
				}
			}
	
			const activity = await ActivityModel.deleteMany({ user: user_id })
	
			return {
				executed: true,
				status: true,
				activity: activity,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `ActivityCollection: Error --> ${err}`,
			}
		}
	},


	// [DELETE] Post Activity //
	c_delete_byPost: async (post_id) => {
		try {
			// [VALIDATE] post_id //
			if (!mongoose.isValidObjectId(post_id)) {
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Invalid post_id',
				}
			}
	
			const activity = await ActivityModel.deleteMany({ post: post_id })
	
			return {
				executed: true,
				status: true,
				activity: activity,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `ActivityCollection: Error --> ${err}`,
			}
		}
	},


	// [DELETE] Comment Activity //
	c_deleteAll_byComment: async (comment_id) => {
		try {
			// [VALIDATE] comment_id //
			if (!mongoose.isValidObjectId(comment_id)) {
	
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Invalid comment_id',
				}
			}
	
			const activity = await ActivityModel.deleteMany({ comment: comment_id })
	
			return {
				executed: true,
				status: true,
				activity: activity,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `ActivityCollection: Error --> ${err}`,
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
					message: 'ActivityCollection: No filter passed',
					updated: false,
				}
			}
	
			const activity = await ActivityModel.deleteMany(filter)
	
			return {
				executed: true,
				status: true,
				activity: activity,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `ActivityCollection: Error --> ${err}`,
			}
		}
	},


	/******************* [COUNT] *******************/
	c_count: async () => {
		try {
			const count = await ActivityModel.countDocuments()
	
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
				message: `ActivityCollection: Error --> ${err}`,
			}
		}
	},


	c_count_byUser: async (user_id) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
	
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Invalid user_id',
				}
			}
	
			const count = await ActivityModel.countDocuments({ user: user_id })
			
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
				message: `ActivityCollection: Error --> ${err}`,
			}
		}
	},


	c_count_byUserTimeFrame: async (user_id, timePointA, timePointB) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
	
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Invalid user_id',
				}
			}
	
			// [VALIDATE] timePointA //
			if (!(new Date(timePointA)).getTime() > 0) {
	
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Invalid timePointA',
				}
			}
	
			// [VALIDATE] timePointA //
			if (!(new Date(timePointB)).getTime() > 0) {
	
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Invalid timePointA',
				}
			}
	
			const count = await ActivityModel.countDocuments({
				user: user_id,
				createdAt: {
					$gte: timePointA,
					$lte: timePointB
				}
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
				message: `ActivityCollection: Error --> ${err}`,
			}
		}
	},


	c_count_byTimeFrame: async (timePointA, timePointB) => {
		try {
			// [VALIDATE] timePointA //
			if (!(new Date(timePointA)).getTime() > 0) {
	
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Invalid timePointA',
				}
			}
	
			// [VALIDATE] timePointA //
			if (!(new Date(timePointB)).getTime() > 0) {
	
				return {
					executed: true,
					status: false,
					message: 'ActivityCollection: Invalid timePointA',
				}
			}
	
			// [READ-ALL] timePointA < Tweets < timePointB //
			const count = await ActivityModel.countDocuments({
				createdAt: {
					$gte: timePointA,
					$lte: timePointB
				}
			})
	
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
				message: `ActivityCollection: Error --> ${err}`,
			}
		}
	},
}