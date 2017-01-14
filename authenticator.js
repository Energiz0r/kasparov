var request = require("request");
var login = require("./login.json");

if(!login){
  throw new Error("You are missing a login.json file with usernames and password.")
}

var getToken = function(site, environment, callback){
  var un = login[environment].username;
  var pass = login[environment].password;
  request({
      url: site + 'api/Authentication?username='+un+'&password='+pass+'&Role=30',
      method: 'POST',
      json: true,
      headers: {
          'Content-Type': 'application/vnd.api+json',
          'Accept': '*/*',
      }
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
          callback(null, body);
        } else {
          console.log('statusCode', response.statusCode);
          console.log('body', body);
          callback(response.statusCode, error);
        }
  });
};

module.exports = {
  getToken: getToken
}
