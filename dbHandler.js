var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017');

mongoose.connection.db.listCollections().toArray(function(err, names) {
    if (err) {
        console.log(err);
    }
    else {
        names.forEach(function(e,i,a) {
            mongoose.connection.db.dropCollection(e.name);
            console.log("--->>", e.name);
        });
    }
});
//
// var Schema = mongoose.Schema;
//
// var statisticSchema = mongoose.Schema({
//   date: { type: Date, default: Date.now },
//   message: String,
//   reqSent: Number,
//   maxReqSec: Number
// })
//
// var Statistic = mongoose.model('Statistic', statisticSchema);
