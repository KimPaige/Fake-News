var commentsDB = require('./commentsData');
var getComments = require('./spike-comments').get;
var express = require('express');
var app = express();
var serveStatic = require('serve-static');
var fs = require('fs');
var path = require('path');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

var makeRequest = true;

//Get the secret key
if(makeRequest) {
  let keyPath = path.join(__dirname, '..', '..', '.key');
  fs.readFile(keyPath, 'utf8', (err, key) => {

      //Initialize the tone analyzer service
      var toneAnalyzer = new ToneAnalyzerV3({
          version: '2016-05-19',
          iam_apikey: key,
          url: 'https://gateway-syd.watsonplatform.net/tone-analyzer/api'
      });

      getComments(comments => {

          let numAngry = 0;
          let numDisgust = 0;
          let numFear = 0;
          let numJoy = 0;
          let numSad = 0;

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

                      let dominantEmotion = "anger";
                      let mostScore = tonesArray[0].score;

                      if (tonesArray[0].score > mostAnger) {
                          mostAnger = tonesArray[0].score;
                          mostAngerComment = comment;
                      }

                      if (tonesArray[1].score > mostScore) {
                          mostScore = tonesArray[1].score;
                          dominantEmotion = "disgust";
                      }

                      if (tonesArray[1].score > mostDisgust) {
                          mostDisgust = tonesArray[1].score;
                          mostDisgustComment = comment;
                      }

                      if (tonesArray[2].score > mostScore) {
                          mostScore = tonesArray[2].score;
                          dominantEmotion = "fear";
                      }

                      if (tonesArray[2].score > mostFear) {
                          mostFear = tonesArray[2].score;
                          mostFearComment = comment;
                      }

                      if (tonesArray[3].score > mostScore) {
                          mostScore = tonesArray[3].score;
                          dominantEmotion = "joy";
                      }

                      if (tonesArray[3].score > mostJoy) {
                          mostJoy = tonesArray[3].score;
                          mostJoyComment = comment;
                      }

                      if (tonesArray[4].score > mostScore) {
                          mostScore = tonesArray[4].score;
                          dominantEmotion = "sad";
                      }

                      if (tonesArray[4].score > mostSad) {
                          mostSad = tonesArray[4].score;
                          mostSadComment = comment;
                      }

                      switch (dominantEmotion) {
                          case "anger":   numAngry++;     break;
                          case "disgust": numDisgust++;   break;
                          case "fear":    numFear++;      break;
                          case "joy":     numJoy++;       break;
                          case "sad":     numSad++;       break;
                      }
                  }

                  asyncNumDone++;
                  if (asyncNumDone === asyncNumToDo) {
                      //Add the comments of each category
                      let highestFreq = Math.max(numAngry, numDisgust, numFear, numJoy, numSad);
                      let tod;
                      switch (highestFreq) {
                          case numAngry:      tod = "anger";   break;
                          case numDisgust:    tod = "disgust"; break;
                          case numFear:       tod = "fear";    break;
                          case numJoy:        tod = "joy";     break;
                          case numSad:        tod = "sadness"; break;
                      }

                      let databaseEntry = {};

                      databaseEntry.tod = tod;

                      databaseEntry.comments = [];

                      mostAngerComment.emotion = "anger";
                      mostDisgustComment.emotion = "disgust";
                      mostFearComment.emotion = "fear";
                      mostJoyComment.emotion = "joy";
                      mostSadComment.emotion = "sadness";

                      databaseEntry.comments.push(mostAngerComment);
                      databaseEntry.comments.push(mostDisgustComment);
                      databaseEntry.comments.push(mostFearComment);
                      databaseEntry.comments.push(mostJoyComment);
                      databaseEntry.comments.push(mostSadComment);

                      commentsDB.addComment(databaseEntry);
                  }
              });
          });
      });
  });
}

app.get('/api/comments[1].json', (req, res) => {
  
  commentsDB.getComments({}, (err, data) => {
    res.send(data[0]);
  })
})

app.use(serveStatic('static/'));

app.listen(5000);