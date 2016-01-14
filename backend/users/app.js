var express = require("express"),
	bodyParser = require("body-parser"),
	app = express(),
	mongoConnection = require("./mongo_connection"),
	usersRouter = require("./users_router");
	port = 8080;

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

app.use("/users", usersRouter);

function cleanBeforeExit() {
	console.log("exiting...");
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
		console.log("listening to", port);
	});
})();
