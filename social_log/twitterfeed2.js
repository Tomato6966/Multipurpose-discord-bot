const twitconfig = require("./twitter.json")
const Twit = require('twit')
const { databasing, delay } = require('../handlers/functions');

module.exports = async (client) => {
  return true;
}
async function create_twit(client){/*
      //ensure the db for each guild
      for (const guild of [...client.guilds.cache.values()]) databasing(client, guild.id)
      //get all userids from the db
      console.log(client.social_log.filterArray(value => value.secondtwitter))
      var userids = client.social_log.filterArray(value => value.secondtwitter.TWITTER_USER_NAME_ONLY_THOSE.length > 2).map(value => `${value.secondtwitter.TWITTER_USER_NAME_ONLY_THOSE}`)
      //if no userids return
      if(!userids || userids.length == 0) return
      //create a new TWIT
      var T = new Twit({
        consumer_key: twitconfig.consumer_key,
        consumer_secret: twitconfig.consumer_secret,
        access_token: twitconfig.access_token,
        access_token_secret: twitconfig.access_token_secret,
        timeout_ms: twitconfig.timeout_ms, 
        strictSSL: twitconfig.strictSSL, 
      })
      for await (const user of userids){
        await T.get('search/tweets', { q: `from:${user}`, count: 1 }, function(err, data, response) {
          if(err) return console.log(err)
          //define some twitter only variables
          if(!data || !data.statuses[0] || !data.statuses[0].user) return;
          var tweet = data.statuses[0];
          var TwitterName = tweet.user.screen_name;
          var url = "https://twitter.com/" + TwitterName + "/status/" + tweet.id_str;
          //get the guildid for the twitter account
          var guildid = client.social_log.findKey("secondtwitter.TWITTER_USER_ID", tweet.user.id_str)
          //get the settings from the guildid
          if(!guildid || guildid == null || guildid == undefined || guildid.length != 18) return;

          try{
            client.social_log.ensure(guildid, {
            twitter: {
              TWITTER_USER_ID: "",
              TWITTER_USER_NAME_ONLY_THOSE: "",
              DISCORD_CHANNEL_ID: "",
              latesttweet: "",
              REETWET: false,
              infomsg: "**{Twittername}** posted a new Tweet:\n\n{url}"
            },
            twitter2: {
              TWITTER_USER_ID: "",
              TWITTER_USER_NAME_ONLY_THOSE: "",
              DISCORD_CHANNEL_ID: "",
              latesttweet: "",
              REETWET: false,
              infomsg: "**{Twittername}** posted a new Tweet:\n\n{url}"
            },
            twitch: {
              DiscordServerId: guildid,
              channelId: "",
              roleID_PING: "",
              roleID_GIVE: "",
              channels: [],
            }
          })}catch(e){ }

          var twitsettings = client.social_log.get(guildid, "twitter")
          //if the tweet was the latest tweet stop!
          if(twitsettings.latesttweet == tweet.id_str) return
          //set the new latest tweet
          client.social_log.set(guildid, tweet.id_str, "secondtwitter.latesttweet")
          //if its not from the right user, ... cancel
          if(String(twitsettings.TWITTER_USER_NAME_ONLY_THOSE).toLowerCase() != String(TwitterName).toLowerCase()) return
          //if its not from the user, cancel
          if (tweet.in_reply_to_status_id ||
            tweet.in_reply_to_status_id_str ||
            tweet.in_reply_to_user_id ||
            tweet.in_reply_to_user_id_str ||
            tweet.in_reply_to_screen_name) {
          return
          //If retweet, do that
          }else if(tweet.retweeted_status){
            if(!twitsettings.REETWET) return;
            console.log(twitsettings.infomsg.replace("{Twittername}", TwitterName).replace("{url}", url))
            client.channels.fetch(twitsettings.DISCORD_CHANNEL_ID).then(channel => {
              channel.send(twitsettings.infomsg.replace("{Twittername}", TwitterName).replace("{url}", url));
            }).catch(err => {
              console.log(err)
            })
          //If sent tweet, do that
          } else {
            console.log(twitsettings.infomsg.replace("{Twittername}", TwitterName).replace("{url}", url))
            client.channels.fetch(twitsettings.DISCORD_CHANNEL_ID).then(channel => {
              channel.send(twitsettings.infomsg.replace("{Twittername}", TwitterName).replace("{url}", url));
            }).catch(err => {
              console.log(err)
            })
          }
        })

      }*/
      return undefined;
}
module.exports.creat_twit = create_twit;