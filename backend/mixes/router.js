/**
 * @author Marc Karassev
 */

var express = require("express"),
	router = express.Router(),
	mixes = require("./mixes"),
	logger = require("./logger");

// TODO routes

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

router.clean = function clean() {
	mixes.clean();
}

// Exports

module.exports = exports = router;