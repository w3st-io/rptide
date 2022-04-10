// [REQUIRE] //
const bcrypt = require('bcryptjs')
const cors = require('cors')
const express = require('express')
const jwt = require('jsonwebtoken')
const validator = require('validator')


// [REQUIRE] Personal //
const config = require('../../../s-config')
const rateLimiters = require('../../../s-rate-limiters')
const AdminCollection = require('../../../s-collections/AdminCollection')
const rh_api_admin = require('../../../s-route-handler/api/admin')


// [INIT] //
const secretKey = config.app.secretKey


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [LOGIN/REGISTER] *******************/
// [LOGIN] //
router.post(
	'/login',
	async (req, res) => { res.send(await rh_api_admin.login({ req })) }
)


// [REGISTER] //
router.post(
	'/register',
	rateLimiters.registration,
	async (req, res) => {
		try {
			if (
				validator.isAscii(req.body.username) &&
				validator.isAscii(req.body.email) &&
				validator.isAscii(req.body.password)
			) {
				const returned = await AdminCollection.c_register(
					req.body.username,
					req.body.email,
					req.body.password,
				)

				res.send(returned)
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/api/admin/register',
					message: 'Invalid Params'
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/admin/register',
				message: `Error --> ${err}`,
			})
		}
	}
)


module.exports = router