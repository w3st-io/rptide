// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const socketService = require('../../s-socket/socketService')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/',
	async (req, res) => {
		try {
			res.send({
				executed: true,
				status: true,
				socketState: socketService.status(),
			})
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/api/socket',
				message: `Error --> ${err}`,
			})
		}
	}
)


module.exports = router