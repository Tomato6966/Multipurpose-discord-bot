const twitconfig = require("./twitter.json")
const Twit = require('twit')
const { databasing, delay } = require(`${process.cwd()}/handlers/functions`)
var CronJob = require('cron').CronJob;
module.exports = client => {
  //create the job with a "7" Minute delay!
  client.Jobtwitterfeed  = new CronJob('0 */7 * * * *', async function() {
    await delay(3 * 60 * 1000)
    create_twit(client);
  }, null, true, 'Europe/Berlin');

  client.on('ready', () => {
    client.Jobtwitterfeed.start();
  })
}
async function create_twit(client){
      console.log(" [TWITER] :: Checking Accounts".cyan)
      //ensure the db for each guild
      //get all userids from the db
      var userids = client.social_log.filterArray(value => value?.twitter?.TWITTER_USER_NAME_ONLY_THOSE?.length > 2).map(value => `${value.twitter.TWITTER_USER_NAME_ONLY_THOSE}`)
      //if no userids return
      if(!userids || userids.length == 0) return console.log(` [TWITER] :: NO USERIDS: ${userids}`.cyan)
      //create a new TWIT
      var T = new Twit({
        consumer_key: process.env.consumer_key || twitconfig.consumer_key,
        consumer_secret: process.env.consumer_secret || twitconfig.consumer_secret,
        access_token: process.env.access_token || twitconfig.access_token,
        access_token_secret: process.env.access_token_secret || twitconfig.access_token_secret,
        timeout_ms: twitconfig.timeout_ms, 
        strictSSL: twitconfig.strictSSL, 
      })
      console.log(String(" [TWITER] :: " + userids.filter(i=> i?.toLowerCase() != "impressgm").join(", ")).cyan)
      for(const user of userids){
        if(String(user).toLowerCase().includes("impressgm")) continue;
        console.log(String(" [TWITER] :: Checking: " + user).cyan);
        gettwit(user);
        await delay(1500);
      }

      async function gettwit(user){
        try{
          await T.get('search/tweets', { q: `from:${user}`, count: 10 }, function(err, data, response) {
            try{
              console.log(" [TWITER] :: DATA RECEIVED".cyan)
              if(err) return console.log(String(" [TWITER] :: "+err).grey)
              //define some twitter only variables
              if(!data || data == undefined || !data.statuses || data.statuses == undefined || !data.statuses[0] || data.statuses[0] == undefined || !data.statuses[0].user) return console.log("COULD NOT FIND THE DATA".cyan);
              var tweet = data.statuses[0];
              var TwitterName = tweet.user.screen_name;
              var url = "https://twitter.com/" + TwitterName + "/status/" + tweet.id_str;
              //get the guildid for the twitter account
              var guildid = client.social_log.findKey("twitter.TWITTER_USER_ID", tweet.user.id_str)
              //get the settings from the guildid
              if(!guildid || guildid == null || guildid == undefined || guildid.length != 18) return console.log(" [TWITER] :: NO VALID GUILD ".cyan)
              try{
                client.social_log.ensure(guildid, {
                twitter: {
                  TWITTER_USER_ID: "",
                  TWITTER_USER_NAME_ONLY_THOSE: "",
                  DISCORD_CHANNEL_ID: "",
                  latesttweet: "",
                  REETWET: false,
                  infomsg: "**{Twittername}** posted a new Tweet:\n\n{url}"
                }
              })}catch(e){ }
              //
              var twitsettings = client.social_log.get(guildid, "twitter")
              //if the tweet was the latest tweet stop!
              if(twitsettings.latesttweet === tweet.id_str) return console.log(" [TWITER] :: LATEST TWEET".cyan)
              //if its not from the right user, ... cancel
              if(String(twitsettings.TWITTER_USER_NAME_ONLY_THOSE).toLowerCase() != String(TwitterName).toLowerCase()) return
              //if its not from the user, cancel
              if (tweet.in_reply_to_status_id ||
                tweet.in_reply_to_status_id_str ||
                tweet.in_reply_to_user_id ||
                tweet.in_reply_to_user_id_str ||
                tweet.in_reply_to_screen_name) {
              return console.log(String(" [TWITER] :: NOT RIGHT TWEET! :: " + url).cyan)
              //If retweet, do that
              }else if(tweet.retweeted_status){
                if(!twitsettings.REETWET) return;
                client.channels.fetch(twitsettings.DISCORD_CHANNEL_ID).then(channel => {
                  channel.send(twitsettings.infomsg.replace("{Twittername}", TwitterName).replace("{url}", url)).then(msg=>{
                    console.log(` [TWITER] :: NOTIFICATION SENT IN ${channel.name} for ${TwitterName} with ${url}`.green)
                    //set the new latest tweet
                    client.social_log.set(guildid, tweet.id_str, "twitter.latesttweet")
                  }).catch(e=>{
                    console.log(String(" [TWITER] :: "+e).grey.grey)
                  })
                }).catch(err => {
                  console.log(String(" [TWITER] :: "+err).grey)
                })
              //If sent tweet, do that
              } else {
                client.channels.fetch(twitsettings.DISCORD_CHANNEL_ID).then(channel => {
                  channel.send(twitsettings.infomsg.replace("{Twittername}", TwitterName).replace("{url}", url)).then(msg=>{
                    console.log(` [TWITER] :: NOTIFICATION SENT IN ${channel.name} for ${TwitterName} with ${url}`.green)
                    //set the new latest tweet
                    client.social_log.set(guildid, tweet.id_str, "twitter.latesttweet")
                  }).catch(e=>{
                    console.log(String(" [TWITER] :: "+e).grey.grey)
                  })
                }).catch(err => {
                  console.log(String(" [TWITER] :: "+err).grey)
                })
              }
            }catch (e){
              console.log(String(" [TWITER] :: "+e).grey)
            }
          })
        }catch (e){
          console.log(String(" [TWITER] :: "+e).grey)
        }
      }
      return;
}
module.exports.creat_twit = create_twit;
