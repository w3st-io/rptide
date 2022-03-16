// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] //
const BlogPostModel = require('../s-models/BlogPostModel')
const CommentCollection = require('./CommentCollection')


async function c_fillData(blogPost) {
	// [COUNT] Comments //
	const cObj = await CommentCollection.c_count_byBlogPost(blogPost._id)
	
	blogPost.commentCount = cObj.count

	return blogPost
}


module.exports = {
	/******************* [CRUD] *******************/
	// [CREATE] //
	c_create: async ({ user_id, title, cleanJSON }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'BlogPostCollection: Invalid user_id',
				}
			}
	
			// [VALIDATE] title //
			if (!title) {
				return {
					executed: true,
					status: false,
					message: 'BlogPostCollection: No title passed',
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
	
			// [SAVE] //
			const createdBlogPost = await new BlogPostModel({
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				title: title,
				cleanJSON: cleanJSON,
			}).save()
	
			return {
				executed: true,
				status: true,
				createdBlogPost: createdBlogPost,
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
	c_read: async (user_id, blogPost_id) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'BlogPostCollection: Invalid user_id',
				}
			}
	
			// [VALIDATE] blogPost_id //
			if (!mongoose.isValidObjectId(blogPost_id)) {
				return {
					executed: true,
					status: false,
					message: 'BlogPostCollection: Invalid blogPost_id',
				}
			}
	
			let blogPost = await BlogPostModel.findById(blogPost_id)
				.populate({
					path: 'user',
					select: 'username email bio profile_img',
				})
				.exec()
	
			// Check if blogPost found //	
			if (!blogPost) {
				return {
					executed: true,
					status: false,
					blogPost: blogPost,
					message: 'BlogPostCollection: No blogPost found'
				}
			}
	
			// [FILL-DATA] //
			blogPost = await c_fillData(blogPost)
			
			return {
				executed: true,
				status: true,
				blogPost: blogPost
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
	c_delete: async (blogPost_id) => {
		try {
			// [VALIDATE] blogPost_id //
			if (!mongoose.isValidObjectId(blogPost_id)) {
				return {
					executed: true,
					status: false,
					message: 'BlogPostCollection: Invalid blogPost_id',
					deleted: false,
				}
			}
	
			const deletedBlogPost = await BlogPostModel.findByIdAndDelete(blogPost_id)
			
			return {
				executed: true,
				status: true,
				deleted: true,
				deletedBlogPost: deletedBlogPost,
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


	/******************* [BLOG-CRUD] *******************/
	// [BLOG] //
	c_readAll_sorted_byUser: async ({ user_id, sort = 0, limit, skip }) => {
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
					message: 'BlogPostCollection: Invalid user_id',
				}
			}
	
			// [VALIDATE] sort //
			if (!Number.isInteger(sort)) {
				return {
					executed: true,
					status: false,
					message: 'BlogPostCollection: Invalid sort',
				}
			}
	
			// [VALIDATE] limit //
			if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
				return {
					executed: true,
					status: false,
					message: 'BlogPostCollection: Invalid limit',
				}
			}
	
			// [VALIDATE] skip //
			if (!Number.isInteger(skip)) {
				return {
					executed: true,
					status: false,
					message: 'BlogPostCollection: Invalid skip',
				}
			}
	
			// Set Sort //
			if (sort == 0) { sort = { createdAt: -1 } }
			else {
				return {
					executed: true,
					status: false,
					message: 'BlogPostCollection: Unknown filter'
				}
			}
	
			let blogPosts = await BlogPostModel.find({ user: user_id })
				.sort(sort)
				.limit(limit)
				.skip(skip)
				.populate({
					path: 'user',
					select: 'username bio profile_img',
				})
				.exec()
	
			// [FILL-DATA] //
			for (let i = 0; i < blogPosts.length; i++) {
				blogPosts[i] = await c_fillData(blogPosts[i])
			}
	
			return {
				executed: true,
				status: true,
				blogPosts: blogPosts,
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
	c_deleteOne_byIdAndUser: async ({ blogPost_id, user_id }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'BlogPostCollection: Invalid user_id',
				}
			}
	
			// [VALIDATE] blogPost_id //
			if (!mongoose.isValidObjectId(blogPost_id)) {
				return {
					executed: true,
					status: false,
					message: 'BlogPostCollection: Invalid blogPost_id',
					deleted: false,
				}
			}
	
			const deletedPost = await BlogPostModel.deleteOne({
				_id: blogPost_id,
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
					message: 'BlogPostCollection: Invalid user_id',
				}
			}
			
			// [VALIDATE] blogPost_id //
			if (!validator.isAscii(query)) {
				return {
					executed: true,
					status: false,
					message: 'BlogPostCollection: Invalid query',
					existance: false,
				}
			}

			// [INIT] //
			exactMatch = []
	
			// [READ] //
			const blogPosts = await BlogPostModel.fuzzySearch({ query: query })
				.populate({
					path: 'user',
					select: 'username bio profile_img'
				})
				.limit(limit)
				.skip(skip)
				.exec()

			// [EXACT-MATCH] //
			exactMatch = await BlogPostModel.find({ title: query })
				.select('-password')
				.exec()

			if (blogPosts.length == 0 && exactMatch.length == 1) {
				blogPosts.push(exactMatch[0])
			}

	
			// [FILL-DATA] //
			for (let i = 0; i < blogPosts.length; i++) {
				blogPosts[i] = await c_fillData(blogPosts[i])
			}
	
			return {
				executed: true,
				status: true,
				blogPosts: blogPosts,
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
			let count = await BlogPostModel.fuzzySearch({ query: query })
				.countDocuments()
	
			// [EXACT-MATCH] //
			exactMatch = await BlogPostModel.find({ title: query }).countDocuments()

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

	
	/******************* [OWNERSHIP] *******************/
	c_ownership: async (blogPost_id, user_id) => {
		try {
			// [VALIDATE] blogPost_id //
			if (!mongoose.isValidObjectId(blogPost_id)) {
				return {
					executed: true,
					status: false,
					message: 'BlogPostCollection: Invalid blogPost_id',
					updated: false,
				}
			}
	
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'BlogPostCollection: Invalid user_id',
					updated: false,
				}
			}
	
			const post = await BlogPostModel.findOne({
				_id: blogPost_id,
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
			const count = await BlogPostModel.countDocuments()
	
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


	c_count_byUser: async ({ user_id }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'BlogPostCollection: Invalid user_id',
					updated: false,
				}
			}
	
			const count = await BlogPostModel.countDocuments({ user: user_id })
	
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
	c_fillData: async (blogData) => {
		return await c_fillData( blogData)
	},
}