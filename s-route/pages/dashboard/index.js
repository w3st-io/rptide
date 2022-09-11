// [REQUIRE]
const cors = require('cors');
const express = require('express');


// [REQUIRE] Personal
const rh = require('./index.handler');
const Auth = require('../../../s-middlewares/Auth');


// [EXPRESS + USE]
const router = express.Router().use(cors());


// [SEARCH] //
router.get(
	'/index/:webapp/:tab/:sort/:limit/:page',
	Auth.userToken(),
	async (req, res) => { res.send(await rh.index({ req })); }
);


module.exports = router;