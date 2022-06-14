// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const path = require('path')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


router.get(
	'/',
	async (req, res) => {
		res.sendFile(path.resolve(__dirname, 'index.html'))
	}
)


module.exports = router