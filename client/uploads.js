var express = require("express");

var fs = require("fs");

var app = express();

app.use(express.static(__dirname + '/views'));

app.get('/', function (req, res) {

  res.sendFile(__dirname + "/views/uploads.html");

});

app.listen(2000, function () {

  console.log("Server is listening on port 2000");
  console.log("Open http://localhost:2000 and upload some files!")

});
