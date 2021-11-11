const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const debug = require("debug")("backend:server");
const static = require("serve-static");
const path = require("path");
const logger = require("morgan");
const fs = require("fs");
const app = express();

require("dotenv").config();

const { sequelize } = require("./models");
const defultData = require("./defultData");
const testData = require("./testData");
const router = require("./router/index");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/eventImg", static(path.join(__dirname, "eventImg")));
//app.use("/files", static(path.join(__dirname, "files")));

app.use(cookieParser());
app.use(cors());

sequelize
    .sync(/* { force: true } */)
    .then(() => {
        console.log("데이터베이스 연결 성공");
    })
    .then(() => {
        defultData();
        testData();
    })
    .catch((err) => {
        console.log(err);
    });

app.use("/", router);

app.get("/favicon.ico", (req, res) => res.status(204));
app.get("/apple-touch-icon.png", (req, res) => res.status(204));
app.get("/apple-touch-icon-precomposed.png", (req, res) => res.status(204));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

/**
 * Module dependencies.
 */

var http = require("http");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "4000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, "0.0.0.0", () => {
    console.log("http server on " + port);
});
server.on("error", onError);
server.on("listening", onListening);
server.on("connection", function (socket) {
    console.log("클라이언트가 접속");
});

//---------------------------------------------------------------------------------------------------------------
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
}
