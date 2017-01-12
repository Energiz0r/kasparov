var request = require("request");

var max = process.argv[2];
var interval = (1000/parseInt(process.argv[3]));
var token = process.argv[4];
var site = process.argv[5];

var numberOfTestsRan = 0;
var requestSent = 0;

var waiter = function(){
  if (numberOfTestsRan >= max) {
    return;
  }
  setTimeout(function(){
    r();
    numberOfTestsRan++;
    waiter();
  }, interval)
};

var r = function(){
  var randomUrl = getRandomUrl();
  process.send('2$Request sent!');

  request.get({
    url: randomUrl,
    encoding:'utf8',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'Authorization': 'Bearer ' + token,
      'Accept' : '*/*'
    }
  }, function (error, response, body, d) {
      if (!error && response.statusCode == 200) {
        process.send('1$' + response.headers['x-ps-actiontime'] + '___' + response.headers['x-ps-requesttime']);
      } else {
        if (response && response.statusCode) {
          console.log('statusCode: ' + response.statusCode);
          console.log('body: ' + body);
        } else {
          console.log('Zomg, response null!');
        }
      }
    }
  );
};

var getRandomUrl = function(){
  var urls = [
    // 'api/ticket/2/requestNumber?include=assignedAgent,user,user.phonenumber,user.phonenumbers,user.emailAddress,user.emailAddresses,user.address,user.company,user.memberships,form,form.datas,tasks',
    // 'api/ticket/4/requestNumber?include=assignedAgent,user,user.phonenumber,user.phonenumbers,user.emailAddress,user.emailAddresses,user.address,user.company,user.memberships,form,form.datas,tasks',
    // 'api/ticket/9/requestNumber?include=assignedAgent,user,user.phonenumber,user.phonenumbers,user.emailAddress,user.emailAddresses,user.address,user.company,user.memberships,form,form.datas,tasks',
    // 'api/ticket/7/requestNumber?include=assignedAgent,user,user.phonenumber,user.phonenumbers,user.emailAddress,user.emailAddresses,user.address,user.company,user.memberships,form,form.datas,tasks',
    'api/status',
    'api/user?include=emailAddresses,phonenumbers,memberships,memberships.team,credentials,address,emailAddress,phonenumber&id=30',
    'api/user/1?include=memberships,credentials,address,emailAddress,emailAddresses,phonenumber,phonenumbers',
    'api/listdefinition'
  ];
  var randomIndex = getRandomInt(0, urls.length-1);
  return site + urls[randomIndex]
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

waiter();
