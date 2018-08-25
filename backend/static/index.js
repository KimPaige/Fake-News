
/**
 * Function that runs when the page has loaded
 */
$(function() {
    console.log("page loaded...");
  
    fetchCommentData(decideTone);
    
});


function decideTone(comments) {
    var commentsByTone = groupBy(comments, 'tone');
    commentsByTone.sort()

    // SORT THE TONES BY FREQUENCY!!!!
}

/**
 * 
 * @param {*} xs array of data
 * @param {*} key what attribute to group by
 */
var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
};

/**
 * Retrieves all the comment data
 * @param {*} callback 
 */ 
function fetchCommentData(callback) {  
    // Configure your own api call at https://opentdb.com/api_config.php
    var promise = $.get("http://localhost:5000/comments.json");
  
    promise.done(function(data) {
      // Check the console when you have the API call working in order
      // to inspect the json object that we recieve
      console.log(data);
  
      // extract and decode the results
  
  
      callback(data.data);
    })
  }