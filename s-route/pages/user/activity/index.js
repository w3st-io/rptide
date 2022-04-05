// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const ActivityCollection = require('../../../../s-collections/ActivityCollection')
const Auth = require('../../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/index/:sort/:limit/:page',
	Auth.userToken(),
	async (req, res) => {
		try {
			// [VALIDATE] //
			if (
				Number.isInteger(parseInt(req.params.sort)) &&
				Number.isInteger(parseInt(req.params.limit)) &&
				Number.isInteger(parseInt(req.params.page))
			) {
				// [INIT] //
				const sort = parseInt(req.params.sort)
				const limit = parseInt(req.params.limit)
				const pageIndex = parseInt(req.params.page) - 1
				const skip = pageIndex * limit

				const activitiesObj = await ActivityCollection.c_readAll_sorted_byUser({
					user_id: req.user_decoded.user_id,
					sort: sort,
					limit: limit,
					skip: skip
				})
				
				// [COUNT] Activities //
				activitiesObj.count = (
					await ActivityCollection.c_count_byUser(req.user_decoded.user_id)
				).count
				
				// [COUNT] Calculate Pages //
				activitiesObj.totalPages = Math.ceil(activitiesObj.count / limit)

				res.send(activitiesObj)
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/pages/user/activity',
					message: 'Invalid params'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/user/activity',
				message: `Error --> ${err}`
			})
		}
	}
)


module.exports = router