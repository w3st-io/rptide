// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')


// [REQUIRE] Personal //
const BanCollection = require('../../../s-collections/BanCollection')
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [BAN] *******************/
// [UPDATE] Auth Required //
router.get(
	'/ban/:user_id/:hours',
	Auth.adminToken(),
	async (req, res) => {
		try {
			// [SANITZE] //
			hours = parseInt(req.params.hours)

			// [VALIDATE] //
			if (
				validator.isAscii(req.params.user_id) &&
				Number.isInteger(parseInt(req.params.hours))
			) {
				const returned = await BanCollection.c_create(
					req.params.user_id,
					hours
				)

				res.send(returned)
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/admin/users/ban',
					message: 'Invalid user_id'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/admin/users/ban',
				message: `Error --> ${err}`,
			})
		}
	}
)


module.exports = router