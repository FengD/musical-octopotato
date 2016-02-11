/**
 * @author Marc Karassev
 */

var express = require("express"),
	bodyParser = require("body-parser"),
	usersRouter = require("./users_router"),
	logger = require("./logger"),
	app = express(),
	port = 8080;

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

app.use("/users", usersRouter);

app.cleanBeforeExit = function cleanBeforeExit(callback) {
	logger.info("exiting...");
	usersRouter.clean(function (err, result) {
		callback(err, result);
	});
}

process.on("beforeExit", function() {
	app.cleanBeforeExit(function (err, result) {
		if (err) {
			logger.error(err);
		}
	});
});

process.on("SIGINT", function() {
	app.cleanBeforeExit(function (err, result) {
		if (err) {
			logger.error(err);
			process.exit(1);
		}
		else {
			process.exit(0);
		}
	});
});

(function init() {
	usersRouter.init(function (err) {
		if (err) {
			logger.error(err);
			app.cleanBeforeExit(function (err, result) {
				if (err) {
					logger.error(err);
				}
				exit(1);
			});
		}
		else {
			app.listen(port);
			logger.info("listening to", port);
			app.emit("ready");
		}
	});
})();

// Exports

module.exports = exports = app;