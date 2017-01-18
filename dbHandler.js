var mongoose = require('mongoose');
mongoose.Promise = global.Promise
mongoose.connect('localhost', 'kasparov');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var Schema = mongoose.Schema;

var statisticSchema = mongoose.Schema({
  date: { type: Date, default: Date.now },
  message: String,
  reqSent: Number,
  maxReqSec: Number
})

var Statistic = mongoose.model('Statistic', statisticSchema);

module.exports = {
  closeConnection: function() {
    mongoose.connection.close()
  },
  createStatistic: function(message, reqSent, maxReqSec, cb){
    var stat = new Statistic({message: message, reqSent: reqSent, maxReqSec: maxReqSec})
    stat.save(function (err, product, numAffected) {
      if (err) {
        console.log('error', err);
      }

      cb();
    });
  }
}
