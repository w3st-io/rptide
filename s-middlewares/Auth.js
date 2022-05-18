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
				// [INIT] //
				const token = req.headers.user_authorization	
				
				// [SLICE] "Bearer " //
				const tokenBody = token.slice(7)

				if (validator.isJWT(tokenBody)) {
					// [VERIFY] tokenBody //
					jwt.verify(tokenBody, secretKey, async (err, decoded) => {
						try {
							if (decoded) {
								// [INIT] Put decoded in req //
								req.user_decoded = decoded

								// Check verified //
								const verified = await UserCollection.c_verifiedStatus(
									decoded.user_id
								)

								if (verified.status) {
									// Check apiSubscription status //
									await h_apiSubscription.cycleCheckApiSubscription({
										user_id: decoded.user_id
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
			// [INIT] //
			const token = req.headers.user_authorization

			if (token) {
				// [SLICE] "Bearer " //
				const tokenBody = token.slice(7)

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
			// [INIT] //
			const token = req.headers.user_authorization	
			
			// If a token exists => Validate JWT //
			if (token) {
				// [SLICE] "Bearer " //
				const tokenBody = token.slice(7)

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
				// [INIT] //
				const token = req.headers.user_authorization	
				
				// [SLICE] "Bearer " //
				const tokenBody = token.slice(7)

				if (validator.isJWT(tokenBody)) {
					// [VERIFY] tokenBody //
					jwt.verify(tokenBody, secretKey, async (err, decoded) => {
						try {
							if (decoded) {
								// [INIT] Put decoded in req //
								req.user_decoded = decoded

								// Check verified //
								const verified = await UserCollection.c_verifiedStatus(
									decoded.user_id
								)

								if (verified.status) {
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
			else if (req.headers.authorization) {
				// [INIT] //
				const token = req.headers.authorization	

				// [SLICE] "Bearer " //
				const tokenBody = token.slice(7)

				const asObj = await UserCollection.c_read_byApiPrivateKey({
					privateKey: tokenBody
				})

				if (asObj.status) {
					// [INIT] Put decoded in req //
					const decoded = {
						user_id: asObj.user._id,
						first_name: asObj.user.first_name,
						last_name: asObj.user.last_name,
						username: asObj.user.username,
						email: asObj.user.email
					}
	
					req.user_decoded = decoded
	
					next()
				}
				else { res.send(asObj) }
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
