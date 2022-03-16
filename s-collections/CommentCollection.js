// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const CommentLikeCollection = require('./CommentLikeCollection')
const CommentModel = require('../s-models/CommentModel')


/******************* [FILL-DATA] *******************/
async function c_fillData(user_id, comment) {
	// [COUNT] Likes //
	comment.likeCount = (
		await CommentLikeCollection.c_countByComment(comment._id)
	).count

	// [USER-LOGGED] //
	if (user_id) {
		// [LIKED-STATE] //
		comment.liked = (
			await CommentLikeCollection.c_existance({
				user_id: user_id,
				comment_id: comment._id
			})
		).existance
	}

	return comment
}


/******************* [OWNERSHIP] *******************/
async function c_ownership(comment_id, user_id) {
	try {
		// [VALIDATE] comment_id //
		if (!mongoose.isValidObjectId(comment_id)) {
			return {
				executed: true,
				status: false,
				message: 'CommentCollection: Invalid comment_id',
				updated: false,
			}
		}

		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'CommentCollection: Invalid user_id',
				updated: false,
			}
		}

		const comment = await CommentModel.findOne({ _id: comment_id, user: user_id, })

		if (!comment) {
			return {
				executed: true,
				status: true,
				message: 'You do NOT own this comment',
				ownership: false,
			}
		}

		return {
			executed: true,
			status: true,
			message: 'You do own this comment',
			ownership: true,
			comment: comment,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `CommentCollection: Error --> ${err}`
		}
	}
}


module.exports = {
	/******************* [CRUD] *******************/
	// [CREATE] //
	c_create: async ({ user_id, post_id, cleanJSON, replyToComment }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid user_id',
				}
			}
	
			// [VALIDATE] post_id //
			if (!mongoose.isValidObjectId(post_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid post_id',
				}
			}
	
			// [VALIDATE] text //
			if (!cleanJSON) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid cleanJSON',
				}
			}
	
			// [VALIDATE] replyToComment //
			if (!mongoose.isValidObjectId(replyToComment) && replyToComment !== null) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid replyToComment',
				}
			}
	
			// [SAVE] //
			const comment = await new CommentModel({
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				post: post_id,
				cleanJSON: cleanJSON,
				replyToComment: replyToComment,
			}).save()
			
			return {
				executed: true,
				status: true,
				comment: comment,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `CommentCollection: Error --> ${err}`,
			}
		}
	},


	// [READ] //
	c_read: async ({ user_id, comment_id }) => {
		try {
			// [VALIDATE] comment_id //
			if (!mongoose.isValidObjectId(comment_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid comment_id',
				}
			}
	
			let comment = await CommentModel.findById(comment_id)
				.populate({ path: 'user', select: 'username email bio profile_img' })
				.exec()
	
			
			if (!comment) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: No comment found',
				}
			}
	
			// [FILL-DATA] //
			comment = await c_fillData(user_id, comment)
	
			return {
				executed: true,
				status: true,
				comment: comment
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `CommentCollection: Error --> ${err}`,
			}
		}
	},


	// [UPDATE] //
	c_update: async ({ comment_id, user_id, cleanJSON }) => {
		try {
			// [VALIDATE] comment_id //
			if (!mongoose.isValidObjectId(comment_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid comment_id',
					updated: false,
				}
			}
	
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid user_id',
					updated: false,
				}
			}
	
			// [VALIDATE] text //
			if (!cleanJSON) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid cleanJSON',
				}
			}
	
			// [OWNERSHIP] //
			const ownership = await c_ownership(comment_id, user_id)
	
			if (!ownership.status || !ownership.ownership) {
				return {
					executed: true,
					status: false,
					message: ownership.message,
				}
			}
		
			const comment = await CommentModel.updateOne(
				{
					_id: comment_id,
					user: user_id
				},
				{ $set: { cleanJSON: cleanJSON } },
			)
	
			return {
				executed: true,
				status: true,
				updated: true,
				comment: comment,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `CommentCollection: Error --> ${err}`,
				updated: false,
			}
		}
	},
	

	// [DELETE] //
	c_delete: async (comment_id) => {
		try {
			// [VALIDATE] comment_id //
			if (!mongoose.isValidObjectId(comment_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid comment_id',
				}
			}
	
			const deletedComment = await CommentModel.findOneAndRemove({ _id: comment_id })
	
			return {
				executed: true,
				status: true,
				deleted: true,
				deletedComment: deletedComment,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `CommentCollection: Error --> ${err}`,
			}
		}
	},


	/******************* [OTHER-CRUD] *******************/
	// [READ] sorted//
	c_readAll_sorted: async ({ user_id, sort = 0, limit, skip }) => {
		try {
			// [SANTIZE] //
			sort = parseInt(sort)
			limit = parseInt(limit)
			skip = parseInt(skip)
	
			// [VALDIATE] sort //
			if (!Number.isInteger(sort)) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid sort',
				}
			}
	
			// [VALDIATE] limit //
			if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid limit',
				}
			}
	
			// [VALIDATE] skip //
			if (!Number.isInteger(skip)) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid skip',
				}
			}
	
			// Set Sort //
			if (sort == 0) { sort = {} }
			else if (sort == 1) { sort = { createdAt: -1 } }
			else {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Unknown filter'
				}
			}
	
			const comments = await CommentModel.find()
				.sort(sort)
				.limit(limit)
				.skip(skip)
				.populate({ path: 'user', select: 'username email bio profile_img', })
				.populate({ path: 'post' })
				.exec()
	
			// [FILL-DATA] //
			for (let i = 0; i < comments.length; i++) {
				comments[i] = await c_fillData(user_id, comments[i])
			}
			
			return {
				executed: true,
				status: true,
				comments: comments,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `CommentCollection: Error --> ${err}`,
			}
		}
	},

	
	// [READ] Post //
	c_readAll_byPost: async ({ user_id, post_id, limit, skip }) => {
		try {
			// [SANTIZE] //
			limit = parseInt(limit)
			skip = parseInt(skip)
	
			// [VALIDATE] post_id //
			if (!mongoose.isValidObjectId(post_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid post_id',
				}
			}
	
			// [VALDIATE] limit //
			if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid limit',
				}
			}
	
			// [VALIDATE] skip //
			if (!Number.isInteger(skip)) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid skip',
				}
			}
	
			let comments = await CommentModel.find({ post: post_id })
				.limit(limit)
				.skip(skip)
				.populate({ path: 'user', select: 'username email bio profile_img', })
				.populate({
					path: 'replyToComment',
					populate: {
						path: 'user',
						select: 'username',
					}
				})
				.exec()
	
			// [FILL-DATA] //
			for (let i = 0; i < comments.length; i++) {
				comments[i] = await c_fillData(user_id, comments[i])
			}
	
			return {
				executed: true,
				status: true,
				comments: comments
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `CommentCollection: Error --> ${err}`,
			}
		}
	},

	
	// [DELETE] comment & user //
	c_delete_byIdAndUser: async ({ comment_id, user_id }) => {
		try {
			// [VALIDATE] comment_id //
			if (!mongoose.isValidObjectId(comment_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid comment_id',
					updated: false,
				}
			}
	
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid user_id',
					updated: false,
				}
			}
	
			// [OWNERSHIP] //
			const ownership = await c_ownership(comment_id, user_id)
	
			if (!ownership.status || !ownership.ownership) {
				return {
					executed: true,
					status: false,
					message: ownership.message
				}
			}
	
			const comment = await CommentModel.findOneAndRemove({
				_id: comment_id,
				user: user_id,
			})
	
			return {
				executed: true,
				status: true,
				comment: comment,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `CommentCollection: Error --> ${err}`,
			}
		}
	},

	
	// [DELETE] post //
	c_deleteAll_byPost: async ({ post_id }) => {
		try {
			// [VALIDATE] comment_id //
			if (!mongoose.isValidObjectId(post_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid post_id',
					updated: false,
				}
			}
	
			const comments = await CommentModel.deleteMany({ post: post_id })
	
			return {
				executed: true,
				status: true,
				comment: comments,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `CommentCollection: Error --> ${err}`,
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
					message: 'commentCollection: No filter passed',
					updated: false,
				}
			}
	
			const comment = await CommentModel.deleteMany(filter)
	
			return {
				executed: true,
				status: true,
				comment: comment,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `CommentCollection: Error --> ${err}`,
			}
		}
	},
	

	/******************* [EXISTANCE] *******************/
	c_existance: async (comment_id) => {
		try {
			// [VALIDATE] comment_id //
			if (!mongoose.isValidObjectId(comment_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid comment_id'
				}
			}
	
			const comment = await CommentModel.findOne({ _id: comment_id })
	
			if (!comment) {
				return {
					executed: true,
					status: true,
					message: 'Comment does NOT exist',
					existance: false,
				}
			}
	
			return {
				executed: true,
				status: true,
				message: 'Comment does exist',
				existance: true,
				comment: comment,
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


	/******************* [OWNERSHIP] *******************/
	c_ownership: async (comment_id, user_id) => {
		return await c_ownership(comment_id, user_id)
	},


	/******************* [COUNT] *******************/
	c_count: async () => {
		try {
			const count = await CommentModel.countDocuments()
	
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


	c_count_byUser: async (user_id) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid user_id'
				}
			}
	
			const count = await CommentModel.countDocuments({ user: user_id })
	
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


	c_count_bySectionText: async (sectionText_id) => {
		try {
			// [VALIDATE] sectionText_id //
			if (!mongoose.isValidObjectId(sectionText_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid sectionText_id'
				}
			}
	
			const count = await CommentModel.countDocuments({
				sectionText: sectionText_id
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


	c_count_byBlogPost: async (blogPost_id) => {
		try {
			// [VALIDATE] blogPost_id //
			if (!mongoose.isValidObjectId(blogPost_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid blogPost_id'
				}
			}
	
			const count = await CommentModel.countDocuments({ blogPost: blogPost_id })
	
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


	c_count_byPost: async (post_id) => {
		try {
			// [VALIDATE] post_id //
			if (!mongoose.isValidObjectId(post_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentCollection: Invalid post_id'
				}
			}
	
			const count = await CommentModel.countDocuments({ post: post_id })
	
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