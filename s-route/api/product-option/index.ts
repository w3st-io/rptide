// [IMPORT]
import cors from "cors";
import express from "express";
import validator from "validator";

// [IMPORT] Personal
import ProductOptionCollection from "../../../s-collections/ProductOptionCollection";


// [REQUIRE] Personal
const Auth = require("../../../s-middlewares/Auth");


// [EXPRESS + USE]
const router = express.Router().use(cors());


// [INIT]
const location = "/api/user/product-options";


/******************* [CRUD] *******************/
// [CREATE]
router.post(
	"/create",
	Auth.userToken(),
	async (req: any, res: express.Response) => {
		try {
			if (validator.isAscii(req.body.name)) {
				// [COLLECTION][ProductOption][CREATE]
				const productObj = await ProductOptionCollection.c_create({
					user_id: req.user_decoded._id,
					productOption: req.body
				})

				if (productObj.status) {
					res.send({
						executed: true,
						status: true,
						productObj: productObj,
					})
				}
				else { res.send(productObj) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: location,
					message: `${location}: Invalid Parameters`
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: `${location}/read-all/:limit/:page`,
				message: `${location}: Error --> ${err}`
			})
		}
	}
)


export default router