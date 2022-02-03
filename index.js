
/**********************************************************
 * @INFO  [TABLE OF CONTENTS]
 * 1  Import_Modules
   * 1.1 Validating script for advertisement
 * 2  CREATE_THE_DISCORD_BOT_CLIENT
 * 3  Load_Discord_Buttons_and_Discord_Menus
 * 4  Create_the_client.memer
 * 5  create_the_languages_objects
 * 6  Raise_the_Max_Listeners
 * 7  Define_the_Client_Advertisments
 * 8  LOAD_the_BOT_Functions
 * 9  Login_to_the_Bot
 * 
 *   BOT CODED BY: TOMato6966 | https://milrato.eu
 *********************************************************/



/**********************************************************
 * @param {1} Import_Modules for this FIle
 *********************************************************/
const Discord = require("discord.js");
const colors = require("colors");
const enmap = require("enmap");
const fs = require("fs");
const OS = require('os');
const Events = require("events");
const emojis = require("./botconfig/emojis.json")
const config = require("./botconfig/config.json")
const advertisement = require("./botconfig/advertisement.json")
const { delay } = require("./handlers/functions")
require('dotenv').config()


/**********************************************************
 * @param {2} CREATE_THE_DISCORD_BOT_CLIENT with some default settings
 *********************************************************/
const client = new Discord.Client({
  fetchAllMembers: false,
  restTimeOffset: 0,
  failIfNotExists: false,
  shards: "auto",
  allowedMentions: {
    parse: ["roles", "users"],
    repliedUser: false,
  },
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
  intents: [Discord.Intents.FLAGS.GUILDS,
  Discord.Intents.FLAGS.GUILD_MEMBERS,
  Discord.Intents.FLAGS.GUILD_BANS,
  Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
  Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
  Discord.Intents.FLAGS.GUILD_WEBHOOKS,
  Discord.Intents.FLAGS.GUILD_INVITES,
  Discord.Intents.FLAGS.GUILD_VOICE_STATES,
  Discord.Intents.FLAGS.GUILD_PRESENCES,
  Discord.Intents.FLAGS.GUILD_MESSAGES,
  Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  //Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
  Discord.Intents.FLAGS.DIRECT_MESSAGES,
  Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    //Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
  ],
  presence: {
    activities: [{ name: `${config.status.text}`.replace("{prefix}", config.prefix), type: config.status.type, url: config.status.url }],
    status: "online"
  }
});



/**********************************************************
 * @param {4} Create_the_client.memer property from Tomato's Api 
 *********************************************************/
const Meme = require("memer-api");
client.memer = new Meme(process.env.memer_api || config.memer_api); // GET a TOKEN HERE: https://discord.gg/Mc2FudJkgP





/**********************************************************
 * @param {5} create_the_languages_objects to select via CODE
 *********************************************************/
client.la = {}
var langs = fs.readdirSync("./languages")
for (const lang of langs.filter(file => file.endsWith(".json"))) {
  client.la[`${lang.split(".json").join("")}`] = require(`./languages/${lang}`)
}
Object.freeze(client.la)
//function "handlemsg(txt, options? = {})" is in /handlers/functions 




/**********************************************************
 * @param {6} Raise_the_Max_Listeners to 0 (default 10)
 *********************************************************/
client.setMaxListeners(0);
Events.defaultMaxListeners = 0;
process.env.UV_THREADPOOL_SIZE = OS.cpus().length;


/**********************************************************
 * @param {7} Define_the_Client_Advertisments from the Config File
 *********************************************************/
client.ad = {
  enabled: advertisement.adenabled,
  statusad: advertisement.statusad,
  spacedot: advertisement.spacedot,
  textad: advertisement.textad
}



/**********************************************************
 * @param {8} LOAD_the_BOT_Functions 
 *********************************************************/
//those are must haves, they load the dbs, events and commands and important other stuff
function requirehandlers() {
  ["extraevents", "clientvariables", "command", "loaddb", "events", "erelahandler", "slashCommands"].forEach(handler => {
    try { require(`./handlers/${handler}`)(client); } catch (e) { console.log(e.stack ? String(e.stack).grey : String(e).grey) }
  });
  ["twitterfeed", /*"twitterfeed2",*/ "livelog", "youtube", "tiktok"].forEach(handler => {
    try { require(`./social_log/${handler}`)(client); } catch (e) { console.log(e.stack ? String(e.stack).grey : String(e).grey) }
  });
  ["logger", "anti_nuke", "antidiscord", "antilinks", "anticaps", "antispam", "blacklist", "keyword", "antimention", "autobackup",

    "apply", "ticket", "ticketevent",
    "roster", "joinvc", "epicgamesverification", "boostlog",

    "welcome", "leave", "ghost_ping_detector", "antiselfbot",

    "jointocreate", "reactionrole", "ranking", "timedmessages",

    "membercount", "autoembed", "suggest", "validcode", "dailyfact", "autonsfw",
    "aichat", "mute", "automeme", "counter"].forEach(handler => {
      try { require(`./handlers/${handler}`)(client); } catch (e) { console.log(e.stack ? String(e.stack).grey : String(e).grey) }
    });
} requirehandlers();


/**********************************************************
 * @param {9} Login_to_the_Bot
 *********************************************************/
client.login(process.env.token || config.token);


/**********************************************************
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 *********************************************************/