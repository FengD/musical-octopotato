var express = require("express"),
	usersRouter = express.Router(),
	users = require("./users");

usersRouter.get("/", function(req, res) {
	users.get().toArray(function(err, documents) {
		if (err) {
			res.send(err);
		}
		else {
			res.send(documents);
		}
	});
});

usersRouter.get("/:uid", function(req, res) {
	users.get(req.params.uid).toArray(function(err, documents) {
		if (err) {
			res.send(err);
		}
		else {
			res.send(documents);
		}
	});
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