// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const CommentLikeModel = require('../s-models/CommetLikeModel')


module.exports = {
	/******************* [CRUD] *******************/
	// [CREATE] //
	c_create: async ({ user_id, post_id, comment_id, commentUser_id }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentLikeCollection: Invalid user_id',
				}
			}
	
			// [VALIDATE] post_id //
			if (!mongoose.isValidObjectId(post_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentLikeCollection: Invalid post_id',
				}
			}
	
			// [VALIDATE] comment_id //
			if (!mongoose.isValidObjectId(comment_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentLikeCollection: Invalid comment_id',
				}
			}
	
			// [VALIDATE] commentUser_id //
			if (!mongoose.isValidObjectId(commentUser_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentLikeCollection: Invalid commentUser_id',
				}
			}
		
			// [SAVE] //
			const commentLike = await new CommentLikeModel({
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				post: post_id,
				comment: comment_id,
				commentUser: commentUser_id,
			}).save()
	
			return {
				executed: true,
				status: true,
				commentLike: commentLike,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `CommentLikeCollection: Error --> ${err}`,
			}
		}
	},


	/******************* [OTHER-CRUD] *******************/
	// [DELETE] post //
	c_delete_byPost: async (post_id) => {
		try {
			// [VALIDATE] post_id //
			if (!mongoose.isValidObjectId(post_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentLikeCollection: Invalid post_id',
				}
			}
	
			const commentLikes = await CommentLikeModel.deleteMany({ post: post_id })
	
			return {
				executed: true,
				status: true,
				commentLikes: commentLikes
			}
		}
		catch (err) {
			return {
				executed: true,
				status: false,
				message: `CommentLikeCollection: Error --> ${err}`,
			}
		}
	},


	// [DELETE] comment //
	c_deleteAll_byComment: async (comment_id) => {
		try {
			// [VALIDATE] comment_id //
			if (!mongoose.isValidObjectId(comment_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentLikeCollection: Invalid comment_id',
				}
			}
	
			const commentLikes = await CommentLikeModel.deleteMany({ comment: comment_id })
	
			return {
				executed: true,
				status: true,
				commentLikes: commentLikes
			}
		}
		catch (err) {
			return {
				executed: true,
				status: false,
				message: `CommentLikeCollection: Error --> ${err}`,
			}
		}
	},


	// [DELETE] user & comment //
	c_delete_byUserAndComment: async ({ user_id, comment_id }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentLikeCollection: Invalid user_id',
				}
			}
	
			// [VALIDATE] comment_id //
			if (!mongoose.isValidObjectId(comment_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentLikeCollection: Invalid comment_id',
				}
			}
	
			const commentLike = await CommentLikeModel.deleteMany({
				user: user_id,
				comment: comment_id,
			})
	
			return {
				executed: true,
				status: true,
				commentLike: commentLike,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `CommentLikeCollection: Error --> ${err}`,
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
					message: 'CommentLikeCollection: No filter passed',
					updated: false,
				}
			}
	
			const commentLike = await CommentLikeModel.deleteMany(filter)
	
			return {
				executed: true,
				status: true,
				commentLike: commentLike,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `CommentLikeCollection: Error --> ${err}`,
			}
		}
	},


	/******************* [EXISTANCE] *******************/
	// [EXISTANCE] //
	c_existance: async ({ user_id, comment_id }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentLikeCollection: Invalid user_id',
				}
			}
	
			// [VALIDATE] comment_id //
			if (!mongoose.isValidObjectId(comment_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentLikeCollection: Invalid comment_id',
				}
			}
	
			if (!await CommentLikeModel.findOne({ user: user_id, comment: comment_id,})) {
				return {
					executed: true,
					status: true,
					message: 'commentLike does NOT exist',
					existance: false,
				}
			}
	
			return {
				executed: true,
				status: true,
				message: 'commentLike does exist',
				existance: true,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `CommentLikeCollection: Error --> ${err}`,
			}
		}
	},


	/******************* [COUNT] *******************/
	c_countByComment: async (comment_id) => {
		try {
			// [VALIDATE] comment_id //
			if (!mongoose.isValidObjectId(comment_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentLikeCollection: Invalid comment_id',
				}
			}
	
			const count = await CommentLikeModel.countDocuments({ comment: comment_id })
	
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
				message: `CommentLikeCollection: Error --> ${err}`,
			}
		}
	},


	c_countByCommentUser: async (commentUser_id) => {
		try {
			// [VALIDATE] commentUser_id //
			if (!mongoose.isValidObjectId(commentUser_id)) {
				return {
					executed: true,
					status: false,
					message: 'CommentLikeCollection: Invalid commentUser_id',
				}
			}
		
			const count = await CommentLikeModel.countDocuments({
				commentUser: commentUser_id
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
				message: `CommentLikeCollection: Error --> ${err}`
			}
		}
		
	},
}