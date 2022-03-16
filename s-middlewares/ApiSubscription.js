// [REQUIRE] //
const BlogPostCollection = require('../s-collections/BlogPostCollection')
const SectionTextCollection = require('../s-collections/SectionTextCollection')
const ProductCollection = require('../s-collections/ProductCollection')
const ApiSubscriptionCollection = require('../s-collections/ApiSubscriptionCollection')
const config_const = require('../s-config/const')


// [INIT] //
const location = '/s-middleware/Subscription'


module.exports = {
	blogPostLimitCheck: function () {
		return async (req, res, next) => {
			// [INIT] //
			let flag = false

			// [READ][ApiSubscription] //
			const apiSubObj = await ApiSubscriptionCollection.c_read_byUser({
				user_id: req.user_decoded.user_id
			})
			
			// [COUNT][BlogPost] //
			const bPObj = await BlogPostCollection.c_count_byUser({
				user_id: req.user_decoded.user_id
			})

			// [LIMIT-CHECK] Tier 1 //
			if (bPObj.count >= config_const.limit.blogPost[0]) {
				if (
					!apiSubObj.apiSubscription.stripe.subId.tier1.active &&
					!apiSubObj.apiSubscription.stripe.subId.tier1.canceled &&
					!apiSubObj.apiSubscription.stripe.subId.tier2.active &&
					!apiSubObj.apiSubscription.stripe.subId.tier2.canceled
				) { flag = true }
			}

			// [LIMIT-CHECK] Tier 2 //
			if (bPObj.count >= config_const.limit.blogPost[1]) {
				if (
					!apiSubObj.apiSubscription.stripe.subId.tier2.active &&
					!apiSubObj.apiSubscription.stripe.subId.tier2.canceled
				) { flag = true }
			}

			// [LIMIT-CHECK] //
			if (bPObj.count >= config_const.limit.blogPost[2]) {
				flag = true
			}
			
			if (flag) {
				res.send({
					executed: true,
					status: false,
					location: location,
					message: 'Blog Posts limit reached for your subscription, Please upgrade or delete previous Blog Posts'
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
				user_id: req.user_decoded.user_id
			})
			
			const pObj = await ProductCollection.c_count_byUser({
				user_id: req.user_decoded.user_id
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
				user_id: req.user_decoded.user_id
			})
			
			const pObj = await ProductCollection.c_count_byUser({
				user_id: req.user_decoded.user_id
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


	sectionTextLimitCheck: function () {
		return async (req, res, next) => {
			// [INIT] //
			let flag = false

			// [READ][ApiSubscription] //
			const apiSubObj = await ApiSubscriptionCollection.c_read_byUser({
				user_id: req.user_decoded.user_id
			})
			
			// [COUNT][SectionText] //
			const STObj = await SectionTextCollection.c_count_byUser({
				user_id: req.user_decoded.user_id
			})

			// [LIMIT-CHECK] Tier 1 //
			if (STObj.count >= config_const.limit.blogPost[0]) {
				if (
					!apiSubObj.apiSubscription.stripe.subId.tier1.active &&
					!apiSubObj.apiSubscription.stripe.subId.tier1.canceled &&
					!apiSubObj.apiSubscription.stripe.subId.tier2.active &&
					!apiSubObj.apiSubscription.stripe.subId.tier2.canceled
				) { flag = true }
			}

			// [LIMIT-CHECK] Tier 2 //
			if (STObj.count >= config_const.limit.blogPost[1]) {
				if (
					!apiSubObj.apiSubscription.stripe.subId.tier2.active &&
					!apiSubObj.apiSubscription.stripe.subId.tier2.canceled
				) { flag = true }
			}

			// [LIMIT-CHECK] //
			if (STObj.count >= config_const.limit.blogPost[2]) {
				flag = true
			}
			
			if (flag) {
				res.send({
					executed: true,
					status: false,
					location: location,
					message: 'Section Text limit reached for your subscription, Please upgrade or delete previous Section Texts'
				})
			}
			else { next() }
		}
	},
}