# Bot Framework mInsights SDK.
## How to setup
- Register the bot at insights portal.
- Get bot token and bot reference from the portal.
- set them as your environment variables, like below.
```js
process.env.M_INSIGHTS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTYyMDk3YTVmYzZiNzY5ZjBkOTQ2NjIiLCJjcmVhdGVkQXQiOiIyMDE4LTAxLTE5VDE1OjA2OjM0LjUzNVoiLCJpYXQiOjE1MTYzNzQzOTR9.dXfFfD4S8jYFfcnmyygEToYowVCRxTPUOV-0YBuoML8";
process.env.M_INSIGHTS_REF = "fb851456ffe94e44f7232084cc3edc30";
```
Make sure you name the variables precisely as to what is shown here.

- import and initialize the insights module in your file as shown below.
```js
var insightsModule = require('./_insights/insights_logger');
var insight = new insightsModule();
```

- set up a middleware that will call the `insight.logMessage()` function with every intercepted message.
```js
bot.use({
  botbuilder: function(session, next){
    insight.logMessage(session);
    next();
  },
  send: function(event, next){
    insight.logMessage(event);
    next();
  }
});
```
##### And that's it!
