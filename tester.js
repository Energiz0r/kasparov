var child_process = require('child_process');
var numCPUs = require('os').cpus();
var _ = require('lodash');
var dbHandler = require('./dbHandler.js')
var calculations = require('./calculations.js')

var times = [];
var requestTimes = [];
var requestsSent = 0;
var reqsPrSec = [];
var childrenSpawned = 0;
var start;
var rate;
var message;
var childsDone = 0;

var test = function(threads, numberOfTests, interval, token, site, providedMessage) {
  rate = parseInt(threads)*parseInt(interval);
  childrenSpawned = threads;
  message = providedMessage;

  if (threads >= numCPUs.length) {
    threads = numCPUs.length-1;
  }
  console.log('Nuking ' + site + ' at a rate of ' + rate + ' Requests / Second');
  for (var i = 0; i < threads; i++) {
    var child = child_process.fork(__dirname + '/worker.js', [numberOfTests, interval, token, site]);

    child.on('close', function () {
        childDone();
    });

    child.on('message', function(message){
     var code = _.split(message, '$')[0];
     message = _.split(message, '$')[1];
     var reqsPrSecond = calculations.requestsPrSecond(start, new Date().getTime(), requestsSent).toFixed(2);
     switch (code) {
       case '1':
         var split = _.split(message, '___');
         var xpsactiontime = split[0];
         times.push(calculations.extractMsFromDateTime(xpsactiontime));
         requestTimes.push(parseInt(split[1]));
         reqsPrSec.push(reqsPrSecond)
         end = new Date().getTime();
         updateConsoleText(reqsPrSecond);
         break;
       case '2':
       if (requestsSent === 0) {
         start = new Date().getTime();
       }
        requestsSent++;
        updateConsoleText(reqsPrSecond);
       break;
       default:
     }
    })
  }
};

var getMaxActionTime = function(){
  if (times.length > 0) {
    return _.max(times).toFixed(2)
  }
  return 0;
}
var updateConsoleText = function(reqsPrSecond){
  process.stdout.write('sent/received: ' + requestsSent + '/' + times.length + ' reqSent/sec: ' + reqsPrSecond +
                       ' AVG-AC-TIME: ' + _.mean(times).toFixed(2) + '  AVG-REQ-TIME: ' + _.mean(requestTimes).toFixed(2) +
                       ' MAX-AC: ' + getMaxActionTime() + '                                     \r')
};

var childDone = function(){
  childsDone++;

  if (childsDone >= childrenSpawned) {
    var reqprsec = calculations.requestsPrSecond(start, new Date().getTime(), times.length).toFixed(2);
    console.log('\nTotal average ActionTime: ' + _.mean(times).toFixed(2) + ' milliseconds');
    // console.log('Total average RequestTime: ' + _.mean(requestTimes).toFixed(2) + ' milliseconds');
    console.log('Total readings: ' + times.length);
    console.log('ACTION-REC/SEC: ' + reqprsec);
    console.log('Response pr sec is ' + ((reqprsec/rate)*100).toFixed(2) +'% of Requests pr second sent');

    dbHandler.createStatistic(message, requestsSent, reqprsec, function(){
      dbHandler.closeConnection();
    });
  }
};

module.exports = {
  test: test
}
