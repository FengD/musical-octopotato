/**
 * @author Marc Karassev
 */

var request = require("supertest"),
	async = require("async"),
	assert = require("assert"),
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
				.send(tony)
				.expect(200)
				.end(function (err, res) {
					if (err) {
						logger.error(err);
						throw err;
					}
					done();
				});
		});

		test("should create René", function(done) {
			request(userService)
				.post("/users")
				.send(rene)
				.expect(200)
				.end(function (err, res) {
					if (err) {
						logger.error(err);
						throw err;
					}
					done();
				});
		});

		test("should fail recreating Tony", function(done) {
			request(userService)
				.post("/users")
				.send(tony)
				.expect(400)
				.end(function (err, res) {
					if (err) {
						logger.error(err);
						throw err;
					}
					done();
				});
		});

		test("should fail creating bad formatted Tony", function(done) {
			request(userService)
				.post("/users")
				.send({
					uid: "tony",
					pwwd: "lafouine"
				})
				.expect(400)
				.end(function (err, res) {
					if (err) {
						logger.error(err);
						throw err;
					}
					done();
				});
		});
	});

	suite("user removal", function () {

		test("should remove Tony", function(done) {
			request(userService)
				.delete("/users/" + tony.uid)
				.expect(200)
				.end(function (err, res) {
					if (err) {
						logger.error(err);
						throw err;
					}
					done();
				});
		});

		test("should remove René", function(done) {
			request(userService)
				.delete("/users/" + rene.uid)
				.expect(200)
				.end(function (err, res) {
					if (err) {
						logger.error(err);
						throw err;
					}
					done();
				});
		});

		test("should fail reremoving Tony", function(done) {
			request(userService)
				.delete("/users/" + tony.uid)
				.expect(400)
				.end(function (err, res) {
					if (err) {
						logger.error(err);
						throw err;
					}
					done();
				});
		});

		test("should fail removing nonexistent uid", function(done) {
			request(userService)
				.delete("/users/nonexistent")
				.expect(400)
				.end(function (err, res) {
					if (err) {
						logger.error(err);
						throw err;
					}
					done();
				});
		});
	});

	suite("user retrieval", function () {

		var brenda = { uid: "brenda", pwd:"tuuut" };
		var createdUsers = [tony, rene, brenda];

		suiteSetup(function (done) {
			async.each(createdUsers, function iterator (item, callback) {
				request(userService).post("/users").send(item).end(function (err, result) {
					callback(err);
				});
			}, function join (err) {
				if (err) {
					logger.error(err);
					throw err;
				}
				done();
			});
		});

		suiteTeardown(function (done) {
			async.each(createdUsers, function iterator (item, callback) {
				request(userService).delete("/users/" + item.uid).end(function (err, result) {
					callback(err);
				});
			}, function join (err) {
				if (err) {
					logger.error(err);
					throw err;
				}
				done();
			});
		});

		test("should get Tony", function (done) {
			request(userService)
				.get("/users/" + tony.uid)
				.expect(200, [{
					_uid: tony.uid,
					_pwd: tony.pwd
				}], done);
		});

		test("should get René", function (done) {
			request(userService)
				.get("/users/" + rene.uid)
				.expect(200, [{
					_uid: rene.uid,
					_pwd: rene.pwd
				}], done);
		});

		test("should fail getting nonexistent user", function (done) {
			request(userService)
				.get("/users/nonexistentuid")
				.expect(400, done);
		});

		test("should get all users", function (done) {
			request(userService)
				.get("/users")
				.expect(function (res) {
					assert(res.body.length >= 3);
					for (var i = 0; i < createdUsers.length; i++) {
						assert(res.body.find(function(element, index, array) {
							return element._uid == createdUsers[i].uid;
						}));
					}
				})
				.expect(200, done);
		});
	});
});