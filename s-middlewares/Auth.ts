// [IMPORT]
import validator from "validator";


// [IMPORT] Personal
import config from '../s-config';
import UserModel from '../s-models/User.model';


// [REQUIRE]
const jwt = require('jsonwebtoken');


// [INIT] Const
const secretKey = config.app.secretKey;


// [INIT]
let returnObj: any = {
	executed: true,
	status: false,
	message: "",
	location: '/s-middlewares/Auth'
};


class Auth {
	// [Standard]
	static userToken() {
		return async (req, res, next) => {
			// [INIT]
			let _returnObj: any = {
				...returnObj,
				auth: false,
			};

			// If a token exists --> Validate JWT //
			if (req.headers.user_authorization) {
				// [SLICE] "Bearer " //
				const tokenBody = req.headers.user_authorization.slice(7);

				if (validator.isJWT(tokenBody)) {
					// [VERIFY] tokenBody
					jwt.verify(tokenBody, secretKey, async (err, decoded) => {
						if (decoded) {
							// [INIT] Put decoded in req //
							req.user_decoded = decoded;

							// [MONGODB] Check verified
							const user = await UserModel.findOne({
								_id: decoded._id,
								verified: true,
							});

							if (user) {
								req.user_decoded.workspace = user.workspace;
								
								next();
							}
							else {
								res.send({
									..._returnObj,
									message: 'User NOT verified',
								});
							}
						}
						else {
							res.send({
								..._returnObj,
								message: `Access denied: JWT Error --> ${err}`,
							});
						}
					});
				}
				else {
					res.send({
						..._returnObj,
						message: 'Access denied: Not valid JWT',
					});
				}
			}
			else {
				res.send({
					..._returnObj,
					message: 'Access denied: No token passed',
				});
			}
		}
	}


	// [IF-LOGGED] NOT required
	static userTokenNotRequired() {
		return async (req, res, next) => {
			if (req.headers.user_authorization) {
				// [SLICE] "Bearer "
				const tokenBody = req.headers.user_authorization.slice(7);

				// If a token exists --> Validate JWT
				if (tokenBody !== 'undefined') {
					const decoded = await jwt.verify(tokenBody, secretKey);
					
					// [INIT] Put decoded in req
					req.user_decoded = decoded;
				}
			}
			
			// Since token is not required, go next
			next();
		}
	}


	// [LIMITED] Verification NOT required
	static userTokenByPassVerification() {
		return (req, res, next) => {
			// [INIT]
			let _returnObj: any = {
				...returnObj,
				auth: false,
			};

			// If a token exists --> Validate JWT
			if (req.headers.user_authorization) {
				// [SLICE] "Bearer "
				const tokenBody = req.headers.user_authorization.slice(7);

				if (validator.isJWT(tokenBody)) {
					// [VERIFY] tokenBody
					jwt.verify(tokenBody, secretKey, async (err, decoded) => {
						if (decoded) {
							// [INIT] Put decoded in req
							req.user_decoded = decoded;

							next();
						}
						else {
							res.send({
								..._returnObj,
								message: `Access denied: JWT Error --> ${err}`,
							});
						}
					})
				}
				else {
					res.send({
						..._returnObj,
						message: 'Access denied: Not valid JWT',
					});
				}
			}
			else {
				res.send({
					..._returnObj,
					message: 'Access denied: No token passed',
				});
			}
		}
	}


	// [API-PRIVATE-KEY]
	static userTokenOrAPIPrivateKey() {
		// [INIT]
		let _returnObj: any = {
			...returnObj,
			auth: false,
		};

		return async (req, res, next) => {
			// If a token exists --> Validate JWT
			if (req.headers.user_authorization) {
				// [SLICE] "Bearer "
				const tokenBody = req.headers.user_authorization.slice(7)

				if (validator.isJWT(tokenBody)) {
					// [VERIFY] tokenBody
					jwt.verify(tokenBody, secretKey, async (err, decoded) => {
						if (decoded) {
							// [INIT] Put decoded in req
							req.user_decoded = decoded;

							// [MONGODB] Check verified
							const user = await UserModel.findOne({
								_id: decoded._id,
								verified: true,
							});

							if (user) {
								next();
							}
							else {
								res.send({
									..._returnObj,
									message: 'User NOT verified',
								});
							}
						}
						else {
							res.send({
								..._returnObj,
								message: `Access denied: JWT Error --> ${err}`,
							});
						}
					});
				}
				else {
					res.send({
						..._returnObj,
						message: 'Access denied: Not valid JWT',
					});
				}
			}
			// API Private Key
			else if (req.headers.authorization) {
				// [MONGODB][READ] Everything after "Bearer "
				const user = await UserModel.findOne({
					"api.privateKey": req.headers.authorization.slice(7)
				});

				if (user) {
					// [INIT] Put decoded in req
					const decoded = {
						_id: user._id,
						email: user.email
					};
	
					req.user_decoded = decoded;
	
					next();
				}
				else {
					res.send({
						..._returnObj,
						message: "Invalid API privateKey"
					});
				}
			}
			else {
				res.send({
					..._returnObj,
					message: 'Access denied: No token passed',
				})
			}
		}
	}
}


module.exports = Auth;
