<?php

var_dump('dsgdsggsgsg');

session_start();
date_default_timezone_set('UTC');
require_once("twitteroauth/twitteroauth.php"); //Path to twitteroauth library
 
$twitteruser = "thirkettle";
$notweets = 5;
$consumerkey = "8ql1jNi6xp87NiDf1C91DQ";
$consumersecret = "gQ0WrR7dA8UVB5QfBfXWdH58IWkCsvz8CdsOPFj5q4";
$accesstoken = "18982113-3ocQ7fUy0KJqpoyQfKPuag9yXQarRFcm3YhznvgH0";
$accesstokensecret = "bf8WS89q2tGhn4OvTKEEFha491K5799siYeg7TPFipNnm";
 
function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
  return $connection;
}
 
$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);
 
$tweets = $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=".$twitteruser."&count=".$notweets);

foreach ($tweets as $tweet) {
  if (array_key_exists("created_at", $tweet)) {
    $tweet->created_at = strtotime($tweet->created_at);
  }
}

echo json_encode($tweets);
?>