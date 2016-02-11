/**
 * @author Marc Karassev
 */

var express = require("express"),
	router = express.Router(),
	mixes = require("./mixes"),
	logger = require("./logger");

router.get("/", function(req, res) {
	mixes.get(null, null, function (err, documents) {
		if (err) {
			// if (err.nonexistentMix) {
			// 	res.status(400).send(err);
			// }
			// else {
				res.status(500).send(err);
			//}
		}
		else {
			res.send(documents.map(mixes.Mix.toJSON));
		}
	});
});

router.get("/:author", function(req, res) {
	mixes.get(null, req.params.author, function (err, documents) {
		if (err) {
			// if (err.nonexistentMix) {
			// 	res.status(400).send(err);
			// }
			// else {
				res.status(500).send(err);
			//}
		}
		else {
			res.send(documents.map(mixes.Mix.toJSON));
		}
	});
});

router.get("/:author/:title", function(req, res) {
	mixes.get(req.params.title, req.params.author, function (err, documents) {
		if (err) {
			if (err.nonexistentMix) {
				res.status(400).send(err);
			}
			else {
				res.status(500).send(err);
			}
		}
		else {
			res.send(documents.map(mixes.Mix.toJSON));
		}
	});
});

router.post("/", function(req, res) {
	mixes.create(req.body, function(err, result) {
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

router.delete("/:author/:title", function (req, res) {
	mixes.remove(req.params.title, req.params.author, function (err, result) {
		if (err) {
			if (err.nonexistentMix) {
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

router.put("/", function (req, res) {
	mixes.replace(req.body, function (err, result) {
		if (err) {
			if (err.invalidJson) {
				res.status(400).send(err);
			}
			else if (err.nonexistentMix) {
				res.status(404).send(err);
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

router.init = function init(callback) {
	mixes.init(function (err) {
		if (err) {
			logger.warn(err);
		}
		else {
			logger.info("router initialized");
		}
		callback(err);
	});
}

router.clean = function clean(callback) {
	mixes.clean(function (err, result) {
		callback(err, result);
	});
}

// Exports

module.exports = exports = router;