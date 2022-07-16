
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
 const Cluster = require("discord-hybrid-sharding");
 const { Shard } = require('discord-cross-hosting');
 const fs = require("fs"); 
 const OS = require("os");
 const Events = require("events");
 const ee = require("./botconfig/embed.json")
 const emojis = require("./botconfig/emojis.json")
 const config = require("./botconfig/config.json")
 const advertisement = require("./botconfig/advertisement.json")
 const { delay, dbEnsure, clearDBData,} = require("./handlers/functions")
 const { redis } = require("./bridge_config.json");
 
 /**********************************************************
  * @param {2} CREATE_THE_DISCORD_BOT_CLIENT with some default settings
  *********************************************************/
const client = new Discord.Client({
  fetchAllMembers: false,
  restTimeOffset: 0,
  failIfNotExists: false,
  shards: Cluster.data.SHARD_LIST,        //  A Array of Shard list, which will get spawned
  shardCount: Cluster.data.TOTAL_SHARDS, // The Number of Total Shards
  allowedMentions: {
    parse: ["roles", "users"],
    repliedUser: false,
  },
  partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER", "USER", "INTERACTION"],
  intents: [ Discord.Intents.FLAGS.GUILDS,
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
    activities: [{name: `${config.status.text}`.replace("{prefix}", config.prefix), type: config.status.type, url: config.status.url}],
    status: "online"
  }
});
const discordModals = require('discord-modals') // Define the discord-modals package!
discordModals(client); // discord-modals needs your client in order to interact with modals
 
 
 /**********************************************************
  * @param {4} Create_the_client.memer property from Tomato"s Api 
  *********************************************************/
 const Meme = require("memer-api");
 client.memer = new Meme(config.memer_api); // GET a TOKEN HERE: https://discord.gg/Mc2FudJkgP
 

/**********************************************************
 * @param {5} create_the_languages_objects to select via CODE
 *********************************************************/
client.la = { }
var langs = fs.readdirSync("./languages")
for (const lang of langs.filter(file => file.endsWith(".json"))){
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
async function requirehandlers(){
  // resolve promise
  for await (const handler of [
    "extraevents", 
    "clientvariables", 
    "events", 
    "erelahandler", 
    "command", 
    "slashCommands"
  ]) {
    try{
      await require(`./handlers/${handler}`)(client);
     }catch (e){ console.error(e) }
  };

  await require(`./handlers/loaddb`)(client, true, {
    password: redis.password, 
    url: redis.url, 
    retry_strategy: () => 1000
  });
  



  console.log(await client.settings.get("940221247218909244"))
  await clearDBData(client, "940221247218909244")
  console.log(await client.settings.get("940221247218909244"))


  return;
  //social logs
  [
    "twitterfeed",
    /* "twitterfeed2", */
    "livelog", 
    "youtube", 
    /* "tiktok" */
  ].forEach(async handler=>{
    try{ await require(`./social_log/${handler}`)(client); }catch (e){ console.error(e) }
  });
  //handlers
  [
    "anti_nuke",
    "apply",
    "autobackup",
        "automeme",
        "autonsfw",
        "boostlog",
        "counter",
        "dailyfact",
        "epicgamesverification",
      "jointocreate",                            // highers the memory
        "joinvc",
        "leave",
        "logger",
        "membercount",
    "mute",                                     // highers the memory
    "reactionrole",
    "roster",
    "ticket",
    "ticketevent",
    "timedmessages",
    "welcome", 
  ].forEach(handler => {
    try{ require(`./handlers/${handler}`)(client); }catch (e){ console.error(e) }
  });
  //handlers with .run
  [
    "aichat",
    "anticaps",
    "antidiscord",
    "antilinks",
    "antimention",
    "antiselfbot",
    "antispam",
    "autoembed",
    "blacklist",
    "ghost_ping_detector",
    "keyword",
    "ranking",
    "suggest",
    "validcode",
    ].forEach(handler => {
    try{ require(`./handlers/${handler}`).run(client); }catch (e){ console.error(e) }
  });
}
requirehandlers();
 
// example client function
client.testFunction = (data) => {
  console.log("testFunctionCalled", String(data))
  return "data " + String(data);
}
// example thingy
client.testPromiseFunction = async (data) => {
  await new Promise(r => setTimeout(() => r(2), 3000));
  return "promise-data: " + String(data);
}


client.on('ready', () => {
  console.log(`Client is ready #${client.cluster.id}: ${[...client.cluster.ids.keys()].join(",")}`);
  //setInterval(() => {
      //client.machine.request({ ack: true, message: 'Are you alive?' })
        //.then(e => console.log('Are you alive?', e && e.message ? e.message : e));
  //}, 10000);
});


 /**********************************************************
  * @param {9} Login_to_the_Bot
  *********************************************************/
client.cluster = new Cluster.Client(client); //Init the Client & So we can also access broadcastEval...
client.machine = new Shard(client.cluster); // Initialize Cluster
client.login(config.token);
//start the dashboard
//require("/home/Milrato_Network/Dashboard_Milrato_Developers/index.js")(client);
 
 /**********************************************************
  * @INFO
  * Bot Coded by Tomato#6966 | https://discord.gg/milrato
  * @INFO
  * Work for Milrato Development | https://milrato.eu
  * @INFO
  * Please mention him / Milrato Development, when using this Code!
  * @INFO
  *********************************************************/

  /**
   * NEEDED TO HAVE DMS WORKING (for receiving messages and interaction)
   */
client.cluster.on("message", async (msg) => {
  return;
  if(!msg._sCustom) return
  if(msg.dm && msg.message) {
    client.actions.MessageCreate.handle(msg.packet); //handle the raw api data, so that djs can use it
  }
  if(msg.dm && msg.interaction) {
    client.actions.InteractionCreate.handle(msg.packet); //handle the raw api data, so that djs can use it
  }
})

client.cluster.on('message', message => {
  return;
  if (!message._sRequest) return;
  if (message.guildId && !message.eval && !message.songRequest && !message.dm) {
    const guild = client.guilds.cache.get(message.guildId);
    const customGuild = {};
    customGuild.id = guild.id;
    customGuild.name = guild.name;
    customGuild.icon = guild.icon;
    customGuild.ownerId = guild.ownerId;
    customGuild.roles = [...guild.roles.cache.values()];
    customGuild.channels = [...guild.channels.cache.values()];
    message.reply({ data: customGuild });
  } else if(message.guildId && !message.eval) {
    console.log(message);
  }
});                                                         

client.on("raw", (packet) => {
  if (client.cluster.id !== 0) return; // if not on the shard 0, return
  if (packet.t === "MESSAGE_CREATE" && !packet.d.guild_id) {
    client.cluster.send({
        dm: true,
        message: true,
        packet: packet.d
    }); //send the raw api packet data to the cluster, to receive it on the shards!
  }
})
client.on("interactionCreate", (interaction) => {
  return;
  if(client.cluster.id !== 0) return; // if not on the shard 0, return
  if(interaction.isSelectMenu() && !interaction.guildId && interaction.user.id != client.user?.id) {
    // all of the component types
    const Types = {
      "PING" : 1,
      "APPLICATION_COMMAND": 2,
      "MESSAGE_COMPONENT": 3,
      "APPLICATION_COMMAND_AUTOCOMPLETE": 4
    };
    // send the interaction data
    client.cluster.send({
      dm: true,
      interaction: true,
      packet: {
        version: 1,
        type: 3,
        token: interaction.token,
        member: {
          user: {
            username: interaction.user.username,
            public_flags: interaction.user.flags,
            id: interaction.user.id,
            discriminator: interaction.user.discriminator,
            bot: interaction.user.bot,
            avatar: interaction.user.avatar
          }
        },
        message: {
          type: 19,
          tts: false,
          timestamp: interaction.message.timestamp,
          pinned: false,
          message_reference: {
            message_id: interaction.message.id,
            guild_id: null,
            channel_id: interaction.message.channelId,
          },
          mentions: [],
          mention_roles: [],
          mention_everyone: false,
          id: interaction.message.id,
          flags: 0,
          embeds: interaction.message.embeds.map(e => e.toJSON()),
          edited_timestamp: null,
          content: interaction.message.content,
          components: interaction.message.components.map(c => c.toJSON()),
          channel_id: interaction.message.channelId,
          author: {
            username: client.user?.username,
            public_flags: client.user?.flags,
            id: client.user?.id,
            discriminator: client.user?.discriminator,
            bot: client.user?.bot,
            avatar: client.user?.avatar
          },
          attachments: interaction.message.attachments
        },
        user: {
          username: interaction.user?.username,
          public_flags: interaction.user?.flags,
          id: interaction.user?.id,
          discriminator: interaction.user?.discriminator,
          bot: interaction.user?.bot,
          avatar: interaction.user?.avatar
        },
        locale: interaction.locale,
        id: interaction.id,
        guild_locale: interaction.guildLocale,
        guild_id: interaction.guildId,
        data: {
          values: interaction.values,
          custom_id: interaction.customId,
          component_type: Types[interaction.type]
        },
        channel_id: interaction.channelId,
        application_id: interaction.applicationId,
      }
    });
  }
});

client.requestASong = async (songRequest, userId, guildId) => {
  const guild = client.guilds.cache.get(guildId);
  if(!guild) return false
  const member = guild.members.cache.get(userId) || await guild.members.fetch(userId).catch(() => null);
  if(!member) return false
  // if member not in a vc
  if(!member?.voice?.channel?.id) return false

  var player = client.manager.players.get(guildId);
  //if no node, connect it 
  if (player && player.node && !player.node.connected) await player.node.connect()
  //if no player create it
  if (!player) {
    player = await client.manager.create({
      guild: guildId,
      voiceChannel: member.voice.channel.id,
      textChannel: null,
      selfDeafen: true,
    });
    if (player && player.node && !player.node.connected) await player.node.connect()
  }
  let state = player.state;
  if (state !== "CONNECTED") {
    await player.set("playerauthor", member.id);
    await player.connect();
    await player.stop();
  }

  res = await client.manager.search(songRequest, member.user);
  // Check the load type as this command is not that advanced for basics
  let data = null;
  if (res.loadType === "LOAD_FAILED") {
    throw res.exception;
  } else if (res.loadType === "PLAYLIST_LOADED") {
    if(res.tracks[0]) data = res.tracks
    else data = false;
  } else {
    if(res.tracks[0]) data = res.tracks[0];
    else data = false;
  }
  if(data) {
    //if the player is not connected, then connect and create things
    if (player.state !== "CONNECTED") {
      //set the variables
      await player.set("playerauthor", member.id);
      await player.connect();
      //add track
      await player.queue.add(data);
      //play track
      await player.play();
      await player.pause(false);
    } else if (!player.queue || !player.queue.current) {
      //add track
      await player.queue.add(data);
      //play track
      await player.play();
      await player.pause(false);
    }
    //otherwise
    else {
      //add track
      await player.queue.add(data);
    }
    return res.tracks[0];
  } else {
    console.error("COULD NOT FIND THE SONG");
    return { error: "COULD NOT FIND THE SONG" };
  }


}
