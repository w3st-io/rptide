// [IMPORT]
import cors from "cors";
import express from "express";


// [EXPRESS + USE]
const router = express.Router().use(cors());


router.get(
	"/",
	async (req: express.Request, res: express.Response) => {
		console.log('RUNNING');
		
		res.send({});
	}
);


export default router;