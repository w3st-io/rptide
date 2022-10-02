// [IMPORT]
import h from "./.handler";

// [IMPORT] Personal
import cors from "cors";
import express from "express";
import Auth from "../../../s-middlewares/Auth";
import TierChecker from '../../../s-middlewares/TierChecker';
import rateLimiter from "../../../s-rate-limiters";


// [EXPRESS + USE]
const router = express.Router().use(cors());


router.post(
	"/create",
	rateLimiter.post,
	Auth.userToken(),
	TierChecker.webAppLimitCheck(),
	async (req: express.Request, res: express.Response) => {
		res.send(await h.create({ req }));
	}
);


router.post(
	"/find-one",
	rateLimiter.post,
	Auth.userToken(),
	async (req: express.Request, res: express.Response) => {
		res.send(await h.findOne({ req }));
	}
);


// [UPDATE] Auth Required
router.post(
	"/find-one-and-update",
	Auth.userTokenOrAPIPrivateKey(),
	async (req: express.Request, res: express.Response) => {
		res.send(await h.findOneAndUpdate({ req }));
	}
);
		
		
// [DELETE] Auth Required
router.post(
	"/delete-one",
	rateLimiter.post,
	Auth.userToken(),
	async (req: express.Request, res: express.Response) => {
		res.send(await h.deleteOne({ req }));
	}
);


export default router;