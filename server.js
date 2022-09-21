// [REQUIRE]
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const path = require('path');
const socketIO = require('socket.io');

// [REQUIRE][OTHER] Personal
const config = require('./s-config');
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


// [SET]
app.set('socketio', io);


/**
 * @notice [USE]
 * Set static folder
 * Rate Limiter
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(__dirname + '/s-static'));
app.use(rateLimiter.global);


// [USE][ROUTE][API]
app.use('/api', route_api_);
app.use('/api/user', Functionality.user(), route_api_user);
app.use('/api/product', Functionality.user(), route_api_product);
app.use('/api/product-option', Functionality.user(), route_api_productOption);
app.use('/api/web-app', route_api_webApp);
app.use('/api/web-content', route_api_webContent);


// [HEROKU] Set Static Folder for Heroku
if (config.nodeENV == 'production') {
	app.use(express.static('client/dist'));

	app.get('*', (req, res) => {
		res.sendFile(
			path.resolve(__dirname, 'client', 'dist', 'index.html')
		);
	});
}


// [LISTEN]
server.listen(
	config.port,
	() => {
		console.log(`Server Running on Port: ${config.port}`);
	}
);