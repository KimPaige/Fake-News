<<<<<<< HEAD
var commentsDB = require('./commentsData');

=======
var get = require('./spike-comments').get;
>>>>>>> 1ff28bfd9a59c834c9ef1fc584c1421482df0585
var express = require('express');
var app = express();
var serveStatic = require('serve-static');

//var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

/*var toneAnalyzer = new ToneAnalyzerV3({
    version: '{version}',
    iam_apikey: '{iam_api_key}',
    url: '{url}'
  });*/

app.use(serveStatic('static/'));

app.listen(5000);
