var Twitter = require('twitter');
var request = require('request');
var https = require('https');
var Twit = require('twit');
var randomstring = require('randomstring');

var con_key = 'BiyGtBQAASztWUA0YW73OTdWA';
var con_sec = 'Xtglunu4XHppVsorIkXuGHTRCkEC7V1eIZQqXfQU1KmvrFUT2g';
var token_key = '739792147545657347-lA2Lmegk1HsdpzyG7TFJkYNSJzTK7C7';
var token_secret = 'H3RIKHBlWsoiLJKbC4L3OUZuOoMCgrISBXqFtPituJyW7';

var con_key2 = 'vm4zteHDsQQ5o7hYyErympb4I';
var con_sec2 = 'Roir0k91Ltc02BVrfMLYZrWhmAvkc9FsOObtgemomiwQ6nY8ML';
var token_key2 = '739792147545657347-Blzmh5GZxV1HhqZDF6SdTCQR17lRIHg';
var token_secret2 = 'FIwmyNhB8l20HglGm28MhHzZywSeNJFKmWda16h4rcMdp';

var clientExpediaChat1 = new Twitter({
  consumer_key: con_key2,
  consumer_secret: con_sec2,
  access_token_key: token_key2,
  access_token_secret: token_secret2
});


var clientExpediaChat2 = new Twitter({
  consumer_key: con_key2,
  consumer_secret: con_sec2,
  access_token_key: token_key2,
  access_token_secret: token_secret2
});



var T = new Twit({
  consumer_key: con_key2,
  consumer_secret: con_sec2,
  access_token: token_key2,
  access_token_secret: token_secret2
})

var destinations = {'Bahamas' : 'BH','Caribbean' : 'EC','Alaska' : 'A' };

var month = {'january' : '2017-01-01','february' : '2017-02-01','march' : '2017-03-01'
,'april' : '2017-04-01','may' : '2017-05-01','june' : '2017-06-01','july' : '2016-07-01'
,'august' : '2016-08-01','september' : '2016-09-01','october' : '2016-10-01','november' : '2016-11-01','december' : '2016-12-01'}

var month_key = {'jan' : '2017-01-01','feb' : '2017-02-01','mar' : '2017-03-01'
,'apr' : '2017-04-01','may' : '2017-05-01','jun' : '2017-06-01','july' : '2016-07-01'
,'aug' : '2016-08-01','sept' : '2016-09-01','oct' : '2016-10-01','nov' : '2016-11-01','dec' : '2016-12-01'}

/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 **/

var chatHistory = [];

clientExpediaChat1.stream('statuses/filter', {track: '@expchatbot '},  function(stream) {
  stream.on('data', function(tweet) {

    console.log("################# Expedia Chat Bot ###############")
    console.log(tweet.text);
    console.log(tweet.user);

    if (contains(chatHistory,tweet.in_reply_to_status_id_str)){

      var ses_id = '';
      var index = 0;

      for(var i= 0 ; i < chatHistory.length;i++){
        if(chatHistory.latest_id = tweet.in_reply_to_status_id_str){
          ses_id = chatHistory[i].witSessionId;
          index = i;
        }
      }

      console.log("Session Id is " + ses_id );

      request({
        url: 'https://api.wit.ai/converse', //URL to hit
        qs: {v: '20160526', session_id : ses_id,q : tweet.text.substring(12)}, //Query string data
        method: 'POST',
        headers: {'Authorization': 'Bearer KB7WPHYI4572VEVGZP4SKUADCLPRVWLO', 'Content-Type': 'application/json', 'Accept': 'application/json'}
        }, function(error, response, body){
            if(error) {
              console.log(error);
            } else {
              console.log(response.statusCode, body);

              var respObj = JSON.parse(body);

              var entities = respObj.entities;

              var obj_key = Object.keys(entities)[0];

              console.log(obj_key)

              console.log(entities[obj_key])
              var obj_val = entities[obj_key][0]["value"];

              var str = "{" + '"' + obj_key  + '"' + ":" + '"' + obj_val + '"' + "}";

              request({
                url: 'https://api.wit.ai/converse', //URL to5 hit
                qs: {v: '20160526', session_id : ses_id}, //Query string data
                method: 'POST',
                headers: {'Authorization': 'Bearer KB7WPHYI4572VEVGZP4SKUADCLPRVWLO', 'Content-Type': 'application/json', 'Accept': 'application/json'},
                body : str
              },function(error,response,body){
                console.log(response.statusCode,body);
                var userObj = JSON.parse(body);
                var nameID = tweet.id_str;
                var name = tweet.user.screen_name;
                var reply = userObj.msg;
                T.post('statuses/update', {in_reply_to_status_id: nameID, status: ' @' + name + ' ' + reply}, function(err, data, response) { 
                  console.log(data);
                  chatHistory[index].latest_id = data.id_str;
                });
              });

            }
      });

    }
});

  stream.on('error', function(error) {
    console.log(error);
  });
});

var dataString = 'status=Maybe+he%27ll+finally+find+his+keys.+%23peterfalk';

var options = {
    url: 'https://api.twitter.com/1.1/statuses/update.json',
    method: 'POST',
    body: dataString
};

clientExpediaChat2.stream('statuses/filter', {track: 'Cruise 0QnF1'},  function(stream) {
  stream.on('data', function(tweet) {
    //console.log(tweet.text);
    console.log(tweet);

    var nameID = tweet.id_str;

    var text = tweet.text;

    if(text.includes('bahamas') || text.includes('caribbean') || text.includes('alaska')){

      console.log('I am here');

      var dest = text.includes('bahamas') ? 'bahamas' : (text.includes('caribbean') ? 'caribbean' : 'alaska' );

      var date = '';

        for (var key in month){
          if(text.toLowerCase().includes(key)){
          date = month[key]
          console.log("found" + key + " " + date)
          }
        }

        if(date === ''){
          for (var key in month_key){
            if(text.toLowerCase().includes(key)){
              date = month_key[key]
              console.log("found" + key + " " + date)
            }
          }
        }

      var reply = '';

      var rand_str = randomstring.generate(7);

        request({
                url: 'https://api.wit.ai/converse', //URL to5 hit
                qs: {v: '20160526', session_id : rand_str , text : "I would like a trip to " + dest}, //Query string data
                method: 'POST',
                headers: {'Authorization': 'Bearer KB7WPHYI4572VEVGZP4SKUADCLPRVWLO', 'Content-Type': 'application/json', 'Accept': 'application/json'}
              },function(error,response,body){
                console.log(body);
              request({
                url: 'https://api.wit.ai/converse', //URL to5 hit
                qs: {v: '20160526', session_id : rand_str}, //Query string data
                method: 'POST',
                headers: {'Authorization': 'Bearer KB7WPHYI4572VEVGZP4SKUADCLPRVWLO', 'Content-Type': 'application/json', 'Accept': 'application/json'},
                body : '{"dest":'+'"'+dest+'"'+'}'
              },function(error,response,body){
                console.log(body);
                var respBody = JSON.parse(body);
                reply = respBody.msg;

                var name = tweet.user.screen_name;

      console.log('tweeting this' + reply);

      T.post('statuses/update', {in_reply_to_status_id: nameID, status: ' @' + name + ' ' + reply}, function(err, data, response) { 
        console.log(data);

        var newChat = new Object();
        newChat.latest_id = data.id_str;
        newChat.status = 0;
        newChat.witSessionId = rand_str;

        chatHistory.push(newChat)

      });
              }); 

              });
    }
});

  stream.on('error', function(error) {
    console.log(error);
  });
});

function contains(arr,id_str){
  console.log("############### searchin id : " + id_str)
  console.log("############### array " + arr)

  for(var i = 0 ; i < arr.length ; i++){
    console.log("arr val is " + arr[i].latest_id)
    if(arr[i].latest_id === id_str)
      return true;
  }

  return false;
}

var dataString = 'status=Maybe+he%27ll+finally+find+his+keys.+%23peterfalk';

var options = {
    url: 'https://api.twitter.com/1.1/statuses/update.json',
    method: 'POST',
    body: dataString
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
}


//request(options, callback);