// [REQUIRE]
const ProductCollection = require('../s-collections/ProductCollection')
const ApiSubscriptionCollection = require('../s-collections/ApiSubscriptionCollection')
const config_const = require('../s-config/const')
const WebAppModel = require('../s-models/WebAppModel')


// [INIT] //
const location = '/s-middleware/Subscription'


module.exports = {
	webAppLimitCheck: function () {
		return async (req, res, next) => {
			// [INIT] //
			let flag = false

			// [READ][ApiSubscription] //
			const apiSubObj = await ApiSubscriptionCollection.c_read_byUser({
				user_id: req.user_decoded._id
			})

			const count = await WebAppModel.countDocuments({ user: req.user_decoded._id })

			// [LIMIT-CHECK] Tier 1 //
			if (count >= config_const.limit.webApp[0]) {
				if (
					!apiSubObj.apiSubscription.stripe.subId.tier1.active &&
					!apiSubObj.apiSubscription.stripe.subId.tier1.canceled &&
					!apiSubObj.apiSubscription.stripe.subId.tier2.active &&
					!apiSubObj.apiSubscription.stripe.subId.tier2.canceled
				) { flag = true }
			}

			// [LIMIT-CHECK] Tier 2 //
			if (count >= config_const.limit.webApp[1]) {
				if (
					!apiSubObj.apiSubscription.stripe.subId.tier2.active &&
					!apiSubObj.apiSubscription.stripe.subId.tier2.canceled
				) { flag = true }
			}

			// [LIMIT-CHECK] //
			if (count >= config_const.limit.webApp[2]) {
				flag = true
			}
			
			if (flag) {
				res.send({
					executed: true,
					status: false,
					location: location,
					message: 'Product limit reached for your subscription, Please upgrade or delete previous Products'
				})
			}
			else { next() }
		}
	},


	productLimitCheck: function () {
		return async (req, res, next) => {
			// [INIT] //
			let flag = false

			// [READ][ApiSubscription] //
			const apiSubObj = await ApiSubscriptionCollection.c_read_byUser({
				user_id: req.user_decoded._id
			})
			
			const pObj = await ProductCollection.c_count_byUser({
				user_id: req.user_decoded._id
			})

			// [LIMIT-CHECK] Tier 1 //
			if (pObj.count >= config_const.limit.product[0]) {
				if (
					!apiSubObj.apiSubscription.stripe.subId.tier1.active &&
					!apiSubObj.apiSubscription.stripe.subId.tier1.canceled &&
					!apiSubObj.apiSubscription.stripe.subId.tier2.active &&
					!apiSubObj.apiSubscription.stripe.subId.tier2.canceled
				) { flag = true }
			}

			// [LIMIT-CHECK] Tier 2 //
			if (pObj.count >= config_const.limit.product[1]) {
				if (
					!apiSubObj.apiSubscription.stripe.subId.tier2.active &&
					!apiSubObj.apiSubscription.stripe.subId.tier2.canceled
				) { flag = true }
			}

			// [LIMIT-CHECK] //
			if (pObj.count >= config_const.limit.product[2]) {
				flag = true
			}
			
			if (flag) {
				res.send({
					executed: true,
					status: false,
					location: location,
					message: 'Product limit reached for your subscription, Please upgrade or delete previous Products'
				})
			}
			else { next() }
		}
	},


	productOptionLimitCheck: function () {
		return async (req, res, next) => {
			// [INIT] //
			let flag = false

			// [READ][ApiSubscription] //
			const apiSubObj = await ApiSubscriptionCollection.c_read_byUser({
				user_id: req.user_decoded._id
			})
			
			const pObj = await ProductCollection.c_count_byUser({
				user_id: req.user_decoded._id
			})

			// [LIMIT-CHECK] Tier 1 //
			if (pObj.count >= pObj.count >= config_const.limit.productOptions[0]) {
				if (
					!apiSubObj.apiSubscription.stripe.subId.tier1.active &&
					!apiSubObj.apiSubscription.stripe.subId.tier1.canceled &&
					!apiSubObj.apiSubscription.stripe.subId.tier2.active &&
					!apiSubObj.apiSubscription.stripe.subId.tier2.canceled
				) { flag = true }
			}

			// [LIMIT-CHECK] Tier 2 //
			if (pObj.count >= pObj.count >= config_const.limit.productOptions[1]) {
				if (
					!apiSubObj.apiSubscription.stripe.subId.tier2.active &&
					!apiSubObj.apiSubscription.stripe.subId.tier2.canceled
				) { flag = true }
			}

			// [LIMIT-CHECK] //
			if (pObj.count >= pObj.count >= config_const.limit.productOptions[2]) {
				flag = true
			}
			
			if (flag) {
				res.send({
					executed: true,
					status: false,
					location: location,
					message: 'Product Options limit reached for your subscription, Please upgrade or delete previous Products Options'
				})
			}
			else { next() }
		}
	},
}