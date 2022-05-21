const twitconfig = require("./twitter.json")
const Twit = require('twit')
const { dbEnsure, delay } = require(`${process.cwd()}/handlers/functions`)
var CronJob = require('cron').CronJob;
module.exports = async (client) => {
  //create the job with a "7" Minute delay!
  client.Jobtwitterfeed  = new CronJob('0 0,10,20,30,40,50 * * * *', async function() {
    await create_twit(client);
    return;
  }, null, true, 'Europe/Berlin');

  client.on('ready', async () => {
    client.Jobtwitterfeed.start();
    return;
  })
}
async function create_twit(client){
      //console.log(" [TWITER] :: Checking Accounts".cyan)
      //ensure the db for each guild
      //get all userids from the db
      const guildChannels = client.guilds.cache.map(g => {
        return { 
          channels: g.channels.cache.map(c => c.id),
          guildID: g.id || "NO_GUILD_ID",  
        }
      })
      var userids = await client.social_log.all().then(D => {
        let filteredTwitter = D.filter(d => d.data.twitter);
        const filteredForThisShard = filteredTwitter.filter(d => {
          // if no dc channel setupped return false
          let dcChannel = d.data.twitter.DISCORD_CHANNEL_ID;
          if(!dcChannel || dcChannel.length < 8) return false;

          // if no twitter username setupped, return false
          let twitterUsername = d?.data?.twitter?.TWITTER_USER_NAME_ONLY_THOSE;
          if(!twitterUsername || twitterUsername.length <= 2) return false;

          let guildID = guildChannels.find(g => g.channels.includes(dcChannel))?.guildID;
          // ifs not on this shard, return false
          if(!guildID || !client.guilds.cache.has(guildID)) return false;
          // all tests passed! return true
          return true; 
        })
        const UserIds = filteredForThisShard.filter(Boolean).map(value => `${value.data?.twitter?.TWITTER_USER_NAME_ONLY_THOSE}`)
        return UserIds;
      })
      //if no userids return
      if(!userids || userids.length == 0) return //console.log(` [TWITER] :: NO USERIDS: ${userids}`.cyan)
      //create a new TWIT
      var T = new Twit({
        consumer_key: process.env.consumer_key || twitconfig.consumer_key,
        consumer_secret: process.env.consumer_secret || twitconfig.consumer_secret,
        access_token: process.env.access_token || twitconfig.access_token,
        access_token_secret: process.env.access_token_secret || twitconfig.access_token_secret,
        timeout_ms: twitconfig.timeout_ms, 
        strictSSL: twitconfig.strictSSL, 
      })
      //console.log(String(" [TWITER] :: " + userids.filter(i=> i?.toLowerCase() != "impressgm").join(", ")).cyan)
      for await (const user of userids){
        if(String(user).toLowerCase().includes("impressgm")) continue;
        //console.log(String(" [TWITER] :: Checking: " + user).cyan);
        gettwit(user);
        await delay(1500);
      }

      async function gettwit(user){
        try{
          await T.get('search/tweets', { q: `from:${user}`, count: 10 }, async function(err, data, response) {
            try{
              //console.log(` [TWITER] :: DATA RECEIVED :: ${user}`.cyan)
              if(err) return //console.log(String(" [TWITER] :: "+err).grey)
              //define some twitter only variables
              if(!data || data == undefined || !data.statuses || data.statuses == undefined || !data.statuses[0] || data.statuses[0] == undefined || !data.statuses[0].user) return //console.log(` [TWITER] :: NO STATUSSES FOUND :: ${user}`.cyan);
              var tweet = data.statuses[0];
              var TwitterName = tweet.user.screen_name;
              var url = "https://twitter.com/" + TwitterName + "/status/" + tweet.id_str;
              //get the guildid for the twitter account
              var guildid = await client.social_log.all().then(d => {
                return d.find(d => d?.data?.twitter?.TWITTER_USER_ID == tweet.user.id_str)?.ID
              })
              //get the settings from the guildid
              if(!guildid || guildid == null || guildid == undefined || guildid.length != 18) return //console.log(` [TWITER] :: NO VALID GUILD :: ${user}`.cyan)
              try{
                await dbEnsure(client.social_log, guildid, {
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
              var twitsettings = await client.social_log.get(guildid+ ".twitter")
              //if the tweet was the latest tweet stop!
              if(twitsettings.latesttweet === tweet.id_str) return //console.log(` [TWITER] :: LATEST TWEET :: ${user}`.cyan)
              //if its not from the right user, ... cancel
              if(String(twitsettings.TWITTER_USER_NAME_ONLY_THOSE).toLowerCase() != String(TwitterName).toLowerCase()) return
              //if its not from the user, cancel
              if (tweet.in_reply_to_status_id ||
                tweet.in_reply_to_status_id_str ||
                tweet.in_reply_to_user_id ||
                tweet.in_reply_to_user_id_str ||
                tweet.in_reply_to_screen_name) {
              return //console.log(String(" [TWITER] :: NOT RIGHT TWEET! :: " + url).cyan)
              //If retweet, do that
              }else if(tweet.retweeted_status){
                if(!twitsettings.REETWET) return;
                client.channels.fetch(twitsettings.DISCORD_CHANNEL_ID).then(channel => {
                  channel.send(twitsettings.infomsg.replace("{Twittername}", TwitterName).replace("{url}", url)).then(msg=>{
                    //console.log(` [TWITER] :: NOTIFICATION SENT IN ${channel.name} for ${TwitterName} with ${url}`.green)
                    //set the new latest tweet
                    client.social_log.set(guildid+".twitter.latesttweet", tweet.id_str)
                  }).catch(e=>{
                    //console.log(String(" [TWITER] :: "+e).grey.grey)
                  })
                }).catch(err => {
                  //console.log(String(" [TWITER] :: "+err).grey)
                })
              //If sent tweet, do that
              } else {
                client.channels.fetch(twitsettings.DISCORD_CHANNEL_ID).then(channel => {
                  channel.send(twitsettings.infomsg.replace("{Twittername}", TwitterName).replace("{url}", url)).then(msg=>{
                    //console.log(` [TWITER] :: NOTIFICATION SENT IN ${channel.name} for ${TwitterName} with ${url}`.green)
                    //set the new latest tweet
                    client.social_log.set(guildid+".twitter.latesttweet", tweet.id_str)
                  }).catch(e=>{
                    //console.log(String(" [TWITER] :: "+e).grey.grey)
                  })
                }).catch(err => {
                  //console.log(String(" [TWITER] :: "+err).grey)
                })
              }
            }catch (e){
              //console.log(String(" [TWITER] :: "+e).grey)
            }
          })
        }catch (e){
          //console.log(String(" [TWITER] :: "+e).grey)
        }
      }
      return;
}
module.exports.creat_twit = create_twit;