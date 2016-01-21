/**
 * @author Marc Karassev
 */

var request = require("supertest"),
	userService = require("../app"),
	logger = require("../logger");

var tony = {
	uid: "tony",
	pwd: "lafouine"
},  rene = {
	uid: "rene",
	pwd: "lataupe"
}

// function logErrDebugResAndCallDone(err, res, done) {
// 	if (err) {
// 		logger.error(err);
// 		throw err;
// 	}
// 	else {
// 		logger.debug(res);
// 	}
// 	done();
// }

suite("users service", function() {

	suiteSetup(function (done) {
		userService.on("ready", function () {
			done();
		});
	});

	suiteTeardown(function () {
		userService.cleanBeforeExit();
	});

	suite("user creation", function () {

		test("should create Tony", function(done) {
			request(userService)
				.post("/users")
				.field("uid", tony.uid)
				.field("pwd", tony.pwd)
				.expect(200)
				.end(function (err, res) {
					if (err) {
						logger.error(err);
						throw err;
					}
					done();
				});
		});

		// test("should create René", function(done) {
		// 	request(userService)
		// 		.post("/users")
		// 		.body(rene)
		// 		.expect(200)
		// 		.end(function (err, res) {
		// 			if (err) {
		// 				logger.error(err);
		// 				throw err;
		// 			}
		// 			done();
		// 		});
		// });

		// test("should fail recreating Tony", function(done) {
		// 	request(userService)
		// 		.post("/users")
		// 		.body(tony)
		// 		.expect(400)
		// 		.end(function (err, res) {
		// 			if (err) {
		// 				logger.error(err);
		// 				throw err;
		// 			}
		// 			done();
		// 		});
		// });

		// test("should fail creating bad formatted Tony", function(done) {
		// 	request(userService)
		// 		.post("/users")
		// 		.body(tony)
		// 		.expect(400)
		// 		.end(function (err, res) {
		// 			if (err) {
		// 				logger.error(err);
		// 				throw err;
		// 			}
		// 			done();
		// 		});
		// });
	});

	// suite("user removal", function () {

	// 	test("should remove Tony", function(done) {
	// 		request(userService)
	// 			.delete("/users/" + tony.uid)
	// 			.expect(200)
	// 			.end(function (err, res) {
	// 				if (err) {
	// 					logger.error(err);
	// 					throw err;
	// 				}
	// 				done();
	// 			});
	// 	});

	// 	test("should remove René", function(done) {
	// 		request(userService)
	// 			.delete("/users/" + rene.uid)
	// 			.expect(200)
	// 			.end(function (err, res) {
	// 				if (err) {
	// 					logger.error(err);
	// 					throw err;
	// 				}
	// 				done();
	// 			});
	// 	});

	// 	test("should fail reremoving Tony", function(done) {
	// 		request(userService)
	// 			.delete("/users/" + tony.uid)
	// 			.expect(400)
	// 			.end(function (err, res) {
	// 				if (err) {
	// 					logger.error(err);
	// 					throw err;
	// 				}
	// 				done();
	// 			});
	// 	});

	// 	test("should fail removing nonexistant uid", function(done) {
	// 		request(userService)
	// 			.delete("/users/nonexistant")
	// 			.expect(400)
	// 			.end(function (err, res) {
	// 				if (err) {
	// 					logger.error(err);
	// 					throw err;
	// 				}
	// 				done();
	// 			});
	// 	});
	// });

	// TODO
});