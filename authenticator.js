var request = require("request");
var login = require("./login.json");

var getToken = function(site, username, password, callback){
  request({
      url: site + 'api/Authentication?username='+ username +'&password='+ password +'&Role=30',
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
