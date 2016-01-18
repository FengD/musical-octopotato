// TODO move to TDD

var assert = require('assert'),
	users = require("../users"),
	mongoConnection = require("../mongo_connection");

var bobby = new users.User("Bobby", "Lafrite");

suite("users", function() {

	suiteSetup(function(done) {
		mongoConnection.connect(function() {
			done();
		});
	});

	suite("#create()", function() {

		test("should create Bobby without error", function(done) {
			users.create(users.toJSON(bobby), function(err, result) {
				if (err) {
					console.log(err);
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

	suite("#get()", function() {

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
					console.log(err);
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

	suiteTeardown(function() {
		mongoConnection.disconnect();
	});
});
