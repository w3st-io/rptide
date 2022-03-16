// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const UserCollection = require('../../../../s-collections/UserCollection')
const Auth = require('../../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [READ-ALL] Auth Required //
router.get(
	'/:sort/:limit/:page',
	Auth.adminToken(),
	async (req, res) => {
		try {
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

				// [READ-ALL][User] Sort //
				const { users } = await UserCollection.c_readAll_sorted({
					sort: sort,
					limit: limit,
					skip: skip
				})
				
				// [COUNT][User] Sort //
				const { count } = await UserCollection.c_count()

				const totalPages = Math.ceil(count / limit)

				res.send({
					executed: true,
					status: true,
					users: users,
					userCount: count,
					totalPages: totalPages,
				})
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/pages/admin/function/users',
					message: 'Invalid Params'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/admin/function/users',
				message: `Error --> ${err}`
			})
		}
	}
)


module.exports = router