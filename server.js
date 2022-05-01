// [REQUIRE] //
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const http = require('http')
const mongoose = require('mongoose')
const path = require('path')
const socketIO = require('socket.io')

// [REQUIRE][OTHER][API][PAGES][PUBLIC-API] Personal //
const config = require('./s-config')
const Functionality = require('./s-middlewares/Functionality')
const rateLimiter = require('./s-rate-limiters')
const s_socket = require('./s-socket')

const a_ = require('./s-route/api')
const a_mail = require('./s-route/api/mail')
const a_user = require('./s-route/api/user')
const a_user_apiSubscription = require('./s-route/api/user/api-subscription')
const a_user_blogPost = require('./s-route/api/user/blog-post')
const a_user_comment = require('./s-route/api/user/comment')
const a_user_notification = require('./s-route/api/user/notification')
const a_user_post = require('./s-route/api/user/post')
const a_user_product = require('./s-route/api/user/product')
const a_user_productOption = require('./s-route/api/user/product-option')
const a_user_sectionText = require('./s-route/api/user/section-text')
const a_socket = require('./s-route/api/socket')
const a_user_webApp = require('./s-route/api/user/web-app')

const p_ = require ('./s-route/pages')
const p_admin = require('./s-route/pages/admin')
const p_admin_function_commentReports = require('./s-route/pages/admin/function/comment-reports')
const p_admin_function_comments = require('./s-route/pages/admin/function/comments')
const p_admin_function_posts = require('./s-route/pages/admin/function/posts')
const p_admin_function_users = require('./s-route/pages/admin/function/users')
const p_blogPost_read = require('./s-route/pages/blog-post/read')
const p_cat = require('./s-route/pages/cat')
const p_comment_create = require('./s-route/pages/comment/create')
const p_comment_edit = require('./s-route/pages/comment/edit')
const p_comment_reply = require('./s-route/pages/comment/reply')
const p_dashboard = require('./s-route/pages/dashboard')
const p_followed = require('./s-route/pages/followed')
const p_notification = require('./s-route/pages/notification')
const p_product_read = require('./s-route/pages/product/read')
const p_post = require('./s-route/pages/post')
const p_post_create = require('./s-route/pages/post/create')
const p_search = require('./s-route/pages/search')
const p_sectionText_read = require('./s-route/pages/section-text/read')
const p_user = require('./s-route/pages/user')
const p_user_profile = require('./s-route/pages/user/profile')
const p_user_profile_edit = require('./s-route/pages/user/profile/edit')
const p_user_profile_lookup = require('./s-route/pages/user/profile/lookup')

const pa_products = require('./s-route/public-api/products')


// [EXPRESS] //
const app = express()


// [SERVER] Upgrade app to server //
const server = http.createServer(app)


// [SOCKET.IO] //
const io = socketIO(
	server,
	{
		allowEIO3: true,
		cors: {
			origin: config.app.baseURL.client,
			methods: ['GET', 'POST'],
			allowedHeaders: ['my-custom-header'],
			credentials: true
		}
	}
)


// [SOCKET.IO] //
s_socket.start(io)


// [SET] //
app.set('socketio', io)


// [MONGOOSE-CONNECTION] //
mongoose.connect(
	config.app.mongoURI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		//useFindAndModify: false,
	},
	(err, connected) => {
		if (connected) { console.log('Mongoose Connected to DB') }
		else { console.log(`Mongoose Connection Error --> ${err}`) }
	}
)


// [USE] // Set static Folder // Rate-Limiter //
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static(__dirname + '/s-static'))
app.use(rateLimiter.global)


// [USE][ROUTE][API] //
app.use('/api', a_)
app.use('/api/mail', a_mail)
app.use('/api/user', Functionality.user(), a_user)
app.use('/api/user/api-subscription', a_user_apiSubscription)
app.use('/api/user/blog-post', Functionality.blogPosts(), a_user_blogPost)
app.use('/api/user/comment', Functionality.comments(), a_user_comment)
app.use('/api/user/notification', Functionality.user(), a_user_notification)
app.use('/api/user/post', Functionality.posts(), a_user_post)
app.use('/api/user/product', Functionality.user(), a_user_product)
app.use('/api/user/product-option', Functionality.user(), a_user_productOption)
app.use('/api/user/section-text', Functionality.blogPosts(), a_user_sectionText)
app.use('/api/user/web-app', a_user_webApp)
app.use('/api/socket', a_socket)


// [USE][ROUTE][PAGES] //
app.use('/pages', p_)
app.use('/pages/admin', p_admin)
app.use('/pages/admin/function/commentReports', p_admin_function_commentReports)
app.use('/pages/admin/function/comments', p_admin_function_comments)
app.use('/pages/admin/function/posts', p_admin_function_posts)
app.use('/pages/admin/function/users', p_admin_function_users)
app.use('/pages/blog-post/read', p_blogPost_read)
app.use('/pages/cat', p_cat)
app.use('/pages/comment/create', p_comment_create)
app.use('/pages/comment/edit', p_comment_edit)
app.use('/pages/comment/reply', p_comment_reply)
app.use('/pages/dashboard', p_dashboard)
app.use('/pages/followed', p_followed)
app.use('/pages/notification', p_notification)
app.use('/pages/product/read', p_product_read)
app.use('/pages/post', p_post)
app.use('/pages/post/create', p_post_create)
app.use('/pages/search', p_search)
app.use('/pages/section-text/read', p_sectionText_read)
app.use('/pages/user', p_user)
app.use('/pages/user/profile', p_user_profile)
app.use('/pages/user/profile/edit', p_user_profile_edit)
app.use('/pages/user/profile/lookup', p_user_profile_lookup)


// [USE][ROUTE][PUBLIC-API] //
app.use('/public-api/product', pa_products)


// [HEROKU] Set Static Folder for Heroku //
if (config.nodeENV == 'production') {
	app.use(express.static('client/dist'))

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
	})
}


// [LISTEN] //
server.listen(
	config.port,
	() => { console.log(`Server Running on Port: ${config.port}`) }
)