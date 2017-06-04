"use strict";

var fs 			 = require("fs");
var twit   		 = require("twit");
var googleImages = require("google-images");
var request      = require("request");
var tokens 		 = require("./tokens.js");
var config 		 = require("./config.js");

var hashtags = "#" +config.hashtags.join(" #");

var api = new twit(tokens.twitter);

var images = new googleImages(
	tokens.google.search_engine_id, 
	tokens.google.search_engine_api_key
);

tweet();

setInterval(function() {
	try {
		tweet();
	}
	catch (err) {
		console.error(err);
	}
}, config.tweet_interval * 1000);

/**
 * Chaining method responsible for the whole tweeting process.
 */
function tweet() {
	getRandomImageItems()
		.then(downloadRandomImage)
		.then(postMedia)
		.then(postTweet)

		.then((result) => {
			var data = result.data;
			console.log("Tweet posted successfully at " + data.created_at + ".");
			console.log("Url: ", "https://twitter.com/" + data.user.screen_name + "/status/" + data.id_str);
		})

		.catch((err) => {
			console.error("Unable to post to Twitter.", err);
		});
}

/** 
 * Uploads a media file to Twitter.
 * @param {string} filename - path to the media file that will be uploaded.
 */
function postMedia(filename) { 
	var params = {
		media_data: fs.readFileSync(filename, {encoding: "base64"})
	};

	return api.post("media/upload", params);
}

/** 
 * Tweets a random quote with a reference to the media object provided.
 * @param {Object} mediaObj - response from a media upload request.
 */
function postTweet(mediaObj) {
	var mediaId = mediaObj.data.media_id_string;
	var params = {
		status: getRandomQuote() + " " + hashtags,
		media_ids: [mediaId]
	};

	return api.post("statuses/update", params);
}

/**
 * Gets a collection of up to 10 images featuring John Cena.
 */
function getRandomImageItems() {
	var imgSize = Math.random() < 0.5 ? "medium" : "large";
	var page = getRandom(1, 50);
	var params = {
		page: page,
		size: imgSize,
		safe: "medium"
	};

	return images.search("john cena", params);
}

/** 
 * Downloads a random image from the collection provided and saves it as "tmp" to 
 * the project's directory.
 * @param {Object} items - collection of image data (note that each item must have an url field).
 */
function downloadRandomImage(items) {
	return new Promise((resolve, reject) => {
		if (items) {
			var filename = "tmp";
			var url = items[getRandom(0, items.length -1)].url;

			request.get(url).pipe(fs.createWriteStream(filename)).on("close", function() {
				resolve(filename);
			});
		}
		else {
			reject(new Error("Unable to get url. No media objects found."));
		}		
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