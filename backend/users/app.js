/**
 * @author Marc Karassev
 */

var express = require("express"),
	bodyParser = require("body-parser"),
	usersRouter = require("./users_router"),
	mongoConnection = require("./mongo_connection"),
	logger = require("./logger"),
	app = express(),
	port = 8080;

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

app.use("/users", usersRouter);

function cleanBeforeExit() {
	logger.info("exiting...");
	mongoConnection.disconnect();
}

process.on("beforeExit", function() {
	cleanBeforeExit();
});

process.on("SIGINT", function() {
	cleanBeforeExit();
	process.exit(0);
});

(function init() {
	mongoConnection.connect(function() {
		app.listen(port);
		logger.info("listening to", port);
	});
})();

// Exports

exports.app = app;
exports.logger = logger;