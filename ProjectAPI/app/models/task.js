/**
 * Created by moutasem on 02.05.2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    name: String,
    date: {type: Date, default: Date.now()},
    creator: {type: String, default: "admin"},
    category: String
});

module.exports = mongoose.model('Task', TaskSchema);


