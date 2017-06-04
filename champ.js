"use strict";

var twit   = require("twit");
var tokens = require("./twitter_config.js");

console.log(tokens);

var api = new twit(tokens);

api.post("statuses/update", { status: "cena demo" }, function(err, data, response) {
	console.log(data);
});