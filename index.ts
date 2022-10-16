// [IMPORT]
import bodyParser from "body-parser";
import history from "connect-history-api-fallback";
import cors from "cors";
import express from "express";
import http from "http";
import mongoose, { ConnectOptions } from "mongoose";
import path from "path";

// [IMPORT] Personal
import config from "./s-config";
import Functionality from "./s-middleware/Functionality";
import rateLimiter from "./s-rate-limiter";
import route_api from './s-route/api';
import route_api_product from "./s-route/api/product";
import route_api_productOption from "./s-route/api/product-option";
import route_api_user from "./s-route/api/user";
import route_api_webApp from "./s-route/api/web-app";
import route_api_webContent from "./s-route/api/web-content";
import socket from "./s-socket";


// [REQUIRE]
const socketIO = require("socket.io");


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
			methods: ["GET", "POST"],
			allowedHeaders: ["my-custom-header"],
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
	//.set("socketio", io)
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({ extended: false }))
	.use(cors())
	.use(express.static(__dirname + "/s-static"))
	.use(rateLimiter.global)
	.use(history({
		rewrites: [
			{
				from: /^\/api.*$/,
				to: function (context) {
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
	.use("/api", route_api)
	.use("/api/user", Functionality.user(), route_api_user)
	.use("/api/product", Functionality.user(), route_api_product)
	.use("/api/product-option", Functionality.user(), route_api_productOption)
	.use("/api/web-app", route_api_webApp)
	.use("/api/web-content", route_api_webContent)
;


// [HEROKU] Set Static Folder
if (config.nodeENV == "production") {
	app.use(express.static("client/dist"));

	app.get(
		"*",
		(req: express.Request, res: express.Response) => {
			res.sendFile(
				path.resolve(__dirname, "client", "dist", "index.html")
			);
		}
	);
}


// [MONGOOSE-CONNECT]
mongoose.connect(
	config.app.mongoURI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	} as ConnectOptions
)
	.then(() => {
		console.log("Mongoose Connected to MongoDB");
	})
	.catch((err) => {
		console.log(`Failed to connect to MongoDB: ${err}`);
	})
;


// [LISTEN]
server.listen(
	config.port,
	() => console.log(`Server Running on Port: ${config.port}`)
);