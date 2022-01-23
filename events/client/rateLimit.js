//here the event starts
const { events: { rateLimit } } = require("../../botconfig/settings.json");
module.exports = (client, rateLimitData) => {
    if(rateLimit) {
        console.log(JSON.stringify(rateLimitData).grey)
    }
}
/**
  * @INFO
  * Bot Coded by Tomato#6966 | https://discord.gg/milrato
  * @INFO
  * Work for Milrato Development | https://milrato.eu
  * @INFO
  * Please mention him / Milrato Development, when using this Code!
  * @INFO
*/
