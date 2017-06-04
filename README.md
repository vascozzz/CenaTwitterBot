# CenaTwitterBot

A simple Twitter bot featuring the one and only, created for fun as an afternoon experiment.

## Usage

Copy `tokens_default.js`, rename it as `tokens.js`, and fill in each key.

```javascript
{
	twitter: {
		consumer_key: "",
		consumer_secret: "",
		access_token: "",
		access_token_secret: ""
	},
	google: {
		search_engine_id: "",
		search_engine_api_key: ""
	}
}
```

After running `npm start`, the bot will start tweeting according to the interval specific in `config.js`. Each tweet features a random quote and image.

## Todo

Consider implementing proper interactions. Would be interesting to follow users or favorite tweets that fall within certain categories (hashtag search could be a start).
