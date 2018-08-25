const fetch = require('node-fetch');
const xmlParser = require('xml2js').parseString;
var request = require("request");

//Template url options for getting comments
var options = {
    method: 'GET',
    url: 'https://comments.us1.gigya.com/comments.getComments',
    qs:
        {
            categoryID: 'Stuff',
            streamID: 'stuff/national/106546452',
            APIKey: '3_9JitkeW_HEZvUcTSahg2tBTNm_psp2j-F58dCHDCilHVDYpGUAnC0vHmZMfro1_V',
            format: 'json'
        },
    headers:
        {
            'postman-token': '5291c2d9-cfbc-3f96-3c61-7e3df1885e7b',
            'cache-control': 'no-cache'
        }
};

const RSS_URL = "https://i.stuff.co.nz/rss";
const MIN_ARTICLES = 1;

let articles = [];
function Article(title, url, comments) {
    this.title = title;
    this.url = url;
    this.comments = comments;
}

get(arts => {
    console.log(arts);
    arts.forEach(art => {
        console.log("Title: " + art.title);
        console.log("URL: " + art.url);
        console.log("Comments: ");
        art.comments.forEach(c => {
            console.log(c);
        });
    });
});

/**
 * Gets an array of articles and their comments.
 * 
 * @param   A callback function executed when the process is done. Is passed an array of Article objects.
 */
function get(callback) {

    let asyncNumDone = 0;
    let asyncNumToDo;

    fetch(RSS_URL)
        .then(res => res.text())
        .then(text => {
            parseStreamIDs(text);
        });

    //Given an XML string, extracts the article IDs necessary for getting comments.
    //Puts the IDs into articleIDs
    function parseStreamIDs(xml) {
        xmlParser(xml, (err, result) => {
            let items = result.rss.channel[0].item;
            asyncNumToDo = items.length;
            for (let i = 0; i < items.length; i++) {

                let linkString = items[i].link[0];

                var request = require("request");

                var options = {
                    method: 'HEAD',
                    url: linkString,
                    headers:
                        {
                            'postman-token': 'da0145b5-97b4-4075-5631-0dd206e8f19e',
                            'cache-control': 'no-cache'
                        }
                };

                request(options, function (error, response, body) {
                    if (error) throw new Error(error);

                    let fullURL = response.headers['x-url'];

                    let betweenSlash = fullURL.split('/');
                    let withSlashes = "";

                    for (let i = 3; i < betweenSlash.length - 1; i++) {
                        withSlashes += betweenSlash[i] + (i === betweenSlash.length - 2 ? "" : "/");
                    }

                    parseArticles(withSlashes, items[i].title[0], linkString);
                });
            }
        });
    }

    //Given the stream IDs, parses an array of Article objects
    function parseArticles(streamID, articleName, url) {

        let reqOptions = Object.assign({}, options);
        reqOptions.qs.streamID = streamID;

        request(reqOptions, function (error, response, body) {
            if (error) throw new Error(error);
            let obj = JSON.parse(body);
            if (obj.commentCount >= MIN_ARTICLES) {
                //Skip articles without enough comments
                let comments = [];
                for (let i = 0; i < obj.comments.length; i++) {
                    comments.push(obj.comments[i].commentText);
                }
                articles.push(new Article(articleName, url, comments));
            }
            asyncNumDone++;
            if (asyncNumDone === asyncNumToDo) callback(articles);
        });
    }
}
