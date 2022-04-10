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


// [INIT] //
const secretKey = config.app.secretKey


// [EXPRESS + USE] //
const router = express.Router().use(cors())


module.exports = {
	login: async ({ req }) => {
		try {
			// [VALIDATE] //
			if (!validator.isAscii(req.body.email)) {
				return {
					executed: true,
					status: false,
					location: '/api/admin/login',
					message: 'Invalid Params'
				}
			}

			// [VALIDATE] //
			if (!validator.isAscii(req.body.password)) {
				return {
					executed: true,
					status: false,
					location: '/api/admin/login',
					message: 'Invalid Params'
				}
			}

			// [VALIDATE] email // [VALIDATE] password //
			if (!validator.isEmail(req.body.email)) {
				return {
					executed: true,
					status: false,
					location: '/api/admin/login',
					message: 'Invalid password',
				}
			}

			// [VALIDATE] //
			if (!validator.isAscii(req.body.password)) {
				return {
					executed: true,
					status: false,
					location: '/api/admin/login',
					message: 'Invalid password'
				}
			}

			// [ADMIN-COLLECTION] //
			const adminObj = await AdminCollection.c_read_byEmail(req.body.email)

			// [VALIDATE] //
			if (!adminObj.admin) {
				return {
					executed: true,
					status: true,
					validation: false,
					location: '/api/admin/login',
					message: 'Invalid email',
				}
			}

			// [VALIDATE][PASSWORD] //
			if (!bcrypt.compareSync(req.body.password, adminObj.admin.password)) {
				return {
					executed: true,
					status: true,
					validation: false,
					location: '/api/admin/login',
					message: 'Invalid password',
				}
			}

			const token = jwt.sign(
				{
					admin_id: adminObj.admin._id,
					role: adminObj.admin.role,
					email: adminObj.admin.email,
					username: adminObj.admin.username,
					first_name: adminObj.admin.first_name,
					last_name: adminObj.admin.last_name,
				},
				secretKey,
				{/* expiresIn: 7200 */}
			)
	
			// [SUCCESS] //
			return {
				executed: true,
				status: true,
				validation: true,
				token: token,
				location: '/api/admin/login',
				message: 'success',
			}
		}
		catch (err) {
			return {
				executed: false,
				status: false,
				location: '/api/admin/login',
				message: `Error --> ${err}`,
			}
		}
	}
}