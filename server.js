// [REQUIRE]
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const path = require('path');
const socketIO = require('socket.io');

// [REQUIRE][OTHER][API][PAGES][PUBLIC-API] Personal
const config = require('./s-config');
const Functionality = require('./s-middlewares/Functionality');
const rateLimiter = require('./s-rate-limiters');
const s_socket = require('./s-socket');

const a_ = require('./s-route/api');
const a_apiSubscription = require('./s-route/api/api-subscription');
const a_productOption = require('./s-route/api/product-option');
const a_product = require('./s-route/api/product');
const a_socket = require('./s-route/api/socket');
const a_user = require('./s-route/api/user');
const a_webApp = require('./s-route/api/web-app');
const a_webContent = require('./s-route/api/web-content');

const p_user = require('./s-route/pages/user');


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
s_socket.start(io);


// [SET]
app.set('socketio', io);


// [MONGOOSE-CONNECTION]
mongoose.connect(
	config.app.mongoURI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		//useFindAndModify: false,
	},
	(err, connected) => {
		if (connected) { console.log('Mongoose Connected to MongoDB'); }
		else { console.log(`Mongoose Connection Error --> ${err}`); }
	}
);


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
app.use('/api', a_);
app.use('/api/socket', a_socket);
app.use('/api/user', Functionality.user(), a_user);
app.use('/api/api-subscription', a_apiSubscription);
app.use('/api/product', Functionality.user(), a_product);
app.use('/api/product-option', Functionality.user(), a_productOption);
app.use('/api/web-app', a_webApp);
app.use('/api/web-content', a_webContent);


// [USE][ROUTE][PAGES]
app.use('/pages/user', p_user);


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