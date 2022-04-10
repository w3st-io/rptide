// [REQUIRE] //
const cors = require('cors')
const express = require('express')
const validator = require('validator')


// [REQUIRE] Personal //
const ApiSubscriptionCollection = require('../../../s-collections/ApiSubscriptionCollection')
const h_apiSub = require('../../../s-route-handler/apiSubscription')
const h_apiSub_paymentMethod = require('../../../s-route-handler/apiSubscription/paymentMethod')
const h_apiSub_tierSwitcher = require('../../../s-route-handler/apiSubscription/tierSwitcher')
const Auth = require('../../../s-middlewares/Auth')


// [EXPRESS + USE] //
const router = express.Router().use(cors())


// [INIT] //
const location = '/s-routes/api/user/api-subscription'


router.post(
	'/update-pm',
	Auth.userToken(),
	async (req, res) => {
		try {
			if (
				validator.isAscii(req.body.cardNumber) &&
				validator.isAscii(req.body.cardMonth) &&
				validator.isAscii(req.body.cardYear) &&
				validator.isAscii(req.body.cardCvc)
			) {
				// [READ][ApiSubscription] Get by User //
				const apiSubObj = await ApiSubscriptionCollection.c_read_byUser({
					user_id: req.user_decoded.user_id
				})

				// [H][apiSub_paymentMethod][UPDATE] //
				const upmObj = await h_apiSub_paymentMethod.updatePaymentMethod({
					user_id: req.user_decoded.user_id,
					apiSubscription_id: apiSubObj.apiSubscription._id,
					cusId: apiSubObj.apiSubscription.stripe.cusId,
					previous_pmId: apiSubObj.apiSubscription.stripe.pmId,
					cardNumber: req.body.cardNumber,
					cardMonth: req.body.cardMonth,
					cardYear: req.body.cardYear,
					cardCvc: req.body.cardCvc
				})

				if (upmObj.status) {
					// [SUCCESS] //
					res.send({
						executed: true,
						status: true,
						message: 'Payment Method successfully changed'
					})
				}
				else { res.send(upmObj) }
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: location,
					message: 'Invalid parameters',
				})
			}
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: `${location}/update-pm`,
				message: `${location}/update-pm: Error --> ${err}`
			})
		}
	}
)


router.post(
	'/delete-pm',
	Auth.userToken(),
	async (req, res) => {
		try {
			// [READ][ApiSubscription] Get by User //
			const apiSubObj = await ApiSubscriptionCollection.c_read_byUser({
				user_id: req.user_decoded.user_id
			})

			const dpmObj = await h_apiSub_paymentMethod.deletePaymentMethod({
				user_id: req.user_decoded.user_id,
				apiSubscription_id: apiSubObj.apiSubscription._id,
				pmId: apiSubObj.apiSubscription.stripe.pmId
			})

			if (dpmObj.status) {
				// [SUCCESS] //
				res.send({
					executed: true,
					status: true,
					message: 'Payment Method successfully deleted'
				})
			}
			else { res.send(dpmObj) }
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: `${location}/delete-pm`,
				message: `${location}/delete-pm: Error --> ${err}`
			})
		}
	}
)


router.post(
	'/update-tier-0',
	Auth.userToken(),
	async (req, res) => {
		try {
			// [H][apiSubscription] Force update 
			await h_apiSub.cycleCheckApiSubscription({
				user_id: req.user_decoded.user_id,
				force: true,
			})

			// [C][READ][ApiSubscription] Retrieve associated apiSubscription obj //
			const apiSubObj = await ApiSubscriptionCollection.c_read_byUser({
				user_id: req.user_decoded.user_id
			})

			if (apiSubObj.status) {
				let currentTier = 0

				if (apiSubObj.apiSubscription.stripe.subId.tier1.active) {
					currentTier = 1
				}

				if (apiSubObj.apiSubscription.stripe.subId.tier1.canceled) {
					currentTier = 1
				}

				if (apiSubObj.apiSubscription.stripe.subId.tier2.active) {
					currentTier = 2
				}

				if (apiSubObj.apiSubscription.stripe.subId.tier2.canceled) {
					currentTier = 2
				}

				// Current Tier //
				switch (currentTier) {
					// Previous Tier 1 //
					case 1:
						const switchTier0FromTier1Obj = await h_apiSub_tierSwitcher.h_switchTier0FromTier1({
							user_id: req.user_decoded.user_id,
							apiSubscription_id: apiSubObj.apiSubscription._id,
							tier1_active: apiSubObj.apiSubscription.stripe.subId.tier1.active
						})
						
						res.send(switchTier0FromTier1Obj)
					break
					
					// Previous Tier 2 //
					case 2:
						const switchTier0FromTier2Obj = await h_apiSub_tierSwitcher.h_switchTier0FromTier2({
							user_id: req.user_decoded.user_id,
							apiSubscription_id: apiSubObj.apiSubscription._id,
							tier2_active: apiSubObj.apiSubscription.stripe.subId.tier2.active
						})

						res.send(switchTier0FromTier2Obj)
					break

					default:
						// [ERROR] //
						res.send({
							executed: true,
							status: false,
							message: 'Something went wrong'
						})
					break
				}
			}
			else { res.send(apiSubObj) }
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: `${location}/update-tier-0`,
				message: `${location}/update-tier-0: Error --> ${err}`
			})
		}
	}
)


router.post(
	'/update-tier-1',
	Auth.userToken(),
	async (req, res) => {
		try {
			// [H][apiSubscription] Force update 
			await h_apiSub.cycleCheckApiSubscription({
				user_id: req.user_decoded.user_id,
				force: true,
			})
			
			// [READ][ApiSubscription] Retrieve associated subscription obj //
			const apiSubObj = await ApiSubscriptionCollection.c_read_byUser({
				user_id: req.user_decoded.user_id
			})

			if (apiSubObj.status) {
				if (apiSubObj.apiSubscription.stripe.pmId) {
					let currentTier = 0

					if (apiSubObj.apiSubscription.stripe.subId.tier1.active) {
						currentTier = 1
					}

					if (apiSubObj.apiSubscription.stripe.subId.tier1.canceled) {
						currentTier = 1
					}

					if (apiSubObj.apiSubscription.stripe.subId.tier2.active) {
						currentTier = 2
					}

					if (apiSubObj.apiSubscription.stripe.subId.tier2.canceled) {
						currentTier = 2
					}

					// Current Tier //
					switch (currentTier) {
						// Previous Tier 0 //
						case 0:
							const tier1FromTier0Obj = await h_apiSub_tierSwitcher.h_switchTier1FromTier0({
								user_id: req.user_decoded.user_id,
								apiSubscription_id: apiSubObj.apiSubscription._id,
								cusId: apiSubObj.apiSubscription.stripe.cusId,
							})
							
							res.send(tier1FromTier0Obj)
						break

						// Previous Tier 2 //
						case 2:
							const tier1FromTier2Obj = await h_apiSub_tierSwitcher.h_switchTier1FromTier2({
								user_id: req.user_decoded.user_id,
								apiSubscription_id: apiSubObj.apiSubscription._id,
								cusId: apiSubObj.apiSubscription.stripe.cusId,
								tier2_active: apiSubObj.apiSubscription.stripe.subId.tier2.active,
							})

							res.send(tier1FromTier2Obj)
						break
					
						default:
							// [ERROR] //
							res.send({
								executed: true,
								status: false,
								message: 'Something went wrong'
							})
						break
					}
				}
				else {
					res.send({
						executed: true,
						status: false,
						message: 'Attach payment method before changing tier'
					})	
				}
			}
			else { res.send(apiSubObj) }
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: `${location}/update-tier-1`,
				message: `${location}/update-tier-1: Error --> ${err}`
			})
		}
	}
)


router.post(
	'/update-tier-2',
	Auth.userToken(),
	async (req, res) => {
		try {
			// [H][apiSubscription] Force update 
			await h_apiSub.cycleCheckApiSubscription({
				user_id: req.user_decoded.user_id,
				force: true,
			})

			// [READ][ApiSubscription] Retrieve associated subscription obj //
			const apiSubObj = await ApiSubscriptionCollection.c_read_byUser({
				user_id: req.user_decoded.user_id
			})

			if (apiSubObj.status) {
				if (apiSubObj.apiSubscription.stripe.pmId) {
					let currentTier = 0

					if (apiSubObj.apiSubscription.stripe.subId.tier1.active) {
						currentTier = 1
					}

					if (apiSubObj.apiSubscription.stripe.subId.tier1.canceled) {
						currentTier = 1
					}

					if (apiSubObj.apiSubscription.stripe.subId.tier2.active) {
						currentTier = 2
					}

					if (apiSubObj.apiSubscription.stripe.subId.tier2.canceled) {
						currentTier = 2
					}

					// Current Tier //
					switch (currentTier) {
						// Previous Tier 0 //
						case 0:
							const tier2FromTier0Obj = await h_apiSub_tierSwitcher.h_switchTier2FromTier0({
								user_id: req.user_decoded.user_id,
								apiSubscription_id: apiSubObj.apiSubscription._id,
								cusId: apiSubObj.apiSubscription.stripe.cusId,
							})
							
							res.send(tier2FromTier0Obj)
						break

						// Previous Tier 1 //
						case 1:
							const tier1FromTier2Obj = await h_apiSub_tierSwitcher.h_switchTier2FromTier1({
								user_id: req.user_decoded.user_id,
								apiSubscription_id: apiSubObj.apiSubscription._id,
								cusId: apiSubObj.apiSubscription.stripe.cusId,
								tier1_active: apiSubObj.apiSubscription.stripe.subId.tier1.active,
							})

							res.send(tier1FromTier2Obj)
						break
					
						default:
							// [ERROR] //
							res.send({
								executed: true,
								status: false,
								message: 'Something went wrong'
							})
						break
					}
				}
				else {
					res.send({
						executed: true,
						status: false,
						message: 'Attach payment method before changing tier'
					})	
				}
			}
			else { res.send(apiSubObj) }
		}
		catch (err) {
			res.send({
				executed: false,
				status: false,
				location: `${location}/update-tier-2`,
				message: `${location}/update-tier-2: Error --> ${err}`
			})
		}
	}
)


module.exports = router