var child_process = require('child_process');
var numCPUs = require('os').cpus();
var _ = require('lodash');

var runTests = true;
var numberOfTestsRan = 0;

var times = [];
var requestTimes = [];
var requestsSent = 0;
var childrenSpawned = 0;
var start = new Date().getTime();
var rate;
var addtime = function(time){
  var split = _.split(time, '.');
  var milliseconds = parseFloat('0.'+split[1]) * 1000;
  var rest = split[0];
  split = _.split(rest, ':')
  var hours = parseFloat(split[0]);
  var minutes = parseFloat(split[1]);
  var seconds = parseFloat(split[2]);
  var totalMs = (hours*60*60*1000) + (minutes*60*1000) + (seconds*1000) + milliseconds;
  times.push(totalMs);
};

var avgTimeLast100 = function(){
  var last100 = _.slice(times, times.length-100, times.length)
  var total = 0;

  _.forEach(last100, function(value){
    total += value;
  })

  return total/last100.length;
}

var reqPrSec = function(start, end, requests){
  var ms = end - start;
  var sec = ms/1000;
  return requests/sec;
};

var childsDone = 0;
var childDone = function(){
  childsDone++;

  if (childsDone >= childrenSpawned) {
    var reqprsec = reqPrSec(start, new Date().getTime(), times.length).toFixed(2);
    console.log('\nTotal average ActionTime: ' + _.mean(times).toFixed(2) + ' milliseconds');
    console.log('Total average RequestTime: ' + _.mean(requestTimes).toFixed(2) + ' milliseconds');
    console.log('Total readings: ' + times.length);
    console.log('ACTION-REC/SEC: ' + reqprsec);
    console.log('Server able to take away ' + ((reqprsec/rate)*100).toFixed(2) +'% of the requests');
  }
};

var test = function(threads, numberOfTests, interval, token, site) {
  rate = parseInt(threads)*parseInt(interval);
  if (threads >= numCPUs.length) {
    threads = numCPUs.length-1;
  }
  childrenSpawned = threads;
  console.log('Nuking ' + site + ' at a rate of ' + rate + ' Requests / Second');
  console.log('Starting ' + threads + ' thread(s), running ' + numberOfTests +' tests at an interval of ' + interval + ' tests/pr second.');

  for (var i = 0; i < threads; i++) {
    var child = child_process.fork(__dirname + '/worker.js', [numberOfTests, interval, token, site]);

    child.on('close', function () {
        childDone();
     });

     child.on('message', function(message){
       var code = _.split(message, '$')[0];
       message = _.split(message, '$')[1];
       switch (code) {
         case '1':
           var split = _.split(message, '___');
           addtime(split[0]);
           requestTimes.push(parseInt(split[1]));
           end = new Date().getTime();
           process.stdout.write('reqSent/sec: ' + reqPrSec(start, new Date().getTime(), requestsSent).toFixed(2) +
                                ' AVG-AC-TIME: ' + _.mean(times).toFixed(2) + '  AVG-REQ-TIME: ' + _.mean(requestTimes).toFixed(2) +
                                ' MAX-AC: ' + _.max(times).toFixed(2) + ' MAX-REQ: ' + _.max(requestTimes)
                                + '                                     \r')
           break;
         case '2':
          requestsSent++;
         break;
         default:
       }
     })
  }
};

module.exports = {
  test: test
}
