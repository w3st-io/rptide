// [REQUIRE]
const bcrypt = require('bcryptjs');
const validator = require('validator');
const uuid = require('uuid')


// [REQUIRE] Personal
const UserModel = require('../../../s-models/UserModel');


// [INIT]
let returnObj = {
	executed: true,
	status: false,
	location: '/api/user',
	message: ''
};


module.exports = {
	/**
	 * @notice Update User profile image and bio
	 * @param {string} req.body.img_url
	 * @param {string} req.body.bio
	 * @returns {object} Updated user
	*/
	update: async ({ req }) => {
		let _returnObj = {
			...returnObj,
			location: returnObj.location + '/update',
			message: 'Updated profile'
		};

		try {
			// [VALIDATE]
			if (!validator.isAscii(req.body.img_url)) {
				return {
					..._returnObj,
					message: 'Invalid params',
				};
			}

			// [VALIDATE] bio
			if (
				req.body.bio.includes('<script') ||
				req.body.bio.includes('</script>')
			) {
				return {
					..._returnObj,
					message: 'XSS not allowed'
				};
			}
			
			const updatedUser = await UserModel.findOneAndUpdate(
				{ _id: req.user_decoded._id },
				{
					$set: {
						profile_img: req.body.img_url,
						bio: req.body.bio,
					}
				}
			).select('-password -api.publicKey -verified').exec();
	
			return {
				..._returnObj,
				status: true,
				updatedUser: updatedUser
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`,
			};
		}
	},

	/**
	 * @notice Update user.workspace.webApp
	 * @param {string} req.body.webApp webApp to be updated too
	*/
	update_workspaceWebApp: async ({ req }) => {
		let _returnObj = {
			...returnObj,
			message: 'Updated workspace',
			location: returnObj.location + '/update/workspace-web-app',
		};

		try {
			// [UPDATE] Password for User
			const user = await UserModel.findOneAndUpdate(
				{ _id: req.user_decoded._id },
				{
					$set: {
						"workspace.webApp": req.body.webApp
					}
				},
				{ returnOriginal: false }
			);

			if (!user) {
				return {
					..._returnObj,
					message: 'No user found'
				};
			}

			return {
				..._returnObj,
				status: true,
				user
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`
			};
		}
	},


	/**
	 * @notice Update user.password
	 * @param {string} req.body.currentPassword Old password
	 * @param {string} req.body.password New password
	*/
	update_password: async ({ req }) => {
		// [INIT]
		let _returnObj = {
			...returnObj,
			message: 'Updated password',
			location: returnObj.location + '/update/password',
		};

		try {
			if (
				!validator.isAscii(req.body.currentPassword) ||
				!validator.isAscii(req.body.password)
			) {
				return {
					..._returnObj,
					message: 'Invalid params',
				};
			}

			// [MONGODB][FIND] user
			const query = await UserModel.findOne({ _id: req.user_decoded._id });

			// [VALIDATE-PASSWORD]
			if (!bcrypt.compareSync(req.body.currentPassword, query.password)) {
				return {
					..._returnObj,
					message: 'Invalid password',
				};
			}

			// [MONGODB][UPDATE] user.password
			await UserModel.findOneAndUpdate(
				{ _id: req.user_decoded._id },
				{
					$set: {
						password: await bcrypt.hash(req.body.password, 10)
					}
				}
			);

			return {
				..._returnObj,
				status: true,
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`
			};
		}
	},


	/**
	 * 
	 * @notice Find user and generate a new API key
	 * @returns {Object} containing the new API Key
	*/
	generateApiKey: async ({ req }) => {
		// [INIT]
		let _returnObj = {
			...returnObj,
			message: 'Generated new API key',
			location: returnObj.location + '/generate-api-key'
		};
		
		try {
			// [UPDATE] Generate new API Key
			const updatedUser = await UserModel.findOneAndUpdate(
				{ _id: req.user_decoded._id },
				{
					$set: {
						api: {
							publicKey: uuid.v4(),
							privateKey: uuid.v4(),
						}
					}
				},
				{ new: true }
			);
	
			return {
				..._returnObj,
				status: true,
				privateKey: updatedUser.api.privateKey
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`
			};
		}
	},

	"/stripe-payment-method": async ({ req }) => {
		// [INIT]
		let _returnObj = {
			...returnObj,
			location: returnObj.location + "/payment-method/update",
			message: "Payment Method retrieved",
			paymentMethod: {
				card: {
					brand: "",
					last4: "",
					exp_month: null,
					exp_year: null
				}
			}
		};

		try {
			// [READ][ApiSubscription]
			const user = await UserModel.findOne({
				user: req.user_decoded._id
			});

			// [API][stripe] Retrieve payment method details if it exists
			if (user.stripe.pmId) {
				_returnObj.paymentMethod = await Stripe.paymentMethods.retrieve(
					user.stripe.pmId
				);
			}

			// [200] Success
			return {
				..._returnObj,
				status: true
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`
			};
		}
	},

	"/update/stripe-payment-method": async ({ req }) => {
		// [INIT]
		let _returnObj = {
			...returnObj,
			location: returnObj.location + "/payment-method/update",
			message: "Payment Method successfully changed"
		};

		try {
			// [VALIDATE]
			if (
				!validator.isAscii(req.body.cardNumber) ||
				!validator.isAscii(req.body.cardMonth) ||
				!validator.isAscii(req.body.cardYear) ||
				!validator.isAscii(req.body.cardCvc)
			) {
				return {
					..._returnObj,
					message: "Invalid parameters"
				};
			}

			// [MONGODB][READ][User]
			const user = await UserModel.findOne({
				user: req.user_decoded._id
			});

			// [API][stripe] Remove previous payment method
			if (user.stripe.pmId !== "") {
				await Stripe.paymentMethods.detach(user.stripe.pmId);
			}

			// [API][stripe] Create a paymentMethod
			const stripeCreatedPaymentMethod = await Stripe.paymentMethods.create({
				type: "card",
				card: {
					number: req.body.cardNumber,
					exp_month: req.body.cardMonth,
					exp_year: req.body.cardYear,
					cvc: req.body.cardCvc,
				},
			});

			// [API][stripe] connect the customer to the paymentMethod
			await Stripe.paymentMethods.attach(
				stripeCreatedPaymentMethod.id,
				{ customer: user.stripe.cusId }
			);

			// [API][stripe] Set default_payment_method
			await Stripe.customers.update(
				user.stripe.cusId,
				{
					invoice_settings: {
						default_payment_method: stripeCreatedPaymentMethod.id,
					}
				}
			);

			// [MONGODB][UPDATE][User] update pmId
			await UserModel.updateOne(
				{ user: req.user_decoded._id },
				{
					$set: {
						"stripe.pmId": stripeCreatedPaymentMethod.id
					}
				},
			);

			// [200] Success
			return {
				..._returnObj,
				status: true,
				card: stripeCreatedPaymentMethod.card
			};
		}
		catch (err) {
			return {
				..._returnObj,
				executed: false,
				message: `${err}`
			};
		}
	},
}