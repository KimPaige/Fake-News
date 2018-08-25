var commentsDB = require('./commentsData');
var getComments = require('./spike-comments').get;
var express = require('express');
var app = express();
var serveStatic = require('serve-static');
var fs = require('fs');
var path = require('path');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

var makeRequest = false;

//Get the secret key
if(makeRequest){
  let keyPath = path.join(__dirname, '..', '..', '.key');
  fs.readFile(keyPath, 'utf8', (err, key) => {

      //Initialize the tone analyzer service
      var toneAnalyzer = new ToneAnalyzerV3({
          version: '2016-05-19',
          iam_apikey: key,
          url: 'https://gateway-syd.watsonplatform.net/tone-analyzer/api'
      });

      getComments(comments => {

          let mostAnger = 0;
          let mostAngerComment;

          let mostDisgust = 0;
          let mostDisgustComment;

          let mostFear = 0;
          let mostFearComment;

          let mostJoy = 0;
          let mostJoyComment;

          let mostSad = 0;
          let mostSadComment;

          let asyncNumDone = 0;
          let asyncNumToDo = comments.length;

          comments.forEach(comment => {
              //Analyze the tone of each comment, finding the highest of each category

              var toneParams = {
                  'tone_input': { 'text': comment.text },
                  'content_type': 'application/json'
              };

              toneAnalyzer.tone(toneParams, function (error, toneAnalysis) {
                  if (error) {
                      console.log(error);
                  } else {
                      var tonesArray = toneAnalysis.document_tone.tone_categories[0].tones;

                      if (tonesArray[0].score > mostAnger) {
                          mostAnger = tonesArray[0].score;
                          mostAngerComment = comment;
                      }

                      if (tonesArray[1].score > mostDisgust) {
                          mostDisgust = tonesArray[1].score;
                          mostDisgustComment = comment;
                      }

                      if (tonesArray[2].score > mostFear) {
                          mostFear = tonesArray[2].score;
                          mostFearComment = comment;
                      }

                      if (tonesArray[3].score > mostJoy) {
                          mostJoy = tonesArray[3].score;
                          mostJoyComment = comment;
                      }

                      if (tonesArray[4].score > mostSad) {
                          mostSad = tonesArray[4].score;
                          mostSadComment = comment;
                      }
                  }

                  asyncNumDone++;
                  if (asyncNumDone === asyncNumToDo) {
                      //Add the comments of each category
                      console.log(mostAngerComment);
                      console.log(mostDisgustComment);
                      console.log(mostFearComment);
                      console.log(mostJoyComment);
                      console.log(mostSadComment);
                  }
              });
          });
      });
  });
}

app.get('/api/comments.json', (req, res) => {
  
  commentsDB.getComments({}, (err, data) => {
    res.send({ data });
  })
})

app.use(serveStatic('static/'));

app.listen(5000);
