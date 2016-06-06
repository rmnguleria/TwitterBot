var Twitter = require('twitter');
var request = require('request');
var Twit = require('twit');

var client = new Twitter({
  consumer_key: 'zajBQQiuMrXRpkwxcJIah0QnF',
  consumer_secret: 't0rxbO3BTxjhH6bKSOshvClWROxyhGoZ7OmlqpUbYNnsyowXmX',
  access_token_key: '2599940893-Rh6LLjk2RbNlWhxtXU4ap8lOIuMPclSRTX9Ldew',
  access_token_secret: 'kcAJ9CAv2ogV1nNLDep710Sb9yK8izSZq4RWM2eTkbd6v'
});

var T = new Twit({
  consumer_key:         'zajBQQiuMrXRpkwxcJIah0QnF',
  consumer_secret:      't0rxbO3BTxjhH6bKSOshvClWROxyhGoZ7OmlqpUbYNnsyowXmX',
  access_token:         '2599940893-Rh6LLjk2RbNlWhxtXU4ap8lOIuMPclSRTX9Ldew',
  access_token_secret:  'kcAJ9CAv2ogV1nNLDep710Sb9yK8izSZq4RWM2eTkbd6v',
})


/* client.get('search/tweets', {q: 'Expedia Cruise zajBQQiuMrXRpkwxcJIah0QnF'}, function(error, tweets, response) {
   var statuses = tweets.statuses;

   for(var i = 0 ; i<statuses.length;i++){
   	console.log(statuses[i].text);
   	console.log(statuses[i].user.screen_name);

   }

}); */

var destinations = {'Bahamas' : 'BH','Caribbean' : 'EC','Alaska' : 'A' };

/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 **/
client.stream('statuses/filter', {track: 'Cruise 0QnF'},  function(stream) {
  stream.on('data', function(tweet) {
    console.log(tweet.text);
    console.log(tweet.user);

    var nameID = tweet.id_str;

    var text = tweet.text;

    if(text.includes('bahamas') || text.includes('caribbean') || text.includes('alaska')){

      console.log('I am here');

      var dest = text.includes('bahamas') ? 'bahamas' : (text.includes('caribbean') ? 'caribbean' : 'alaska' );

      var reply = "https://www.expedia.com/Cruise-Search?destination="+dest+"&earliest-departure-date=2016-07-01";

      var name = tweet.user.screen_name;

      console.log('tweeting this' + reply);

      T.post('statuses/update', {in_reply_to_status_id: nameID, status: ' @' + name + ' ' + reply}, function(err, data, response) { 
        console.log(data);
      })
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

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
}

//request(options, callback);