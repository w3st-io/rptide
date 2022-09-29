// [IMPORT]
import cors from "cors"
import express from "express";

// [IMPORT] Personal
import h from './.handler';
import TierChecker from '../../../s-middlewares/TierChecker';


// [REQUIRE] Personal
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE]
const router = express.Router().use(cors())


router.post(
	'/create',
	Auth.userToken(),
	TierChecker.productLimitCheck(),
	async (req, res) => {
		res.send(await h.create({ req }));
	}
);


router.post(
	'/find',
	Auth.userToken(),
	async (req, res) => {
		res.send(await h.find({ req }));
	}
);


router.post(
	'/find-one',
	Auth.userToken(),
	async (req, res) => {
		res.send(await h.findOne({ req }));
	}
);


router.post(
	'/update',
	Auth.userToken(),
	async (req, res) => {
		res.send(await h.update({ req }));
	}
);


router.post(
	'/delete-one',
	Auth.userToken(),
	async (req, res) => {
		res.send(await h.deleteOne({ req }));
	}
);


module.exports = router;