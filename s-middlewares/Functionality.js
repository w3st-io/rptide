// [REQUIRE]
const config = require('../s-config')


// [INIT]
const location = '/s-middleware/Functionality'


module.exports = {
	admin: function () {
		return (req, res, next) => {
			if (config.functionality.admin === 'true') { next() }
			else {
				res.send({
					executed: true,
					status: false,
					location: location,
					message: 'Admin functionality is disabled',
				})
			}
		}
	},

	blogPosts: function () {
		return (req, res, next) => {
			if (config.functionality.blogPost === 'true') { next() }
			else {
				res.send({
					executed: true,
					status: false,
					location: location,
					message: 'Blog Posting is disabled',
				})
			}
		}
	},

	comments: function () {
		return (req, res, next) => {
			if (config.functionality.comment === 'true') { next() }
			else {
				res.send({
					executed: true,
					status: false,
					location: location,
					message: 'Commenting is disabled',
				})
			}
		}
	},

	user: function () {
		return (req, res, next) => {
			if (config.functionality.user === 'true') { next() }
			else {
				res.send({
					executed: true,
					status: false,
					location: location,
					message: 'User related functionlaity is disabled',
				})
			}
		}
	},

	payments: function () {
		return (req, res, next) => {
			if (config.functionality.payment === 'true') { next() }
			else {
				res.send({
					executed: true,
					status: false,
					location: location,
					message: 'Payments are disabled',
				})
			}
		}
	},

	posts: function () {
		return (req, res, next) => {
			if (config.functionality.post === 'true') { next() }
			else {
				res.send({
					executed: true,
					status: false,
					location: location,
					message: 'Posting is disabled',
				})
			}
		}
	},
}
