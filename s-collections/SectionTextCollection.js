// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] //
const SectionTextModel = require('../s-models/SectionTextModel')
const CommentCollection = require('./CommentCollection')


async function c_fillData(sectionText) {
	// [COUNT] Comments //
	const cObj = await CommentCollection.c_count_bySectionText(sectionText._id)
	
	sectionText.commentCount = cObj.count

	return sectionText
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
					message: 'SectionTextCollection: Invalid user_id',
				}
			}
	
			// [VALIDATE] title //
			if (!title) {
				return {
					executed: true,
					status: false,
					message: 'SectionTextCollection: No title passed',
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
			const createdSectionText = await new SectionTextModel({
				_id: mongoose.Types.ObjectId(),
				user: user_id,
				title: title,
				cleanJSON: cleanJSON,
			}).save()
	
			return {
				executed: true,
				status: true,
				createdSectionText: createdSectionText,
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
	c_read: async (user_id, sectionText_id) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'SectionTextCollection: Invalid user_id',
				}
			}
	
			// [VALIDATE] sectionText_id //
			if (!mongoose.isValidObjectId(sectionText_id)) {
				return {
					executed: true,
					status: false,
					message: 'SectionTextCollection: Invalid sectionText_id',
				}
			}
	
			let sectionText = await SectionTextModel.findById(sectionText_id)
				.populate({
					path: 'user',
					select: 'username email bio profile_img',
				})
				.exec()
	
			// Check if sectionText found //	
			if (!sectionText) {
				return {
					executed: true,
					status: false,
					sectionText: sectionText,
					message: 'SectionTextCollection: No sectionText found'
				}
			}
	
			// [FILL-DATA] //
			sectionText = await c_fillData(sectionText)
			
			return {
				executed: true,
				status: true,
				sectionText: sectionText
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
	c_delete: async (sectionText_id) => {
		try {
			// [VALIDATE] sectionText_id //
			if (!mongoose.isValidObjectId(sectionText_id)) {
				return {
					executed: true,
					status: false,
					message: 'SectionTextCollection: Invalid sectionText_id',
					deleted: false,
				}
			}
	
			const deletedSectionText = await SectionTextModel.findByIdAndDelete(sectionText_id)
			
			return {
				executed: true,
				status: true,
				deleted: true,
				deletedSectionText: deletedSectionText,
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
					message: 'SectionTextCollection: Invalid user_id',
				}
			}
	
			// [VALIDATE] sort //
			if (!Number.isInteger(sort)) {
				return {
					executed: true,
					status: false,
					message: 'SectionTextCollection: Invalid sort',
				}
			}
	
			// [VALIDATE] limit //
			if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
				return {
					executed: true,
					status: false,
					message: 'SectionTextCollection: Invalid limit',
				}
			}
	
			// [VALIDATE] skip //
			if (!Number.isInteger(skip)) {
				return {
					executed: true,
					status: false,
					message: 'SectionTextCollection: Invalid skip',
				}
			}
	
			// Set Sort //
			if (sort == 0) { sort = { createdAt: -1 } }
			else {
				return {
					executed: true,
					status: false,
					message: 'SectionTextCollection: Unknown filter'
				}
			}
	
			let sectionTexts = await SectionTextModel.find({ user: user_id })
				.sort(sort)
				.limit(limit)
				.skip(skip)
				.populate({
					path: 'user',
					select: 'username bio profile_img',
				})
				.exec()
	
			// [FILL-DATA] //
			for (let i = 0; i < sectionTexts.length; i++) {
				sectionTexts[i] = await c_fillData(sectionTexts[i])
			}
	
			return {
				executed: true,
				status: true,
				sectionTexts: sectionTexts,
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
	c_deleteOne_byIdAndUser: async ({ sectionText_id, user_id }) => {
		try {
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'SectionTextCollection: Invalid user_id',
				}
			}
	
			// [VALIDATE] sectionText_id //
			if (!mongoose.isValidObjectId(sectionText_id)) {
				return {
					executed: true,
					status: false,
					message: 'SectionTextCollection: Invalid sectionText_id',
					deleted: false,
				}
			}
	
			const deletedPost = await SectionTextModel.deleteOne({
				_id: sectionText_id,
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
					message: 'SectionTextCollection: Invalid user_id',
				}
			}
			
			// [VALIDATE] sectionText_id //
			if (!validator.isAscii(query)) {
				return {
					executed: true,
					status: false,
					message: 'SectionTextCollection: Invalid query',
					existance: false,
				}
			}

			// [INIT] //
			exactMatch = []
	
			// [READ] //
			const sectionTexts = await SectionTextModel.fuzzySearch({ query: query })
				.populate({
					path: 'user',
					select: 'username bio profile_img'
				})
				.limit(limit)
				.skip(skip)
				.exec()

			// [EXACT-MATCH] //
			exactMatch = await SectionTextModel.find({ title: query })
				.select('-password')
				.exec()

			if (sectionTexts.length == 0 && exactMatch.length == 1) {
				sectionTexts.push(exactMatch[0])
			}

	
			// [FILL-DATA] //
			for (let i = 0; i < sectionTexts.length; i++) {
				sectionTexts[i] = await c_fillData(sectionTexts[i])
			}
	
			return {
				executed: true,
				status: true,
				sectionTexts: sectionTexts,
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
			let count = await SectionTextModel.fuzzySearch({ query: query })
				.countDocuments()
	
			// [EXACT-MATCH] //
			exactMatch = await SectionTextModel.find({ title: query }).countDocuments()

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
	c_ownership: async (sectionText_id, user_id) => {
		try {
			// [VALIDATE] sectionText_id //
			if (!mongoose.isValidObjectId(sectionText_id)) {
				return {
					executed: true,
					status: false,
					message: 'SectionTextCollection: Invalid sectionText_id',
					updated: false,
				}
			}
	
			// [VALIDATE] user_id //
			if (!mongoose.isValidObjectId(user_id)) {
				return {
					executed: true,
					status: false,
					message: 'SectionTextCollection: Invalid user_id',
					updated: false,
				}
			}
	
			const post = await SectionTextModel.findOne({
				_id: sectionText_id,
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
			const count = await SectionTextModel.countDocuments()
	
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
					message: 'SectionTextCollection: Invalid user_id',
					updated: false,
				}
			}
	
			const count = await SectionTextModel.countDocuments({ user: user_id })
	
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
		return await c_fillData(blogData)
	},
}