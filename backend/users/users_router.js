/**
 * @author Marc Karassev
 */

var express = require("express"),
	usersRouter = express.Router(),
	users = require("./users"),
	logger = require("./logger");

usersRouter.get("/", function(req, res) {
	users.get(function(err, documents) {
		if (err) {
			res.send(err);
		}
		else {
			res.send(documents);
		}
	});
});

usersRouter.get("/:uid", function(req, res) {
	users.get(function(err, documents) {
		if (err) {
			res.send(err);
		}
		else {
			res.send(documents);
		}
	}, req.params.uid);
});

usersRouter.post("/", function(req, res) {
	users.create(req.body, function(err, result) {
		if (err) {
			res.send(err); // TODO status code
		}
		else {
			res.send(result);
		}
	});
});

// Exports

module.exports = exports = usersRouter;