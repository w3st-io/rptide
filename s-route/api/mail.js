// ORDER: to, subject, type, user_id, clientEmail, name, message, position, html, attachments
// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.post(
	'/get-quote',
	async (req, res) => {
		try {
			res.send()
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/mail/get-quote',
				message: `Error --> ${err}`
			})
		}
	}
)


module.exports = router