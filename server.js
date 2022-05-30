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
const a_socket = require('./s-route/api/socket')
const a_user = require('./s-route/api/user')
const a_user_apiSubscription = require('./s-route/api/user/api-subscription')
const a_user_product = require('./s-route/api/user/product')
const a_user_productOption = require('./s-route/api/user/product-option')
const a_user_webApp = require('./s-route/api/user/web-app')
const a_user_webContent = require('./s-route/api/user/web-content')

const p_ = require ('./s-route/pages')
const p_product_read = require('./s-route/pages/product/read')
const p_user = require('./s-route/pages/user')
const p_user_dashboard = require('./s-route/pages/user/dashboard')
const p_user_profile = require('./s-route/pages/user/profile')
const p_user_profile_edit = require('./s-route/pages/user/profile/edit')


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
app.use('/api/socket', a_socket)
app.use('/api/user', Functionality.user(), a_user)
app.use('/api/user/api-subscription', a_user_apiSubscription)
app.use('/api/user/product', Functionality.user(), a_user_product)
app.use('/api/user/product-option', Functionality.user(), a_user_productOption)
app.use('/api/user/web-app', a_user_webApp)
app.use('/api/user/web-content', a_user_webContent)


// [USE][ROUTE][PAGES] //
app.use('/pages', p_)
app.use('/pages/product/read', p_product_read)
app.use('/pages/user', p_user)
app.use('/pages/user/dashboard', p_user_dashboard)
app.use('/pages/user/profile', p_user_profile)
app.use('/pages/user/profile/edit', p_user_profile_edit)


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