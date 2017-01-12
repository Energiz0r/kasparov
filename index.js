var tester = require('./tester.js');
var auth = require('./authenticator.js');
var _ = require('lodash');
// var site = 'http://osl-c-sh-s/Pureservice/';
// var site = 'http://localhost:4444/';
// var site = 'http://canary.pureservice.com/agent/';
var interval = 1;
var count = 10;
var threads = 1;
var firstCommand = process.argv[2];

var getSite = function(env){
  switch (env) {
    case 'canary':
      return 'https://canary.pureservice.com/agent/'
      break;
    case 'siggen':
      return 'https://osl-c-sh-s/Pureservice/'
    case 'local':
      return 'http://localhost:4444/'
      break;
    default:

  }
}

var parseCLA = function(arguments){
  for (var i = 2; i < arguments.length; i++) {
    var command = _.split(arguments[i], '=')[0];
    var value = _.split(arguments[i], '=')[1];

    if (command === 'threads') {
      threads = value;
    } else if(command === 'interval') {
      interval = value;
    } else if(command === 'count'){
      count = value;
    } else if (command === 'env') {
      environment = value
    } else{
      throw new Error('Specify only correct commands (you typed: ' + command +'), -help for commands')
    }
  }
}

if (firstCommand === '-help') {
  console.log('You can define 3 parametrs');
  console.log('thread=2 fires up 2 threads. (default 1)');
  console.log('count=1000 fires 1000 tests on each thread. (default 10)');
  console.log('interval=100 fires hundred test each second. (default 1)');
} else {
  parseCLA(process.argv);

  auth.getToken(getSite(environment), function(err, token){
    tester.test(threads, count, interval, token, getSite(environment));
  });
}
