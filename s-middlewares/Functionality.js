// [REQUIRE]
const config = require("../s-config");


// [INIT]
const location = "/s-middleware/Functionality";


module.exports = {
	user: function () {
		return (req, res, next) => {
			if (config.functionality.user === "true") {
				next();
			}
			else {
				res.send({
					executed: true,
					status: false,
					location: location,
					message: "User related functionlaity is disabled",
				});
			}
		}
	}
}
