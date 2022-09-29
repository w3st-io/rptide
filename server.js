"use strict";
exports.__esModule = true;
// [IMPORT]
var body_parser_1 = require("body-parser");
var connect_history_api_fallback_1 = require("connect-history-api-fallback");
var cors_1 = require("cors");
var express_1 = require("express");
var http_1 = require("http");
var path_1 = require("path");
// [IMPORT] Personal
var s_config_1 = require("./s-config");
// [REQUIRE]
var mongoose = require('mongoose');
var socketIO = require('socket.io');
// [REQUIRE][OTHER] Personal
var Functionality = require('./s-middlewares/Functionality');
var rateLimiter = require('./s-rate-limiters');
var socket = require('./s-socket');
// [REQUIRE][API] Personal
var route_api_ = require('./s-route/api');
var route_api_productOption = require('./s-route/api/product-option');
var route_api_product = require('./s-route/api/product');
var route_api_user = require('./s-route/api/user');
var route_api_webApp = require('./s-route/api/web-app');
var route_api_webContent = require('./s-route/api/web-content');
// [EXPRESS]
var app = (0, express_1["default"])();
// [SERVER] Upgrade app to server
var server = http_1["default"].createServer(app);
// [SOCKET.IO]
var io = socketIO(server, {
    allowEIO3: true,
    cors: {
        origin: s_config_1["default"].app.baseURL.client,
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true
    }
});
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
    .use(body_parser_1["default"].json())
    .use(body_parser_1["default"].urlencoded({ extended: false }))
    .use((0, cors_1["default"])())
    .use(express_1["default"].static(__dirname + '/s-static'))
    .use(rateLimiter.global)
    .use((0, connect_history_api_fallback_1["default"])({
    rewrites: [
        {
            from: /^\/api*\/*$/,
            to: function (context) {
                return context.parsedUrl.path;
            }
        }
    ]
}));
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
    .use('/api/web-content', route_api_webContent);
// [HEROKU] Set Static Folder
if (s_config_1["default"].nodeENV == 'production') {
    app.use(express_1["default"].static('client/dist'));
    app.get('*', function (req, res) {
        res.sendFile(path_1["default"].resolve(__dirname, 'client', 'dist', 'index.html'));
    });
}
// [MONGOOSE-CONNECT]
mongoose.connect(s_config_1["default"].app.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err, connected) {
    if (connected) {
        console.log('Mongoose Connected to MongoDB');
    }
    if (err) {
        console.log("Mongoose Error: ".concat(err));
    }
});
// [LISTEN]
server.listen(s_config_1["default"].port, function () {
    console.log("Server Running on Port: ".concat(s_config_1["default"].port));
});
