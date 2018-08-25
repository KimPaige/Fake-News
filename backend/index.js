var express = require('express');
var app = express();
var serveStatic = require('serve-static');
var finalhandler = require('finalhandler');
var server = serveStatic('static');

app.get('/', function(req, res){
    server(req, res, finalhandler(req, res));
});



// app.use(serveStatic('static'));

app.listen(5000);
