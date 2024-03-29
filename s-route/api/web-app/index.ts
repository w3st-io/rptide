// [IMPORT]
import h from "./.handler";

// [IMPORT] Personal
import cors from "cors";
import express from "express";
import Auth from "../../../s-middleware/Auth";
import TierChecker from '../../../s-middleware/TierChecker';


// [EXPRESS + USE]
const router = express.Router().use(cors());


router.post(
	"/create",
	Auth.userToken(),
	TierChecker.webAppLimitCheck(),
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/create"](req));
	}
);


router.post(
	"/find-one",
	Auth.userToken(),
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/find-one"](req));
	}
);


// [UPDATE] Auth Required
router.post(
	"/find-one-and-update",
	Auth.userTokenOrAPIPrivateKey(),
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/find-one-and-update"](req));
	}
);
		
		
// [DELETE] Auth Required
router.post(
	"/delete-one",
	Auth.userToken(),
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/delete-one"](req));
	}
);


export default router;