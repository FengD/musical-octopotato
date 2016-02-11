var express = require("express");
var fs = require("fs");
var multer = require("multer");

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

var storage = multer.diskStorage({
    destination: __dirname + "/uploads",
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now());
    }
});

var upload = multer({storage: storage});

app.post('/api/file', upload.array('file'), function (req, res) {

    //console.log("received " + req.files.length + " files");// form files
    var filesPaths = [];
    for (var i = 0; i < req.files.length; i++) {
        filesPaths.push(req.files[i].filename);
       // console.log("### " + req.files[i].path);

    }
    //console.log("The URL for the file is:" + "localhost:3000\\"+req.file.path);
    res.send(filesPaths);
    //res.status(200).end();

});

app.get('/uploads', function (req, res) {

    fs.readdir(__dirname + "/uploads", function (err, list) {
        res.end(JSON.stringify(list));
    });

});

app.use("/uploads", express.static(__dirname + '/uploads'));

app.listen(8082, function () {

    console.log("Server is listening on port 8082");
    console.log("Open http://localhost:8082 and upload some files!")

});

module.exports = exports = app;

