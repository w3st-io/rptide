// [IMPORT]
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

// [IMPORT] Personal
import Auth from "../../../s-middlewares/Auth";
import ProductOptionModel, { IProductOption } from "../../../s-models/ProductOption.model";
import formatterUtil from "../../../s-utils/formatterUtil";


// [EXPRESS + USE]
const router = express.Router().use(cors());


// [INIT]
let returnObj: any = {
	executed: true,
	status: false,
	location: "/api/user/product-options",
	message: "",
};


/******************* [CRUD] *******************/
// [CREATE]
router.post(
	"/create",
	Auth.userToken(),
	async (req: express.Request, res: express.Response) => {
		try {
			const productOption: IProductOption = req.body;

			console.log(productOption);
			
			// [INIT]
			let variants = [];

			for (let i = 0; i < productOption.variants.length; i++) {
				const v = productOption.variants[i];

				v.price.cents = formatterUtil.centFormatter(v.price.cents);

				variants.push(
					{
						name: v.name,
						images: [],
						price: {
							number: parseFloat(`${v.price.dollars}.${v.price.cents}`),
							inPennies: Math.floor(
								parseFloat(`${v.price.dollars}.${v.price.cents}`) * 100
							),
							string: `${v.price.dollars}.${v.price.cents}`,
							dollars: v.price.dollars,
							cents: v.price.cents,
						}
					}
				);
			}

			// [COLLECTION][ProductOption][CREATE]
			const createdProductOption = await new ProductOptionModel({
				_id: new mongoose.Types.ObjectId(),
				user: req.body.user_decoded._id,
				name: productOption.name,
				variants: variants,
			}).save();

			// [200]
			res.send({
				...returnObj,
				status: true,
				productOption: createdProductOption
			});
		}
		catch (err) {
			res.send({
				...returnObj,
				executed: false,
				message: `Error --> ${err}`
			})
		}
	}
)


export default router;