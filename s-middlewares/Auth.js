// [REQUIRE]
const jwt = require('jsonwebtoken');
const validator = require('validator');


// [REQUIRE] Personal
const UserCollection = require('../s-collections/UserCollection');
const config = require('../s-config');
const UserModel = require('../s-models/UserModel');
const h_apiSubscription = require('../s-route/api/user/api-subscription.handler');


// [INIT]
const secretKey = config.app.secretKey;


class Auth {
	/******************* [USER] *******************/
	// [Standard]
	static userToken() {
		return async (req, res, next) => {
			// If a token exists => Validate JWT //
			if (req.headers.user_authorization) {
				// [SLICE] "Bearer " //
				const tokenBody = req.headers.user_authorization.slice(7)

				if (validator.isJWT(tokenBody)) {
					// [VERIFY] tokenBody //
					jwt.verify(tokenBody, secretKey, async (err, decoded) => {
						try {
							if (decoded) {
								// [INIT] Put decoded in req //
								req.user_decoded = decoded

								// [MONGODB] Check verified
								const user = await UserModel.findOne({
									_id: decoded._id,
									verified: true,
								});

								if (user) {
									// Check apiSubscription status
									await h_apiSubscription.cycleCheckApiSubscription({
										user_id: decoded._id
									});
									
									next();
								}
								else {
									res.send({
										executed: true,
										status: false,
										message: 'User NOT verified',
									});
								}
							}
							else {
								res.send({
									executed: true,
									status: false,
									location: '/s-middlewares/Auth',
									message: `Access denied: JWT Error --> ${err}`,
									auth: false,
								})
							}
						}
						catch (err) {
							res.send({
								executed: false,
								status: false,
								location: '/s-middlewares/Auth',
								message: `Auth: Error --> ${err}`
							})
						}
					})
				}
				else {
					res.send({
						executed: true,
						status: false,
						location: '/s-middlewares/Auth',
						message: 'Access denied: Not valid JWT',
						auth: false,
					})
				}
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/s-middlewares/Auth',
					message: 'Access denied: No token passed',
					auth: false,
				})
			}
		}
	}


	// [IF-LOGGED] NOT required
	static userTokenNotRequired() {
		return async (req, res, next) => {
			if (req.headers.user_authorization) {
				// [SLICE] "Bearer "
				const tokenBody = req.headers.user_authorization.slice(7)

				// If a token exists => Validate JWT
				if (tokenBody !== 'undefined') {
					try {
						const decoded = await jwt.verify(tokenBody, secretKey)
						
						// [INIT] Put decoded in req
						req.user_decoded = decoded
					}
					catch (err) {
						res.send({
							executed: true,
							status: false,
							message: err
						})
					}
				}
			}
			
			// Since token is not required move on anyways
			next()
		}
	}


	// [LIMITED] Verification NOT required
	static userTokenByPassVerification() {
		return (req, res, next) => {
			// If a token exists => Validate JWT
			if (req.headers.user_authorization) {
				// [SLICE] "Bearer "
				const tokenBody = req.headers.user_authorization.slice(7)

				if (validator.isJWT(tokenBody)) {
					// [VERIFY] tokenBody
					jwt.verify(tokenBody, secretKey, async (err, decoded) => {
						if (decoded) {
							// [INIT] Put decoded in req
							req.user_decoded = decoded

							try { next() }
							catch (err) {
								res.send({
									executed: false,
									status: false,
									location: '/s-middlewares/Auth',
									message: `Auth: Error --> ${err}`
								})
							}
						}
						else {
							res.send({
								executed: true,
								status: false,
								location: '/s-middlewares/Auth',
								message: `Access denied: JWT Error --> ${err}`,
								auth: false,
							})
						}
					})
				}
				else {
					res.send({
						executed: true,
						status: false,
						location: '/s-middlewares/Auth',
						message: 'Access denied: Not valid JWT',
						auth: false,
					})
				}
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/s-middlewares/Auth',
					message: 'Access denied: No token passed',
					auth: false,
				})
			}
		}
	}


	// [API-PRIVATE-KEY]
	static userTokenOrAPIPrivateKey() {
		return async (req, res, next) => {
			// If a token exists => Validate JWT
			if (req.headers.user_authorization) {
				// [SLICE] "Bearer "
				const tokenBody = req.headers.user_authorization.slice(7)

				if (validator.isJWT(tokenBody)) {
					// [VERIFY] tokenBody
					jwt.verify(tokenBody, secretKey, async (err, decoded) => {
						try {
							if (decoded) {
								// [INIT] Put decoded in req
								req.user_decoded = decoded;

								// [MONGODB] Check verified
								const user = await UserModel.findOne({
									_id: decoded._id,
									verified: true,
								});

								if (user) {
									// Check apiSubscription status
									await h_apiSubscription.cycleCheckApiSubscription({
										user_id: decoded._id
									});
									
									next();
								}
								else {
									res.send({
										executed: true,
										status: false,
										message: 'User NOT verified',
									});
								}
							}

							else {
								res.send({
									executed: true,
									status: false,
									location: '/s-middlewares/Auth',
									message: `Access denied: JWT Error --> ${err}`,
									auth: false,
								});
							}
						}
						catch (err) {
							res.send({
								executed: false,
								status: false,
								location: '/s-middlewares/Auth',
								message: `Auth: Error --> ${err}`
							});
						}
					});
				}
				else {
					res.send({
						executed: true,
						status: false,
						location: '/s-middlewares/Auth',
						message: 'Access denied: Not valid JWT',
						auth: false,
					});
				}
			}
			// API Private Key
			else if (req.headers.authorization) {
				// [SLICE] "Bearer "
				const tokenBody = req.headers.authorization.slice(7);				

				// [MONGODB][READ]
				const user = await UserModel.findOne({
					"api.privateKey": tokenBody
				});

				if (user) {
					// [INIT] Put decoded in req
					const decoded = {
						_id: user._id,
						first_name: user.first_name,
						last_name: user.last_name,
						username: user.username,
						email: user.email
					};
	
					req.user_decoded = decoded;
	
					next();
				}
				else {
					res.send({
						executed: true,
						status: false,
						message: "Invalid API privateKey"
					});
				}
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: '/s-middlewares/Auth',
					message: 'Access denied: No token passed',
					auth: false,
				})
			}
		}
	}
}


module.exports = Auth
