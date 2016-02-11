
var assert = require('assert'),
    request = require("supertest"),
    async = require("async"),
    fileUpload = require("../serverFileUpload"),
    logger = require("../logger");

suite('GET /uploads', function(){
  test('should return 200', function(done){
    request(fileUpload)
      .get('/uploads')
      //.expect("Content-type",/json/)
      .expect(200, done);
  })
})

suite('GET /uploads', function(){
 test("should return 404",function(done){
    request(fileUpload)
    .get("/uploads/test")
    .expect(404,done);
  })
})

suite('POST /api/file', function(){
  test('should return 200', function(done){
    request(fileUpload)
      .post('/api/file')
      .attach('file', __dirname  + '/uploads/test.jpg')
      .expect(200, done);
  })
})

suite('POST /api/file', function(){
  test('should return 404', function(done){
    request(fileUpload)
      .post('/api/')
      .send({})
      .expect(404, done);
  })
})



