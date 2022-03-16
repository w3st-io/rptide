// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const PostFollowModel = require('../s-models/PostFollowModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, post_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'PostFollowCollection: Invalid user_id',
				updated: false,
			}
		}

		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'PostFollowCollection: Invalid post_id',
				updated: false,
			}
		}

		// [EXISTANCE] //
		const existance = await c_existance(user_id, post_id)

		if (!existance.status || existance.existance) {
			return {
				executed: true,
				status: false,
				message: existance.message,
			}
		}

		// [SAVE] //
		const createdPostFollow = await new PostFollowModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			post: post_id,
		}).save()

		return {
			executed: true,
			status: true,
			createdPostFollow: createdPostFollow,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `PostFollowCollection: Error --> ${err}`,
		}
	}
}


/******************* [OTHER-CRUD] *******************/
// [READ-ALL] //
const c_readAll_sorted_byUser = async (user_id, sort = 0, limit, skip) => {
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
				message: 'PostFollowCollection: Invalid user_id',
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

		if (sort == 0) { sort = {} }
		else if (sort == 1) { sort = { createdAt: -1 }  }

		const postFollows = await PostFollowModel.find({ user: user_id })
			.sort(sort)
			.limit(limit)
			.skip(skip)
			.exec()

		return {
			executed: true,
			status: true,
			postFollows: postFollows,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `PostFollowCollection: Error --> ${err}`,
		}
	}
}


// [READ-ALL] //
const c_readAll_byPost = async (post_id) => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'PostFollowCollection: Invalid post_id',
			}
		}

		const postFollows = await PostFollowModel.find({ post: post_id })

		return {
			executed: true,
			status: true,
			postFollows: postFollows,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `PostFollowCollection: Error --> ${err}`,
		}
	}
}


// [DELETE] Post //
const c_delete_byPost = async (post_id) => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'PostFollowCollection: Invalid post_id',
				updated: false,
			}
		}

		const deletedPostFollow = await PostFollowModel.deleteMany({
			post: post_id
		})

		return {
			executed: true,
			status: true,
			deletedPostFollow: deletedPostFollow
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `PostFollowCollection: Error --> ${err}`,
		}
	}
}


// [DELETE] User & Post //
const c_delete_byUserAndPost = async (user_id, post_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'PostFollowCollection: Invalid user_id',
				updated: false,
			}
		}

		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'PostFollowCollection: Invalid post_id',
				updated: false,
			}
		}

		const deletedPostFollow = await PostFollowModel.deleteMany({
			user: user_id,
			post: post_id,
		})

		return {
			executed: true,
			status: true,
			deletedPostFollow: deletedPostFollow
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `PostFollowCollection: Error --> ${err}`,
		}
	}
}


// [DELETE] Custom //
const c_delete_custom = async (filter) => {
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

		const deletedPostFollow = await PostFollowModel.deleteMany(filter)

		return {
			executed: true,
			status: true,
			deletedPostFollow: deletedPostFollow
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `PostFollowCollection: Error --> ${err}`,
		}
	}
}


/******************* [EXISTANCE] *******************/
const c_existance = async (user_id, post_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'PostFollowCollection: Invalid user_id',
				updated: false,
			}
		}

		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'PostFollowCollection: Invalid post_id',
				updated: false,
			}
		}

		const postFollow = await PostFollowModel.findOne({
			user: user_id,
			post: post_id,
		})

		if (postFollow) {
			return {
				executed: true,
				status: true,
				existance: true,
				postFollow: postFollow,
			}
		}
		else {
			return {
				executed: true,
				status: true,
				existance: false,
			}
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `PostFollowCollection: Error --> ${err}`,
		}
	}
}


/******************* [COUNT] *******************/
const c_count_byPost = async (post_id) => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(post_id)) {
			return {
				executed: true,
				status: false,
				message: 'PostFollowCollection: Invalid post_id',
			}
		}

		const count = await PostFollowModel.countDocuments({ post: post_id })
		
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
			message: `PostFollowCollection: Error --> ${err}`
		}
	}
}


const c_countAllUser = async (user_id) => {
	try {
		// [VALIDATE] post_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'PostFollowCollection: Invalid post_id',
			}
		}

		const count = await PostFollowModel.countDocuments({ user: user_id })
		
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
			message: `PostFollowCollection: Error --> ${err}`
		}
	}
}


module.exports = {
	c_create,
	c_readAll_sorted_byUser,
	c_readAll_byPost,
	c_delete_byPost,
	c_delete_byUserAndPost,
	c_delete_custom,
	c_existance,
	c_count_byPost,
	c_countAllUser,
}
