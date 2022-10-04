// [IMPORT]
import cors from "cors"
import express from "express";

// [IMPORT] Personal
import h from './.handler';
import Auth from "../../../s-middlewares/Auth";
import TierChecker from '../../../s-middlewares/TierChecker';


// [EXPRESS + USE]
const router = express.Router().use(cors())


router.post(
	'/create',
	Auth.userToken(),
	TierChecker.productLimitCheck(),
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/create"](req));
	}
);


router.post(
	'/find',
	Auth.userToken(),
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/find"](req));
	}
);


router.post(
	'/find-one',
	Auth.userToken(),
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/find-one"](req));
	}
);


router.post(
	'/update',
	Auth.userToken(),
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/update"](req));
	}
);


router.post(
	'/delete-one',
	Auth.userToken(),
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/delete-one"](req));
	}
);


export default router;