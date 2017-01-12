var request = require("request");

var getToken = function(site, callback){

  request({
      url: site + 'api/Authentication?username=sh@syscomworld.com&password=SåmerFezd79&Role=30',
      // qs: {from: 'blog example', time: +new Date()}, //Query string data
      method: 'POST', //Specify the method
      json: true,
      headers: { //We can define headers too
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

  //
  // request.post({
  //   url: site + 'api/Authentication?username=sh@syscomworld.com&password=S%C3%A5merFezd79&Role=30',
  //   proxy: "http://127.0.0.1:8888",
  //   headers: {
  //     // 'Content-Type': 'application/json; charset=utf-8',
  //     'Accept-Encoding': 'gzip, deflate',
  //     'Accept-Language': 'en-US,en;q=0.8',
  //     // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
  //     // 'Accept' : '*/*',
  //     'Content-Type': 'application/vnd.api+json',
  //     'Accept': '*/*',
  //
  //   }
  // }, function (error, response, body) {
  //     if (!error && response.statusCode == 200) {
  //       console.log(body);
  //       callback(null, body);
  //     } else {
  //       console.log('statusCode', response.statusCode);
  //       console.log('body', body);
  //       callback(response.statusCode, error);
  //     }
  //   }
  // );
};


module.exports = {
  getToken: getToken
}
