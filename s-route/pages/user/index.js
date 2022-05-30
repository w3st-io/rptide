// [REQUIRE] //
const cors = require('cors')
const express = require('express')


// [REQUIRE] Personal //
const api_stripe = require('../../../s-api/stripe')
const api_stripe_price = require('../../../s-api/stripe/price')
const UserCollection = require('../../../s-collections/UserCollection')
const ApiSubscriptionCollection = require('../../../s-collections/ApiSubscriptionCollection')
const Auth = require('../../../s-middlewares/Auth')
const config = require('../../../s-config')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


/******************* [USER PROFILE] *******************/
// [READ] Auth Required - user_decoded //
router.get(
	'/index',
	Auth.userTokenByPassVerification(),
	async (req, res) => {
		try {
			const userObj = await UserCollection.c_read_select({
				user_id: req.user_decoded.user_id,
				select: '-password -api.publicKey -api.privateKey'
			})
			
			if (userObj.status) {
				// [READ][ApiSubscription] //
				const apiSubscriptionObj = await ApiSubscriptionCollection.c_read_byUser({
					user_id: req.user_decoded.user_id
				})

				if (apiSubscriptionObj.status) {
					// [API][stripe] Retrieve payment method details if it exists //
					const pMObj = await api_stripe.aa_retrieve_ifExistant_paymentMethod({
						pmId: apiSubscriptionObj.apiSubscription.stripe.pmId
					})

					if (pMObj.status) {
						// [API][stripe] Retrieve payment method details if it exists //
						const tier1PriceObj = await api_stripe_price.a_retrieve({
							priceId: config.api.stripe.priceTier1
						})

						// [API][stripe] Retrieve payment method details if it exists //
						const tier2PriceObj = await api_stripe_price.a_retrieve({
							priceId: config.api.stripe.priceTier2

						})

						res.send({
							executed: true,
							status: true,
							user: userObj.user,
							paymentMethod: pMObj.paymentMethod,
							apiSubscriptionTier: apiSubscriptionObj.apiSubscription.tier,
							tier1Price: (tier1PriceObj.stripePrice.unit_amount / 100),
							tier2Price: (tier2PriceObj.stripePrice.unit_amount / 100),
						})
					}
					else { res.send(pMObj) }

				}
				else { res.send(apiSubscriptionObj) }
			}
			else { res.send(userObj) }
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: '/pages/user',
				message: `/pages/user: Error --> ${err}`
			})
		}
	}
)


module.exports = router