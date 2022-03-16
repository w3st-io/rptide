// [REQUIRE] //
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const UserReportModel = require('../s-models/UserReportModel')


/******************* [CRUD] *******************/
// [CREATE] //
const c_create = async (user_id, reportType, reportedUser_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'UserReportCollection: Invalid user_id',
			}
		}

		// [VALIDATE] reportType //
		if (!validator.isAlpha(reportType)) {
			return {
				executed: true,
				status: false,
				message: 'UserReportCollection: Invalid reportType',
			}
		}

		// [VALIDATE] reportedUser_id //
		if (!mongoose.isValidObjectId(reportedUser_id)) {
			return {
				executed: true,
				status: false,
				message: 'UserReportCollection: Invalid reportedUser_id',
			}
		}

		// [FORMAT] //
		reportType = reportType.toLowerCase()
	
		// [SAVE] //
		const userReport = await new UserReportModel({
			_id: mongoose.Types.ObjectId(),
			user: user_id,
			reportType,
			reportedUser: reportedUser_id,
		}).save()

		return {
			executed: true,
			status: true,
			created: true,
			userReport: userReport,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserReportCollection: Error --> ${err}`
		}
	}
}


// [DELETE] //
const c_delete = async (userReport_id) => {
	try {
		// [VALIDATE] userReport_id //
		if (!mongoose.isValidObjectId(userReport_id)) {
			return {
				executed: true,
				status: false,
				message: 'UserReportCollection: Invalid userReport_id'
			}
		}

		const userReport = await UserReportModel.deleteOne({ _id: userReport_id })

		return {
			executed: true,
			status: true,
			userReport: userReport,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserReportCollection: Error --> ${err}`
		}
	}
}


/******************* [OTHER-CRUD] *******************/
const c_read_unhandled = async (sort, limit, skip) => {
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
				message: 'UserReportCollection: Invalid sort',
			}
		}

		// [VALIDATE] limit //
		if (!Number.isInteger(limit) || limit >= 200 || limit <= -200) {
			return {
				executed: true,
				status: false,
				message: 'UserReportCollection: Invalid limit',
			}
		}

		// [VALIDATE] skip //
		if (!Number.isInteger(skip)) {
			return {
				executed: true,
				status: false,
				message: 'UserReportCollection: Invalid skip',
			}
		}

		// Set Sort //
		if (sort == 0) { sort = {} }
		else if (sort == 1) { sort = { createdAt: -1 } }
		else {
			return {
				executed: true,
				status: false,
				message: 'UserReportCollection: Unknown filter'
			}
		}

		const userReports = await UserReportModel.find({ handled: false })
			.sort(sort)
			.limit(limit)
			.skip(skip)
			.populate({
				path: 'user',
				select: 'username email bio profile_img'
			})
			.exec()

		return {
			executed: true,
			status: true,
			userReports: userReports
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserReportCollection: Error --> ${err}`
		}
	}
}


/******************* [MARK-HANDLED-STATUS] *******************/
const c_markHandled = async (userReport_id) => {
	try {
		// [VALIDATE] userReport_id //
		if (!mongoose.isValidObjectId(userReport_id)) {
			return {
				executed: true,
				status: false,
				message: 'UserReportCollection: Invalid userReport_id',
			}
		}

		const userReport = await UserReportModel.updateOne(
			{ _id: userReport_id },
			{ handled: true },
		)
			
		return {
			executed: true,
			status: true,
			markedHandled: true,
			userReport: userReport
		}
	}	
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserReportCollection: Error --> ${err}`,
			markedHandled: true,
		}
	}
}


/******************* [EXISTANCE] *******************/
// Verify that User is not Double Reporting //
const c_existance_byUserAndReportedUser = async (user_id, reportedUser_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'UserReportCollection: Invalid user_id',
			}
		}

		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(reportedUser_id)) {
			return {
				executed: true,
				status: false,
				message: 'UserReportCollection: Invalid user_id',
			}
		}

		const userReport = await UserReportModel.findOne({
			user: user_id,
			reportedUser: reportedUser_id
		})

		if (!userReport) {
			return {
				executed: true,
				status: true,
				message: 'Comment report does NOT exists',
				existance: false,
			}
		}

		return {
			executed: true,
			status: true,
			message: 'Comment report exists',
			existance: true,
			userReport: userReport,
		}
	}
	catch (err) {
		return {
			executed: false,
			status: false,
			message: `UserReportCollection: Error --> ${err}`
		}
	}
}


/******************* [COUNT] *******************/
const c_count = async () => {
	try {
		const count = await UserReportModel.countDocuments()

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
			message: `userReportsColelction: Error --> ${err}`
		}
	}
}


const c_count_byUser = async (user_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'UserReportCollection: Invalid user_id',
			}
		}

		const count = await UserReportModel.countDocuments({
			user: user_id
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
			message: `userReportsColelction: Error --> ${err}`
		}
	}
}


const c_count_byReportedUserAndHandled = async (user_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'UserReportCollection: Invalid user_id',
			}
		}

		const count = await UserReportModel.countDocuments({
			user: user_id,
			handled: true,
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
			message: `userReportsColelction: Error --> ${err}`
		}
	}
}


const c_count_byReportedUserAndUnhandled = async (user_id) => {
	try {
		// [VALIDATE] user_id //
		if (!mongoose.isValidObjectId(user_id)) {
			return {
				executed: true,
				status: false,
				message: 'UserReportCollection: Invalid user_id',
			}
		}

		const count = await UserReportModel.countDocuments({
			user: user_id,
			handled: false,
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
			message: `userReportsColelction: Error --> ${err}`
		}
	}
}


module.exports = {
	c_create,
	c_delete,
	c_read_unhandled,
	c_markHandled,
	c_existance_byUserAndReportedUser,
	c_count,
	c_count_byUser,
	c_count_byReportedUserAndHandled,
	c_count_byReportedUserAndUnhandled
}