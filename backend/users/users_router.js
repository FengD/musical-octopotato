/**
 * @author Marc Karassev
 */

var express = require("express"),
	usersRouter = express.Router(),
	users = require("./users"),
	logger = require("./logger");

usersRouter.get("/", function(req, res) {
	users.get(null, null, function(err, documents) {
		if (err) {
			res.status(500).send(err);
		}
		else {
			res.send(documents.map(users.toJSON));
		}
	});
});

usersRouter.get("/:uid", function(req, res) {
	users.get(req.params.uid, null, function(err, documents) {
		if (err) {
			if (err.nonexistentUser) {
				res.status(400).send(err);
			}
			else {
				res.status(500).send(err);
			}
		}
		else {
			res.send(documents.map(users.toJSON));
		}
	});
});

usersRouter.post("/", function(req, res) {
	users.create(req.body, function(err, result) {
		if (err) {
			if (err.duplicate || err.invalidJson) {
				res.status(400).send(err);
			}
			else {
				res.status(500).send(err);
			}
		}
		else {
			res.send(result);
		}
	});
});

usersRouter.post("/:uid", function login (req, res) {
	users.get(req.params.uid, req.body.pwd, function (err, result) {
		if (err) {
			if (err.nonexistentUser) {
				res.status(400).send(err);
			}
			else {
				res.status(500).send(err);
			}
		}
		else {
			res.send(users.toJSON(result[0]));
		}
	});
});

usersRouter.delete("/:uid", function (req, res) {
	users.remove(req.params.uid, function (err, result) {
		if (err) {
			if (err.nonexistentUser) {
				res.status(400).send(err);
			}
			else {
				res.status(500).send(err);
			}
		}
		else {
			res.send(result);
		}
	});
});

usersRouter.init = function init(callback) {
	users.init(function (err) {
		if (err) {
			logger.warn(err);
		}
		else {
			logger.info("router initialized");
		}
		callback(err);
	});
};

usersRouter.clean = function clean(callback) {
	users.clean(function (err, result) {
		callback(err, result);
	});
};

// Exports

module.exports = exports = usersRouter;