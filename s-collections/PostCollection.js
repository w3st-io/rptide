// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] //
const PostModel = require('../s-models/PostModel')
const CommentCollection = require('./CommentCollection')
const PostFollowCollection = require('./PostFollowCollection')
const PostLikeCollection = require('./PostLikeCollection')


async function c_fillData(user_id, post) {
	// [COUNT] Likes //
	post.likeCount = (await PostLikeCollection.c_count_byPost(post._id)).count

	// [COUNT] Follows //
	post.followsCount = (await PostFollowCollection.c_count_byPost(post._id)).count

	// [COUNT] Comments //
	post.commentCount = (await CommentCollection.c_count_byPost(post._id)).count

	// [USER-LOGGED] //
	if (user_id) {
		// [LIKED-STATE] //
		post.liked = (
			await PostLikeCollection.c_existance(user_id, post._id)
		).existance

		// [FOLLOWED-STATE] //
		post.followed = (
			await PostFollowCollection.c_existance(user_id, post._id)
		).existance
	}

	return post
}


module.exports = {
	/******************* [CRUD] *******************/
	// [CREATE] //
	c_create: async (user_id, cat_id, title) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid user_id',
				}
			}
	
			// [VALIDATE] cat_id //
			if (!validator.isAscii(cat_id)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid cat_id',
				}
			}
	
			// [VALIDATE] title //
			if (!title) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: No title passed',
				}
			}
	
			// [SAVE] //
			const createdPost = await new PostModel({
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				cat_id: cat_id,
				title: title,
			}).save()
	
			return {
				executed: true,
				status: true,
				createdPost: createdPost,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PostCollection: Error --> ${err}`,
			}
		}
	},


	// [READ] //
	c_read: async (user_id, post_id) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid user_id',
				}
			}
	
			// [VALIDATE] post_id //
			if (!mongoose.isValidObjectId(post_id)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid post_id',
				}
			}
	
			let post = await PostModel.findById(post_id)
				.populate({ path: 'user', select: 'username email bio profile_img', })
				.exec()
	
			// Check if post found //	
			if (!post) {
				return {
					executed: true,
					status: false,
					post: post,
					message: 'PostCollection: No post found'
				}
			}
	
			// [FILL-DATA] //
			post = await c_fillData(user_id, post)
			
			return {
				executed: true,
				status: true,
				post: post
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PostCollection: Error --> ${err}`
			}
		}
	},


	// [DELETE] //
	c_delete: async (post_id) => {
		try {
			// [VALIDATE] post_id //
			if (!mongoose.isValidObjectId(post_id)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid post_id',
					deleted: false,
				}
			}
	
			const deletedPost = await PostModel.findByIdAndDelete(post_id)
			
			return {
				executed: true,
				status: true,
				deleted: true,
				deletedPost: deletedPost,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PostCollection: Error --> ${err}`,
				deleted: false,
			}
		}
	},


	/******************* [OTHER-CRUD] *******************/
	// [READ-ALL-SORT] //
	c_readAll_sorted: async (user_id, sort = 0, limit, skip) => {
		try {
			// [SANITIZE] //
			sort = parseInt(sort)
			limit = parseInt(limit)
			skip = parseInt(skip)
	
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid user_id',
				}
			}
	
			// [VALIDATE] sort //
			if (!Number.isInteger(sort)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid sort',
				}
			}
	
			// [VALIDATE] limit //
			if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid limit',
				}
			}
	
			// [VALIDATE] skip //
			if (!Number.isInteger(skip)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid skip',
				}
			}
	
			// Set Sort //
			if (sort == 0) { sort = { createdAt: -1 } }
			else if (sort == 1) { sort = { likeCount: -1 } }
			else {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Unknown filter'
				}
			}
	
			let posts = await PostModel.find()
				.sort(sort)
				.limit(limit)
				.skip(skip)
				.populate({
					path: 'user',
					select: 'username bio profile_img',
				})
				.exec()
	
			// [FILL-DATA] //
			for (let i = 0; i < posts.length; i++) {
				posts[i] = await c_fillData(user_id, posts[i])
			}
	
			return {
				executed: true,
				status: true,
				posts: posts,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PostCollection: Error --> ${err}`,
			}
		}
	},


	// [READ-ALL] Within Cat Sorted //
	c_readAll_sorted_byCat: async ({ user_id, cat_id, sort = 0, limit, skip }) => {
		try {
			// [SANITIZE] //
			sort = parseInt(sort)
			limit = parseInt(limit)
			skip = parseInt(skip)
	
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid user_id',
				}
			}
	
			// [VALIDATE] cat_id //
			if (!validator.isAscii(cat_id)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid cat_id',
				}
			}
	
			// [VALIDATE] sort //
			if (!Number.isInteger(sort)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid sort',
				}
			}
	
			// [VALIDATE] limit //
			if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid limit',
				}
			}
	
			// [VALIDATE] skip //
			if (!Number.isInteger(skip)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid skip',
				}
			}
	
			// Set Sort //
			if (sort == 0) { sort = { createdAt: -1 } }
			else if (sort == 1) { sort = { likeCount: -1 } }
			else {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Unknown filter'
				}
			}
	
			let posts = await PostModel.find({ cat_id })
				.sort(sort)
				.limit(limit)
				.skip(skip)
				.populate({
					path: 'user',
					select: 'username bio profile_img',
				})
				.exec()
	
			// [FILL-DATA] //
			for (let i = 0; i < posts.length; i++) {
				posts[i] = await c_fillData(user_id, posts[i])
			}
	
			return {
				executed: true,
				status: true,
				posts: posts,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PostCollection: Error --> ${err}`,
			}
		}
	},


	// [READ-ALL] Pinned Posts //
	c_readAll_sorted_byPinned: async (user_id, cat_id, sort = 0) => {
		try { 
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid user_id',
				}
			}
	
			// [VALIDATE] cat_id //
			if (!validator.isAscii(cat_id)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid cat_id',
				}
			}
	
			// [VALIDATE] sort //
			if (!Number.isInteger(sort)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid sort',
				}
			}
	
			// Set Sort //
			if (sort == 0) { sort = { createdAt: -1 } }
			else if (sort == 0) { sort = { likeCount: -1 } }
	
			let posts = await PostModel.find({
				cat_id,
				pinned: true,
			})
				.populate({
					path: 'user',
					select: 'username email bio profile_img'
				})
				.sort(sort)
				.exec()
	
			// [FILL-DATA] //
			for (let i = 0; i < posts.length; i++) {
				posts[i] = await c_fillData(user_id, posts[i])
			}
	
			return {
				executed: true,
				status: true,
				posts: posts,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PostCollection: Error --> ${err}`,
			}
		}
	},


	// [DELETE] _id & user //
	c_deleteOne_byIdAndUser: async ({ post_id, user_id }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid user_id',
				}
			}
	
			// [VALIDATE] post_id //
			if (!mongoose.isValidObjectId(post_id)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid post_id',
					deleted: false,
				}
			}
	
			const deletedPost = await PostModel.deleteOne({
				_id: post_id,
				user: user_id
			})
			
			return {
				executed: true,
				status: true,
				deleted: true,
				deletedPost: deletedPost,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PostCollection: Error --> ${err}`,
				deleted: false,
			}
		}
	},


	/******************* [FUZZY-SEARCH] *******************/
	c_fuzzySearch: async (user_id, query, limit = 5, skip) => {
		try {
			// [SANITIZE] //
			limit = parseInt(limit)
			skip = parseInt(skip)
	
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid user_id',
				}
			}
			
			// [VALIDATE] post_id //
			if (!validator.isAscii(query)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid query',
					existance: false,
				}
			}

			// [INIT] //
			exactMatch = []
	
			// [READ] //
			const posts = await PostModel.fuzzySearch({ query: query })
				.populate({ path: 'user', select: 'username bio profile_img' })
				.limit(limit)
				.skip(skip)
				.exec()

			// [EXACT-MATCH] //
			exactMatch = await PostModel.find({ title: query })
				.select('-password')
				.exec()

			if (posts.length == 0 && exactMatch.length == 1) {
				posts.push(exactMatch[0])
			}

	
			// [FILL-DATA] //
			for (let i = 0; i < posts.length; i++) {
				posts[i] = await c_fillData(user_id, posts[i])
			}
	
			return {
				executed: true,
				status: true,
				posts: posts,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PostCollection: Error --> ${err}`,
				existance: false,
			}
		}
	},


	c_fuzzySearchCount: async (query) => {
		try {
			// [COUNT] //
			let count = await PostModel.fuzzySearch({ query: query }).countDocuments()
	
			// [EXACT-MATCH] //
			exactMatch = await PostModel.find({ title: query }).countDocuments()

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
				message: `PostCollection: Error --> ${err}`,
				existance: false,
			}
		}
	},


	/******************* [LIKE-SYSTEM] *******************/
	c_incrementLike: async (post_id) => {
		try {
			// [VALIDATE] post_id //
			if (!mongoose.isValidObjectId(post_id)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid post_id',
				}
			}
	
			const post = await PostModel.findOneAndUpdate(
				{ _id: post_id },
				{ $inc: { likeCount: 1 } },
			)
	
			return {
				executed: true,
				status: true,
				post: post
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PostCollection: Error --> ${err}`
			}
		}
	}
	,


	c_decrementLike: async (post_id) => {
		try {
			// [VALIDATE] post_id //
			if (!mongoose.isValidObjectId(post_id)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid post_id',
				}
			}
	
			const post = await PostModel.findOneAndUpdate(
				{ _id: post_id },
				{ $inc: { likeCount: -1 } },
			)
	
			return {
				executed: true,
				status: true,
				post: post
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PostCollection: Error --> ${err}`
			}
		}
	},


	/******************* [OWNERSHIP] *******************/
	c_ownership: async (post_id, user_id) => {
		try {
			// [VALIDATE] post_id //
			if (!mongoose.isValidObjectId(post_id)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid post_id',
					updated: false,
				}
			}
	
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid user_id',
					updated: false,
				}
			}
	
			const post = await PostModel.findOne({
				_id: post_id,
				user: user_id
			})
	
			if (!post) {
				return {
					executed: true,
					status: true,
					ownership: false,
					post: post,
				}
			}
	
			return {
				executed: true,
				status: true,
				ownership: true,
				post: post,
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				message: `PostCollection: Error --> ${err}`,
			}
		}
	},


	/******************* [COUNT] *******************/
	c_count: async () => {
		try {
			const count = await PostModel.countDocuments()
	
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
				message: `PostCollection: Error --> ${err}`,
			}
		}
	},
	
	
	c_count_byCat: async (cat_id) => {
		try {
			// [VALIDATE] cat_id //
			if (!validator.isAscii(cat_id)) {
				return {
					executed: true,
					status: false,
					message: 'PostCollection: Invalid cat_id',
					updated: false,
				}
			}
	
			const count = await PostModel.countDocuments({ cat_id })
	
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
				message: `PostCollection: Error --> ${err}`,
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
					message: 'PostCollection: Invalid user_id',
					updated: false,
				}
			}
	
			const count = await PostModel.countDocuments({ user: user_id })
	
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
				message: `PostCollection: Error --> ${err}`,
			}
		}
	},


	/******************* [FILL-DATA] *******************/
	c_fillData: async (user_id, post) => {
		return await c_fillData(user_id, post)
	},
}