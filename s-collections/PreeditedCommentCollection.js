// [REQUIRE] //
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const CommentCollection = require('./CommentCollection')
const PreeditCommentModel = require('../s-models/PreeditedCommentModel')


module.exports = {
	/******************* [CRUD] *******************/
	// [CREATE] //
	c_create: async (user_id, comment_id) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'preeditedCommentCollection: Invalid user_id',
				}
			}
	
			// [VALIDATE] comment_id //
			if (!mongoose.isValidObjectId(comment_id)) {
				return {
					executed: true,
					status: false,
					message: 'preeditedCommentCollection: Invalid comment_id',
				}
			}
	
			// [READ] //
			const { comment } = await CommentCollection.c_read({
				user_id: user_id,
				comment_id: comment_id
			})
	
			// [SAVE] //
			const preeditedComment = await new PreeditCommentModel({
				_id: mongoose.Types.ObjectId(),
				user: comment.user,
				post: comment.post,
				comment: comment._id,
				cleanJSON: comment.cleanJSON,
				replyToComment: comment.replyToComment,
				likeCount: comment.likeCount,
				original_comment_createdAt: comment.createdAt
			}).save()
	
			return {
				executed: true,
				status: true,
				comment: preeditedComment,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `preeditedCommentCollection: Error --> ${err}`,
			}
		}
	},
}