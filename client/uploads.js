var express = require("express");

var fs = require("fs");

var app = express();

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(express.static(__dirname + '/views'));

app.get('/', function (req, res) {

  res.sendFile(__dirname + "/views/uploads.html");

});

app.listen(2000, function () {

  console.log("Server is listening on port 2000");
  console.log("Open http://localhost:2000 and upload some files!")

});
