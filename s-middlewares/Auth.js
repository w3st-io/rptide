// [REQUIRE] //
const jwt = require('jsonwebtoken')
const validator = require('validator')


// [REQUIRE] Personal //
const config = require('../s-config')
const UserCollection = require('../s-collections/UserCollection')
const h_apiSubscription = require('../s-route/api/user/api-subscription.handler')


// [INIT] //
const secretKey = config.app.secretKey


class Auth {
	/******************* [USER] *******************/
	// [Standard] //
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

								// Check verified //
								const verified = await UserCollection.c_verifiedStatus(
									decoded._id
								)

								if (verified.status) {
									// Check apiSubscription status //
									await h_apiSubscription.cycleCheckApiSubscription({
										user_id: decoded._id
									})
									
									next()
								}
								else { res.send(verified) }
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


	// [IF-LOGGED] NOT required //
	static userTokenNotRequired() {
		return async (req, res, next) => {
			if (req.headers.user_authorization) {
				// [SLICE] "Bearer " //
				const tokenBody = req.headers.user_authorization.slice(7)

				// If a token exists => Validate JWT //
				if (tokenBody !== 'undefined') {
					try {
						const decoded = await jwt.verify(tokenBody, secretKey)
						
						// [INIT] Put decoded in req //
						req.user_decoded = decoded
					}
					catch (err) {
						console.log('JWT Verify:', err)

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


	// [LIMITED] Verification NOT required //
	static userTokenByPassVerification() {
		return (req, res, next) => {
			// If a token exists => Validate JWT //
			if (req.headers.user_authorization) {
				// [SLICE] "Bearer " //
				const tokenBody = req.headers.user_authorization.slice(7)

				if (validator.isJWT(tokenBody)) {
					// [VERIFY] tokenBody //
					jwt.verify(tokenBody, secretKey, async (err, decoded) => {
						if (decoded) {
							// [INIT] Put decoded in req //
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


	// [API-PRIVATE-KEY] //
	static userTokenOrAPIPrivateKey() {
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

								// Check verified //
								const verified = await UserCollection.c_verifiedStatus(
									decoded._id
								)

								if (verified.status) {
									// Check apiSubscription status //
									await h_apiSubscription.cycleCheckApiSubscription({
										user_id: decoded._id
									})
									
									next()
								}
								else { res.send(verified) }
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
			// API Private Key
			else if (req.headers.authorization) {
				// [SLICE] "Bearer " //
				const tokenBody = req.headers.authorization.slice(7)

				const uObj = await UserCollection.c_read_byApiPrivateKey({
					privateKey: tokenBody
				})

				if (uObj.status) {
					// [INIT] Put decoded in req //
					const decoded = {
						_id: uObj.user._id,
						first_name: uObj.user.first_name,
						last_name: uObj.user.last_name,
						username: uObj.user.username,
						email: uObj.user.email
					}
	
					req.user_decoded = decoded
	
					next()
				}
				else { res.send(uObj) }
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
