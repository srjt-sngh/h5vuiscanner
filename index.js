
var express = require("express");
var fs = require("fs");
var h5VUIscanner = require("./h5VUIscanner.js");

let port = 3000;
var app = express();
app.get("/api/ping", (request, response) => {
    response.send(new Date());
});
app.get("/api/vuiusage", (request, response) => {
     var data = h5VUIscanner.load();
    response.send(data);
});
app.use('/', express.static(__dirname + '/'));

app.listen(port);
