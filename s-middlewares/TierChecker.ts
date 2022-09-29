// [IMPORT] Personal
import config_const from "../s-config/const";
import ProductModel from "../s-models/Product.model";
import ProductOptionModel from "../s-models/ProductOptionModel";
import UserModel from "../s-models/User.model";
import WebAppModel from "../s-models/WebApp.model";
import h_user from "../s-route/api/user/.handler";


// [INIT]
const location = "/s-middleware/Subscription";


export default {
	webAppLimitCheck: function () {
		return async (req, res, next) => {
			await h_user.cycleCheckStripe({
				user_id: req.user_decoded._id
			});

			// [INIT]
			let flag = false;

			// [MONGODB][User]
			const user = await UserModel.findOne({
				_id: req.user_decoded._id
			});

			const count = await WebAppModel.countDocuments({
				user: req.user_decoded._id
			});

			// [LIMIT-CHECK] Tier 1 //
			if (count >= config_const.limit.webApp[0]) {
				if (!user.stripe.subscription.tier1.subId) {
					flag = true;
				}
			}

			// [LIMIT-CHECK] Tier 2 //
			if (count >= config_const.limit.webApp[1]) {
				if (!user.stripe.subscription.tier2.subId) {
					flag = true;
				}
			}

			// [LIMIT-CHECK]
			if (count >= config_const.limit.webApp[2]) {
				flag = true;
			}
			
			if (flag) {
				res.send({
					executed: true,
					status: false,
					location: location,
					message: "WebApp limit reached for your tier, Please upgrade or delete"
				});
			}
			else { next(); }
		}
	},


	productLimitCheck: function () {
		return async (req, res, next) => {
			await h_user.cycleCheckStripe({
				user_id: req.user_decoded._id
			});
			
			// [INIT]
			let flag = false

			// [MONGODB][User]
			const user = await UserModel.findOne({
				_id: req.user_decoded._id
			});
			
			const count = await ProductModel.countDocuments({
				user: req.user_decoded._id
			});

			// [LIMIT-CHECK] Tier 1 //
			if (count >= config_const.limit.webApp[0]) {
				if (!user.stripe.subscription.tier1.subId) {
					flag = true;
				}
			}

			// [LIMIT-CHECK] Tier 2 //
			if (count >= config_const.limit.webApp[1]) {
				if (!user.stripe.subscription.tier2.subId) {
					flag = true;
				}
			}

			// [LIMIT-CHECK]
			if (count >= config_const.limit.webApp[2]) {
				flag = true;
			}
			
			if (flag) {
				res.send({
					executed: true,
					status: false,
					location: location,
					message: "Product limit reached for your tier, Please upgrade or delete"
				});
			}
			else { next(); }
		}
	},


	productOptionLimitCheck: function () {
		return async (req, res, next) => {
			await h_user.cycleCheckStripe({
				user_id: req.user_decoded._id
			});
			
			// [INIT]
			let flag = false

			// [MONGODB][User]
			const user = await UserModel.findOne({
				_id: req.user_decoded._id
			});
			
			const count = await ProductOptionModel.countDocuments({
				user: req.user_decoded._id
			});

			// [LIMIT-CHECK] Tier 1 //
			if (count >= config_const.limit.webApp[0]) {
				if (!user.stripe.subscription.tier1.subId) {
					flag = true;
				}
			}

			// [LIMIT-CHECK] Tier 2 //
			if (count >= config_const.limit.webApp[1]) {
				if (!user.stripe.subscription.tier2.subId) {
					flag = true;
				}
			}

			// [LIMIT-CHECK]
			if (count >= config_const.limit.webApp[2]) {
				flag = true;
			}
			
			if (flag) {
				res.send({
					executed: true,
					status: false,
					location: location,
					message: "ProductOptions limit reached for your tier, Please upgrade or delete"
				});
			}
			else { next(); }
		}
	},
}