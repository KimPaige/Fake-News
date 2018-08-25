var express = require('express');
var app = express();
var serveStatic = require('serve-static');

app.use(serveStatic('static/'));

app.listen(5000);
