/**
 * @author Marc Karassev
 */

var assert = require('assert'),
	async = require("async"),
	request = require("supertest"),
	router = require("../router"),
	app = require("../app"),
	logger = require("../logger");

var track1Json = {
		name: "daTrack",
		trackPath: "daPath",
		gain: 0,
		balance: 1,
		highFilterLevel: 2,
		midFilterLevel: 3,
		lowFilterLevel: 4,
		highFilterFreq: 5,
		midFilterFreq: 6,
		lowFilterFreq: 7
}, 	track2Json = {
		name: "daOtherTrack",
		trackPath: "daOtherPath",
		gain: 8,
		balance: 9,
		highFilterLevel: 10,
		midFilterLevel: 11,
		lowFilterLevel: 12,
		highFilterFreq: 13,
		midFilterFreq: 14,
		lowFilterFreq: 15
};

var superMixJson = {
		title: "daSuperMix",
		author: "daSuperDJ",
		date: new Date(),
		coverPath: "/daPath",
		tracks: [track1Json, track2Json]
}, 	otherMixJson = {
		title: "otherMix",
		author: "daSuperDJ",
		date: new Date(),
		coverPath: "/daOtherPath",
		tracks: [track1Json, track2Json]
};

suite("mixes service", function () {

	suiteSetup(function (done) {
		app.on("ready", function () {
			done();
		});
	});

	suiteTeardown(function () {
		app.cleanBeforeExit();
	});

	suite("mix creation", function () {

		test("should create SuperMix", function(done) {
			request(app)
				.post("/mixes")
				.send(superMixJson)
				.expect(200)
				.end(function (err, res) {
					if (err) {
						logger.error(err);
						throw err;
					}
					done();
				});
		});

		test("should create OtherMix", function(done) {
			request(app)
				.post("/mixes")
				.send(otherMixJson)
				.expect(200)
				.end(function (err, res) {
					if (err) {
						logger.error(err);
						throw err;
					}
					done();
				});
		});

		test("should fail recreating SuperMix", function(done) {
			request(app)
				.post("/mixes")
				.send(superMixJson)
				.expect(400)
				.end(function (err, res) {
					if (err) {
						logger.error(err);
						throw err;
					}
					done();
				});
		});

		test("should fail creating bad formatted SuperMix", function(done) {
			request(app)
				.post("/mixes")
				.send({
					titlllle: "daSuperMix",
					author: "daSuperDJ",
					date: new Date(),
					coverPath: "/daPath",
					tracks: [track1Json, track2Json]
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

	suite("mix removal", function () {

		test("should remove SuperMix", function(done) {
			request(app)
				.delete("/mixes/" + superMixJson.author + "/" + superMixJson.title)
				.expect(200)
				.end(function (err, res) {
					if (err) {
						logger.error(err);
						throw err;
					}
					done();
				});
		});

		test("should remove OtherMix", function(done) {
			request(app)
				.delete("/mixes/" + otherMixJson.author + "/" + otherMixJson.title)
				.expect(200)
				.end(function (err, res) {
					if (err) {
						logger.error(err);
						throw err;
					}
					done();
				});
		});

		test("should fail reremoving SuperMix", function(done) {
			request(app)
				.delete("/mixes/" + superMixJson.author + "/" + superMixJson.title)
				.expect(400)
				.end(function (err, res) {
					if (err) {
						logger.error(err);
						throw err;
					}
					done();
				});
		});

		test("should fail removing nonexistent mix", function(done) {
			request(app)
				.delete("/mixes/nonexistentAuthor/nonexistentMix")
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

	suite("mix retrieval", function () {

		var mix1Json = {
			title: "mix1",
			author: "auth1",
			date: new Date(),
			coverPath: "/path/path",
			tracks: [track2Json]
		};
		var createdMixesJson = [superMixJson, otherMixJson, mix1Json],
			superDjMixesJson = [superMixJson, otherMixJson];

		suiteSetup(function (done) {
			async.each(createdMixesJson, function iterator (item, callback) {
				request(app).post("/mixes").send(item).expect(200).end(function (err, result) {
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
			async.each(createdMixesJson, function iterator (item, callback) {
				request(app)
					.delete("/mixes/" + item.author + "/" + item.title)
					.expect(200)
					.end(function (err, result) {
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

		test("should get SuperMix", function (done) {
			request(app)
				.get("/mixes/" + superMixJson.author + "/" + superMixJson.title)
				.expect(200)
				.expect(function (response) {
					var results = response.body;

					assert.equal(1, results.length);
					assert.equal(superMixJson.title, results[0].title);
					assert.equal(superMixJson.author, results[0].author);
				})
				.end(done);
		});

		test("should get OtherMix", function (done) {
			request(app)
				.get("/mixes/" + otherMixJson.author + "/" + otherMixJson.title)
				.expect(200)
				.expect(function (response) {
					var results = response.body;

					assert.equal(1, results.length);
					assert.equal(otherMixJson.title, results[0].title);
					assert.equal(otherMixJson.author, results[0].author);
				})
				.end(done);
		});

		test("should fail getting nonexistent mix", function (done) {
			request(app)
				.get("/mixes/nonexistentAuthor/nonexistentMix")
				.expect(400, done);
		});

		test("should get all mixes", function (done) {
			request(app)
				.get("/mixes")
				.expect(function (res) {
					assert(res.body.length >= 3);
					for (var i = 0; i < createdMixesJson.length; i++) {
						assert(res.body.find(function(element, index, array) {
							return element.title == createdMixesJson[i].title
								&& element.author == createdMixesJson[i].author;
						}));
					}
				})
				.expect(200, done);
		});
	});
});