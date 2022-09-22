// [REQUIRE]
const config = require("../s-config");


// [INIT]
let returnObj = {
	executed: true,
	status: false,
	location: "/s-middleware/Functionality",
};

module.exports = {
	user: function () {
		return (req, res, next) => {
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
		return (req, res, next) => {
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
