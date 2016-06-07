var Twitter = require('twitter');
var request = require('request');
var https = require('https');
var Twit = require('twit');

var clientExpediaChat = new Twitter({
  consumer_key: '6JbfAfp2Cvo6LcnKu0EN86umj',
  consumer_secret: 'kETKP4gTGQK2ty7EMmCstNNmFFmAylF4fUnPnlhnM8Bqe0PmhK',
  access_token_key: '739792147545657347-4TUnnjrWv1fkYXu28nj0nimwuPlauUt',
  access_token_secret: 'mA4Vp2pMuofDR7sesDONHaNCb6gXsY9s5AvDGD46IX91N'
});

var T = new Twit({
  consumer_key: '6JbfAfp2Cvo6LcnKu0EN86umj',
  consumer_secret: 'kETKP4gTGQK2ty7EMmCstNNmFFmAylF4fUnPnlhnM8Bqe0PmhK',
  access_token: '739792147545657347-4TUnnjrWv1fkYXu28nj0nimwuPlauUt',
  access_token_secret: 'mA4Vp2pMuofDR7sesDONHaNCb6gXsY9s5AvDGD46IX91N'
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

clientExpediaChat.stream('statuses/filter', {track: '@expchatbot '},  function(stream) {
  stream.on('data', function(tweet) {

    console.log("###################Expedia Chat Bot ###############")
    console.log(tweet.text);
    console.log(tweet.user);

    if (contains(chatHistory,tweet.in_reply_to_status_id_str)){

    console.log('calling wit api');

     var options = {
        hostname : 'api.wit.ai',
        path : '/converse?v=20160526&session_id=123457abc&q=I%20would%20like%20a%20trip%20to%20Bahamas.',
        method : 'POST',
        headers : {'Authorization': 'Bearer KB7WPHYI4572VEVGZP4SKUADCLPRVWLO', 'Content-Type': 'application/json', 'Accept': 'application/json'}
      };

      var respBody = '';

      var req = https.request(options, (resp) => {
        console.log("#########hahahajdjkshkdjh ###########");
        //console.log(resp);

        resp.on('data', (d) => {
          respBody += d;
          
        });

        resp.on('end', () => {
          console.log(respBody);

          var respObj = JSON.parse(respBody);

          var entities = respObj.entities;

          var obj_key = Object.keys(entities)[0];

          var obj_val = entities.obj_key.value;

          console.log("########fetching values");

          console.log(obj_key +  " " + obj_val)

          var options = {
                hostname : 'api.wit.ai',
                path : '/converse?v=20160526&session_id=123457abc&q=I%20would%20like%20a%20trip%20to%20Bahamas.',
                method : 'POST',
                headers : {'Authorization': 'Bearer KB7WPHYI4572VEVGZP4SKUADCLPRVWLO', 'Content-Type': 'application/json', 'Accept': 'application/json'}
              };

        });
        
      });

      req.end();

      // extract text // send to wit

      // wit reply.



      // var nameID = tweet.id_str;
      // reply = "sample1";

      // T.post('statuses/update', {in_reply_to_status_id: nameID, status: ' @' + name + ' ' + reply}, function(err, data, response) { 
      //   console.log(data);

      // })

      //

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

clientExpediaChat.stream('statuses/filter', {track: 'Cruise 0QnF1'},  function(stream) {
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

      // if(date === ''){
      //   reply = "https://www.expedia.com/Cruise-Search?destination="+dest+"&earliest-departure-date=2016-07-01";       
      // }else{
      //   reply = "https://www.expedia.com/Cruise-Search?destination="+dest+"&earliest-departure-date="+date;
      // }     

      reply = "Would you like a trip to " + dest;

      var name = tweet.user.screen_name;

      console.log('tweeting this' + reply);

      T.post('statuses/update', {in_reply_to_status_id: nameID, status: ' @' + name + ' ' + reply}, function(err, data, response) { 
        console.log(data);

        var newChat = new Object();
        newChat.latest_id = data.id_str;
        newChat.status = 0;
        newChat.witSessionId = data.id_str;

        chatHistory.push(newChat)

      })
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