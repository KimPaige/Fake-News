var Datastore = require('nedb');
var dbOptions = {
  filename: './data/commentData',
}
var db = new Datastore(dbOptions);
db.loadDatabase();

module.exports = {
    addComment: function(comment) {
        db.insert(comment);
    },

    getComments: function(opts, callback) {
        db.find(opts, callback);
    }
}