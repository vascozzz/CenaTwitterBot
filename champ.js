"use strict";

var fs 			 = require("fs");
var twit   		 = require("twit");
var googleImages = require("google-images");
var request      = require("request");
var tokens 		 = require("./tokens.js");
var config 		 = require("./config.js");

var api 	     = new twit(tokens.twitter);
var hashtags     = "#" +config.hashtags.join(" #");

var images       = new googleImages(tokens.google.search_engine_id, tokens.google.search_engine_api_key);

/**
 * Main method, responsible for the actual API call.
 */
function tweet() {
	getRandomMediaUrl().then(function(res) {
		var url = res[getRandom(0, res.length -1)].url;

		request.get(url).pipe(fs.createWriteStream("tmp")).on("close", function() {
			var img = fs.readFileSync("tmp", {encoding: "base64"});

			var params = {
				media_data: img
			};

			api.post("media/upload", params, function(err, data, response) {
				params = {
					status: getRandomQuote() + " " + hashtags,
					media_ids: [data.media_id_string]
				};

				api.post("statuses/update", params, function(err, data, response) {
					if (err || response.statusCode !== 200) {
						console.error("Unable to post to Twitter.", err);
						return;
					}

					console.log("Tweet posted successfully at " + data.created_at + ".");
					console.log("Url: ", "https://twitter.com/" + data.user.screen_name + "/status/" + data.id_str);
				});
			});
		});
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
 * Gets the url for a random media object featuring John Cena.
 */
function getRandomMediaUrl() {
	var params = {
		page: getRandom(1, 50),
		size: "medium",
		safe: "medium"
	};

	return images.search("john cena", params);
}

/**
 * Auxiliar, from Mozilla's JS examples. Gets a random int between min and max (both inclusive).
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

tweet();