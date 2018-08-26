var commentsDB = require('./commentsData');
var getComments = require('./spike-comments').get;
var express = require('express');
var app = express();
var serveStatic = require('serve-static');
var fs = require('fs');
var path = require('path');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

const toneMessages = {
    "anger": [
        "They're an angry bunch today.",
        "It’s hit the fan."
    ],
    "disgust": [
        "The world is a messed up place."
    ],
    "fear": [
        "Fears are nothing more than a state of mind."
    ],
    "joy": [
        "Absolutely spiffin' innit."
    ],
    "sadness": [
        "The nation's got the blues today."
    ]
}


var makeRequest = true;

//Get the secret key
if (makeRequest) {
    console.log("reading file");
    let username = fs.readFileSync(path.join(__dirname, '..', '..', '.username'), 'utf8');
    let password = fs.readFileSync(path.join(__dirname, '..', '..', '.password'), 'utf8');
    console.log("read file");

    var toneAnalyzer = new ToneAnalyzerV3({
        version: '2016-05-19',
        username: username,
        password: password,
        url: 'https://gateway.watsonplatform.net/tone-analyzer/api'
    });

    console.log("getting comments");
    getComments(comments => {

        console.log("got comments");
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
                console.log("got a response from watson");
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
                        case "anger": numAngry++; break;
                        case "disgust": numDisgust++; break;
                        case "fear": numFear++; break;
                        case "joy": numJoy++; break;
                        case "sad": numSad++; break;
                    }
                }

                asyncNumDone++;
                if (asyncNumDone === asyncNumToDo) {
                    //Add the comments of each category
                    console.log(numAngry);
                    console.log(numDisgust);
                    console.log(numFear);
                    console.log(numJoy);
                    console.log(numSad);
                    let highestFreq = Math.max(numAngry, numDisgust, numFear, numJoy, numSad);
                    let tod;
                    switch (highestFreq) {
                        case numAngry: tod = "anger"; break;
                        case numDisgust: tod = "disgust"; break;
                        case numFear: tod = "fear"; break;
                        case numJoy: tod = "joy"; break;
                        case numSad: tod = "sadness"; break;
                    }

                    let databaseEntry = {};

                    databaseEntry.tod = {
                        tagline: toneMessages[tod][Math.floor((Math.random() * toneMessages[tod].length))],
                        name: tod
                    }

                    //joy, anger, fear, sadness, disgust


                    let data = [];
                    data.push({
                        text: mostJoyComment.text,
                        url: mostJoyComment.articleURL,
                        title: mostJoyComment.articleTitle,
                        tone: "joy"
                    });

                    data.push({
                        text: mostAngerComment.text,
                        url: mostAngerComment.articleURL,
                        title: mostAngerComment.articleTitle,
                        tone: "anger"
                    });

                    data.push({
                        text: mostFearComment.text,
                        url: mostFearComment.articleURL,
                        title: mostFearComment.articleTitle,
                        tone: "fear"
                    });

                    data.push({
                        text: mostSadComment.text,
                        url: mostSadComment.articleURL,
                        title: mostSadComment.articleTitle,
                        tone: "sad"
                    });

                    data.push({
                        text: mostDisgustComment.text,
                        url: mostDisgustComment.articleURL,
                        title: mostDisgustComment.articleTitle,
                        tone: "disgust"
                    });

                    databaseEntry.data = data;

                    commentsDB.deleteComments({});
                    commentsDB.addComment(databaseEntry);
                    console.log('Test');
                }
            });
        });
    });
}

app.get('/api/comments.json', (req, res) => {

    commentsDB.getComments({}, (err, data) => {
        res.send(data[data.length - 1]);
    })
})

app.use(serveStatic('static/'));

app.listen(5000);