/**
 * @author Marc Karassev
 */

var assert = require('assert'),
	async = require("async"),
	users = require("../users"),
	mongoConnection = require("../mongo_connection"),
	logger = require("../logger");

var bobby = new users.User("Bobby", "Lafrite"),
	bobbyJson = {
		uid: "Bobby",
		pwd: "Lafrite"
	};

suite("users", function() {

	suiteSetup(function(done) {
		mongoConnection.connect(function() {
			done();
		});
	});

	suite("#fromJSON()", function() {

		test("should produce a user equal to Bobby", function() {
			assert.deepEqual(bobby, users.fromJSON(bobbyJson));
		});

		test("should produce a user not equal to Bobby", function() {
			var notBobbyJson = {
				uid: "notBobby",
				pwd: "Lafrite"
			};

			assert.notDeepEqual(bobby, users.fromJSON(notBobbyJson));
		});
	});

	suite("#toJSON()", function() {

		test("should produce a JSON equal to BobbyJson", function() {
			assert.deepEqual(bobbyJson, users.toJSON(bobby));
		});

		test("should produce a JSON not equal to BobbyJson", function() {
			var notBobby = new users.User("notBobby", "Lafrite");

			assert.notDeepEqual(bobby, users.toJSON(notBobby));
		})
	});

	suite("#create()", function() {

		test("should create Bobby without error", function(done) {
			users.create(users.toJSON(bobby), function(err, result) {
				if (err) {
					logger.error(err);
					throw err;
				}
				assert.deepEqual(bobby, result);
			});
			done();
		});

		test("should send error when recreating Bobby", function(done) {
			users.create(users.toJSON(bobby), function(err, result) {
				assert.ifError(err);
			});
			done();
		});
	});

	suite("#remove()", function() {

		test("should remove Bobby without error", function(done) {
			users.remove(bobby.uid, function(err, result) {
				assert.ifError(err);
			});
			done();
		});

		test("should reremove Bobby with error", function(done) {
			users.remove(bobby.uid, function(err, result) {
				if (err) {
					logger.error(err);
					throw err;
				}
				assert.deepEqual({
					ok: 1,
					n: 1
				}, result.result);
			});
			done();
		});
	});

	suite("#get()", function() {

		var joey = new users.User("Joey", "Starr"),
		 	nadine = new users.User("Nadine", "Morano");
		var createdUsers = [bobby, joey, nadine];

		suiteSetup(function(done) {
			async.parallel([
				function(callback) {
					users.create(users.toJSON(bobby), function(err, result) {
						callback(err, result);
					});
				},
				function(callback) {
					users.create(users.toJSON(joey), function(err, result) {
						callback(err, result);
					});
				},
				function(callback) {
					users.create(users.toJSON(nadine), function(err, result) {
						callback(err, result);
					});
				}
			], function(err, results) {
				assert.equal(null, err);
				done();
			});
		});

		test("should get all users", function(done) {
			users.get(function(err, data) {
				assert.equal(null, err);
				assert(data.length >= 3);
				for (var i = 0; i < createdUsers.length; i++) {
					assert(data.find(function(element, index, array) {
						return element.uid == createdUsers[i].uid;
					}));
				}
				done();
			});
		});
		
		test("should get Bobby by its uid", function(done) {
			users.get(function(err, data) {
				assert.equal(null, err);
				assert.equal(1, data.length);
				assert.deepEqual([bobby], data);
				done();
			}, bobbyJson.uid);
		});
		
		test("should get no result with nonexistant uid", function(done) {
			users.get(function(err, data) {
				assert.equal(null, err);
				assert.equal(0, data.length);
				assert.deepEqual([], data);
				done();
			}, "nonExistantUid");
		});
		
		suiteTeardown(function(done) {
			async.parallel([
				function(callback) {
					users.remove(bobby.uid, function(err, result) {
						callback(err, result);
					});
				},
				function(callback) {
					users.remove(joey.uid, function(err, result) {
						callback(err, result);
					});
				},
				function(callback) {
					users.remove(nadine.uid, function(err, result) {
						callback(err, result);
					});
				}
			], function(err, results) {
				assert.equal(null, err);
				done();
			});
		});
	});

	suiteTeardown(function() {
		mongoConnection.disconnect();
	});
});
