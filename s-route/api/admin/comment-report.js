// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const validator = require('validator')


// [REQUIRE] Personal //
const CommentReportCollection = require('../../../s-collections/CommentReportCollection')
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [MARK-HANDLED-STATUS] *******************/
router.get(
	'/mark-handled/:commentReport_id',
	Auth.adminToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (validator.isAscii(req.params.commentReport_id)) {
				const returned = await CommentReportCollection.c_markHandled(
					req.params.commentReport_id
				)

				res.send(returned)
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/admin/comment-reports/mark-handled',
					message: 'Invalid commentReport_id'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/admin/comment-reports/mark-handled',
				message: `Error --> ${err}`,
			})
		}
	}
)


module.exports = router