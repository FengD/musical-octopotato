/**
 * @author Marc Karassev
 */

var express = require("express"),
	bodyParser = require("body-parser"),
	usersRouter = require("./users_router"),
	logger = require("./logger"),
	app = express(),
	port = 8080;

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

app.use("/users", usersRouter);

function cleanBeforeExit() {
	logger.info("exiting...");
	usersRouter.clean();
}

process.on("beforeExit", function() {
	cleanBeforeExit();
});

process.on("SIGINT", function() {
	cleanBeforeExit();
	process.exit(0);
});

(function init() {
	usersRouter.init(function (err) {
		if (err) {
			logger.error(err);
		}
		else {
			app.listen(port);
			logger.info("listening to", port);
		}
	});
})();

// Exports

module.exports = exports = app;