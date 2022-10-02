// [IMPORT]
import express from 'express';

// [IMPORT] Personal
import config from '../s-config';


// [INIT]
let returnObj = {
	executed: true,
	status: false,
	location: "/s-middleware/Functionality",
};


export default {
	user: function () {
		return (req: express.Request, res: express.Response, next: Function) => {
			if (config.functionality.user === "true") {
				next();
			}
			else {
				res.send({
					...returnObj,
					message: "All user related functionalities are temporarily disabled",
				});
			}
		}
	},

	commerce: function () {
		return (req: express.Request, res: express.Response, next: Function) => {
			if (config.functionality.commerce === "true") {
				next();
			}
			else {
				res.send({
					...returnObj,
					message: "All commerce related functionalities are temporarily disabled",
				});
			}
		}
	},
}
