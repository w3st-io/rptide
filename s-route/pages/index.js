// [REQUIRE]
const cors = require('cors');
const express = require('express');


// [REQUIRE] Personal
const Auth = require('../../s-middlewares/Auth');


// [EXPRESS + USE]
const router = express.Router().use(cors());


router.get(
	'/',
	Auth.userTokenNotRequired(),
	async (req, res) => {
		res.send({
			executed: true,
			status: true,
		});
	}
);


module.exports = router;