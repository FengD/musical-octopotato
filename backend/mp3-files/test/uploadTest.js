
var assert = require('assert'),
    request = require("supertest"),
    async = require("async"),
    fileUpload = require("../serverFileUpload"),
    logger = require("../logger");

suite('GET /uploads', function(){
  test('respond with json', function(done){
    request(fileUpload)
      .get('/uploads')
      .expect(200, done);
  })
})

// Problem with the Test
suite('POST /api/file', function(){
  test('respond with json', function(done){
    request(fileUpload)
      .post('/api/file')
      //.send('./uploads/test.jpg')
      //.send('./uploads/test.jpg')
      //.attach('avatar', 'uploads/test.jpg')
      .expect(200, done);
  })
})
