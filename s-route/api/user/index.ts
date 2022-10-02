// [IMPORT]
import cors from "cors";
import express from "express";

// [IMPORT] Personal
import h from "./.handler";
import Auth from "../../../s-middlewares/Auth";
import Functionality from "../../../s-middlewares/Functionality";


// [EXPRESS + USE]
const router = express.Router().use(cors());


router.post(
	"/update/workspace--web-app",
	Auth.userToken(),
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/update/workspace--web-app"]({ req }));
	}
);

router.post(
	"/update/password",
	Auth.userToken(),
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/update/password"]({ req }));
	}
);

router.post(
	"/generate-api-key",
	Auth.userToken(),
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/generate-api-key"]({ req }));
	}
);

router.post(
	"/update/tier",
	Auth.userToken(),
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/update/tier"]({ req }));
	}
);

router.post(
	"/stripe-payment-method",
	Auth.userToken(),
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/stripe-payment-method"]({ req }));
	}
);


router.post(
	"/stripe-payment-method-update",
	Auth.userToken(),
	Functionality.commerce(),
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/stripe-payment-method-update"]({ req }));
	}
);

router.post(
	"/stripe-payment-method-delete",
	Auth.userToken(),
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/stripe-payment-method-delete"]({ req }));
	}
);


export default router;