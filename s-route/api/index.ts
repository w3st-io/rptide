// [IMPORT]
import cors from "cors";
import express from "express";

// [IMPORT] Personal
import h from "./.handler";


// [REQUIRE] Personal
const Auth = require("../../s-middlewares/Auth");


// [EXPRESS + USE]
const router = express.Router().use(cors());


// [MAIN-ROUTE]
router.get(
	"/",
	Auth.userTokenNotRequired(),
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/"]({ req }));
	}
);


router.post(
	"/login",
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/login"]({ req }));
	}
);


router.post(
	"/register",
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/register"]({ req }));
	}
);


router.post(
	"/complete-registration",
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/complete-registration"]({ req }));
	}
);


router.post(
	"/resend-verification-email",
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/resend-verification-email"]({ req }));
	}
);


router.post(
	"/request-reset-password",
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/request-reset-password"]({ req }));
	}
);


router.post(
	"/reset-password",
	async (req: express.Request, res: express.Response) => {
		res.send(await h["/reset-password"]({ req }));
	}
);


export default router;