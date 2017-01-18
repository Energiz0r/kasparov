var _ = require('lodash');

var reqPrSec = function(start, end, requests){
  var ms = end - start;
  var sec = ms/1000;
  return requests/sec;
};

var extractMsFromDateTime = function(datetime){
  var split = _.split(datetime, '.');
  var milliseconds = parseFloat('0.'+split[1]) * 1000;
  var rest = split[0];
  split = _.split(rest, ':')
  var hours = parseFloat(split[0]);
  var minutes = parseFloat(split[1]);
  var seconds = parseFloat(split[2]);
  return (hours*60*60*1000) + (minutes*60*1000) + (seconds*1000) + milliseconds;
}

module.exports = {
  requestsPrSecond: reqPrSec,
  extractMsFromDateTime: extractMsFromDateTime
}
