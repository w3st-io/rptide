// [IMPORT]
import express from "express";


// [IMPORT] Personal
import config from '../s-config';
import UserModel, { IUser } from '../s-models/User.model';


// [REQUIRE]
const jwt = require('jsonwebtoken');


// [INIT] Const
const secretKey = config.app.secretKey;


// [INIT]
let returnObj: any = {
	executed: true,
	status: false,
	message: "",
	location: '/s-middleware/Auth',
	auth: false
};


class Auth {
	// [Standard]
	static userToken() {
		return async (req: express.Request, res: express.Response, next: Function) => {
			// If a token exists --> Validate JWT //
			if (req.headers.user_authorization) {
				// [SLICE] "Bearer " //
				const tokenBody = req.headers.user_authorization.slice(7);

				// [VERIFY] tokenBody
				jwt.verify(tokenBody, secretKey, async (err, decoded) => {
					if (err) {
						res.send({
							...returnObj,
							message: `Access denied: JWT Error --> ${err}`,
						});
					}

					if (decoded) {
						// [INIT] Put decoded in req.body
						req.body = {
							...req.body,
							user_decoded: decoded,
						};

						// [MONGODB][findOne][User] Verification required
						const user = await UserModel.findOne({
							_id: decoded._id,
							verified: true,
						});
						
						if (user) {
							req.body.user_decoded.workspace = user.workspace;
							
							// [200] Success
							next();
						}
						else {
							res.send({
								...returnObj,
								message: 'User NOT verified',
							});
						}
					}
				});
			}
			else {
				res.send({
					...returnObj,
					message: 'Access denied: No token passed',
				});
			}
		}
	}


	// [Logged?]
	static userTokenNotRequired() {
		return async (req: express.Request, res: express.Response, next: Function) => {
			if (req.headers.user_authorization) {
				// [SLICE] "Bearer "
				const tokenBody = req.headers.user_authorization.slice(7);

				// [VERIFY] tokenBody
				jwt.verify(tokenBody, secretKey, async (err, decoded) => {
					if (decoded) {
						// [STORE] decoded in req.body
						req.body = {
							...req.body,
							user_decoded: decoded,
						}
						
						// [MONGODB][findOne][User]
						const user: IUser = await UserModel.findOne({
							_id: decoded._id,
							verified: true
						});
						
						if (user) {
							// Put workspace in req.body.user_decoded
							req.body.user_decoded.workspace = user.workspace;
						}
					}
				});
			}
			
			// Token is NOT required --> procceed
			next();
		}
	}


	// [logged~] Verification NOT required
	static userTokenByPassVerification() {
		return async (req: express.Request, res: express.Response, next: Function) => {
			// If a token exists --> Validate JWT //
			if (req.headers.user_authorization) {
				// [SLICE] "Bearer " //
				const tokenBody = req.headers.user_authorization.slice(7);

				// [VERIFY] tokenBody
				jwt.verify(tokenBody, secretKey, async (err, decoded) => {
					if (err) {
						res.send({
							...returnObj,
							message: `Access denied: JWT Error --> ${err}`,
						});
					}

					if (decoded) {
						// [INIT] Put decoded in req.body
						req.body = {
							...req.body,
							user_decoded: decoded,
						};

						// [MONGODB][findOne][User] Verification NOT required
						const user: IUser = await UserModel.findOne({
							_id: decoded._id
						});
						
						if (user) {
							req.body.user_decoded.workspace = user.workspace;
							
							// [200] Success
							next();
						}
						else {
							res.send({
								...returnObj,
								message: 'User not found',
							});
						}
					}
				});
			}
			else {
				res.send({
					...returnObj,
					message: 'Access denied: No token passed',
				});
			}
		}
	}


	// [Logged] || [api.privateKey]
	static userTokenOrAPIPrivateKey() {
		return async (req: express.Request, res: express.Response, next: Function) => {
			// If a token exists --> Validate JWT
			if (req.headers.user_authorization) {
				// [SLICE] "Bearer "
				const tokenBody = req.headers.user_authorization.slice(7)

				// [VERIFY] tokenBody
				jwt.verify(tokenBody, secretKey, async (err, decoded) => {
					if (err) {
						res.send({
							...returnObj,
							message: `Access denied: JWT Error --> ${err}`,
						});
					}

					if (decoded) {
						// [INIT] Put decoded in req.body
						req.body = {
							...req.body,
							user_decoded: decoded,
						};

						// [MONGODB][findOne][User] Verification required
						const user: IUser = await UserModel.findOne({
							_id: decoded._id,
							verified: true,
						});
						
						if (user) {
							req.body.user_decoded.workspace = user.workspace;
							
							// [200] Success
							next();
						}
						else {
							res.send({
								...returnObj,
								message: 'User NOT verified',
							});
						}
					}
				});
			}
			// API Private Key
			else if (req.headers.authorization) {
				// [MONGODB][READ] Everything after "Bearer "
				const user: IUser = await UserModel.findOne({
					"api.privateKey": req.headers.authorization.slice(7)
				});

				if (user) {
					// [INIT] Put decoded in req.body
					req.body = {
						...req.body,
						user_decoded: {
							_id: user._id,
							email: user.email,
							workspace: user.workspace
						}
					}
	
					next();
				}
				else {
					res.send({
						...returnObj,
						message: "Invalid API privateKey"
					});
				}
			}
			else {
				res.send({
					...returnObj,
					message: 'Access denied: No token passed',
				})
			}
		}
	}
}


// [EXPORT]
export default Auth;