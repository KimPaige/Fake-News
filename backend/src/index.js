var commentsDB = require('./commentsData');

var express = require('express');
var app = express();
var serveStatic = require('serve-static');

var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

var toneAnalyzer = new ToneAnalyzerV3({
    version: '{version}',
    username: '{username}',
    password: '{password}',
    url: '{url}'
  });

app.use(serveStatic('static/'));

app.listen(5000);
