// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const config = require('../../s-config')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/',
	async (req, res) => {
		res.send({
			executed: true,
			status: true,
			node_env: config.nodeENV,
			message: 'API live'
		})
	}
)


module.exports = router