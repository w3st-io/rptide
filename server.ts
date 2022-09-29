// [IMPORT]
import bodyParser from 'body-parser'
import history from 'connect-history-api-fallback'
import cors from 'cors'
import express from 'express'
import http from 'http'
import path from 'path'

// [IMPORT] Personal
import config from './s-config'

// [REQUIRE]
const mongoose = require('mongoose');
const socketIO = require('socket.io');

// [REQUIRE][OTHER] Personal
const Functionality = require('./s-middlewares/Functionality');
const rateLimiter = require('./s-rate-limiters');
const socket = require('./s-socket');

// [REQUIRE][API] Personal
const route_api_ = require('./s-route/api');
const route_api_productOption = require('./s-route/api/product-option');
const route_api_product = require('./s-route/api/product');
const route_api_user = require('./s-route/api/user');
const route_api_webApp = require('./s-route/api/web-app');
const route_api_webContent = require('./s-route/api/web-content');


// [EXPRESS]
const app = express();


// [SERVER] Upgrade app to server
const server = http.createServer(app);


// [SOCKET.IO]
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
);


// [SOCKET.IO]
socket.start(io);


/**
 * @notice [SET][USE]
 * socketio
 * body-parser
 * cors
 * Express - static folder
 * Rate Limiter - Global
*/
app
	.set('socketio', io)
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({ extended: false }))
	.use(cors())
	.use(express.static(__dirname + '/s-static'))
	.use(rateLimiter.global)
	.use(history({
		rewrites: [
			{
				from: /^\/api*\/*$/,
				to: function(context) {
					return context.parsedUrl.path
				}
			}
		]
	}))  
;


/**
 * @notice [USE]
 * [ROUTE][API]
*/
app
	.use('/api', route_api_)
	.use('/api/user', Functionality.user(), route_api_user)
	.use('/api/product', Functionality.user(), route_api_product)
	.use('/api/product-option', Functionality.user(), route_api_productOption)
	.use('/api/web-app', route_api_webApp)
	.use('/api/web-content', route_api_webContent)
;


// [HEROKU] Set Static Folder
if (config.nodeENV == 'production') {
	app.use(express.static('client/dist'));

	app.get('*', (req, res) => {
		res.sendFile(
			path.resolve(__dirname, 'client', 'dist', 'index.html')
		);
	});
}


// [MONGOOSE-CONNECT]
mongoose.connect(
	config.app.mongoURI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	(err, connected) => {
		if (connected) {
			console.log('Mongoose Connected to MongoDB');
		}

		if (err) {
			console.log(`Mongoose Error: ${err}`);
		}
	}
);


// [LISTEN]
server.listen(
	config.port,
	() => {
		console.log(`Server Running on Port: ${config.port}`);
	}
);