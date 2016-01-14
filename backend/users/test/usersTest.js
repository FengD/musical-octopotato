// TODO move to TDD

var assert = require('assert'),
	users = require("../users"),
	mongoConnection = require("../mongo_connection");

var bobby = new users.User("Bobby", "Lafrite");

describe("users", function() {

	before(function(done) {
		mongoConnection.connect(function() {
			done();
		});
	});

	describe("#create()", function() {

		it("should create Bobby without error", function(done) {
			users.create(users.toJSON(bobby), function(err, result) {
				if (err) {
					console.log(err);
					throw err;
				}
				assert.deepEqual(bobby, result);
			});
			done();
		});
	});

	describe("#remove()", function() {

		it("should remove Bobby without error", function(done) {
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

	after(function() {
		mongoConnection.disconnect();
	});
});
