"use strict";

var twit   = require("twit");
var tokens = require("./tokens.js");
var config = require("./config.js");

var api = new twit(tokens);
var hashtags = "#" +config.hashtags.join(" #");

/**
 * Main method, responsible for the actual API call.
 */
function tweet() {
	var params = {
		status: getRandomQuote() + " " + hashtags
	}

	api.post("statuses/update", params, function(err, data, response) {
		if (err || response.statusCode !== 200) {
			console.error("Unable to post to Twitter.", err);
			return;
		}

		console.log("Tweet posted successfully at " + data.created_at + ".");
		console.log("Url: ", "https://twitter.com/" + data.user.screen_name + "/status/" + data.id_str);
	});
}

/**
 * Gets a random quote from config.js according to the probability specified.
 */
function getRandomQuote() {
	var random = Math.random();
	var noQuoteProb = 1 - config.quote_probability;

	if (random < (noQuoteProb / 2)) {
		return "AND HIS NAME IS JOHN CENA!";
	}
	else if (random < noQuoteProb) {
		return "THE CHAMP IS HERE!";
	}
	else {
		return config.quotes[getRandom(0, config.quotes.length - 1)];
	}
}

/**
 * Auxiliar, from Mozilla's JS examples. Gets a random int between min and max (both inclusive).
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

tweet();