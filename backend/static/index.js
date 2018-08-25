
var toneOfTheDay;

/**
 * Function that runs when the page has loaded
 */
$(function() {
    // Sets the tone message
    fetchCommentData(setTone);
});


function setTone(comments) {
    const mostCommonTone = comments[0].tod;

    // Group comments by the tone category 
    // var commentsByTone = groupBy(comments, 'tone');
    // // Get the tone with most number of comments
    // var mostCommonTone = Object.keys(commentsByTone).reduce((a, b) => commentsByTone[a].length > commentsByTone[b].length ? a : b);
    toneOfTheDay = mostCommonTone;

    // Gets the tone data, and then sets the tone message based on the tone of the day
    fetchToneData(setToneMessage)
}

/**
 * Sets the tone message 
 * @param {*} data All the tone messages by tone
 * @param {*} tone The tone of the message
 */
function setToneMessage(data, tone) {
    let toneData = data[tone];
    let randomMessageIndex = Math.floor((Math.random() * toneData.length));
    let toneMessage = toneData[randomMessageIndex];
    $("#mood").text(toneMessage);
}

/**
 * Retrieves the comment data
 * @param {*} callback The function that is called with the comment data
 * Takes an object mapping the comment number to comment info.
 */ 
function fetchCommentData(callback) {  
    // Makes a request to get commentsData
    var promise = $.get('http://localhost:5000/api/comments.json');
  
    // Determines what is done when the request has been completed
    promise.done(function(data) {
      callback(data.data);
    })
}

/**
 * Retrieves the tone data 
 * @param {} callback The function that is called with the tone data. 
 * Takes an object mapping tones to an array of messages and the tone to use
 */
function fetchToneData(callback) {
    var promise = $.get('http://localhost:5000/api/tone-messages.json')

    promise.done(function(data) {
        callback(data, toneOfTheDay);
    });
}

/**
 * Helper functino to group an an array by some trait
 * @param {*} xs array of data
 * @param {*} key what attribute to group by
 */
var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
};