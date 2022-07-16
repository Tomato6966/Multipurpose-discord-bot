/**
 * @INFO
 * Loading all needed File Information Parameters
 */
const config = require(`${process.cwd()}/botconfig/config.json`); //loading config file with token and prefix, and settings
const ee = require(`${process.cwd()}/botconfig/embed.json`); //Loading all embed settings like color footertext and icon ...
const {
  MessageEmbed, Permissions, Collection
} = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const {
  escapeRegex,
  delay,
  handlemsg,
  check_if_dj,
  CheckGuild,
  dbEnsure,
  databasing,
  clearDBData
} = require(`../../handlers/functions`); //Loading all needed functions
//here the event starts
module.exports = async (client, message) => {
  try {
    let dbEvent = Date.now();
    //if the message is not in a guild (aka in dms), return aka ignore the inputs
    if (!message.guild || message.guild.available === false || !message.channel || message.webhookId) return

    if(message.author.id == "442355791412854784") console.log(`${message.author.id == "442355791412854784" ? `  ::  [${Math.floor(Date.now() - dbEvent)}ms]  `.brightRed : ``}Received something from :: ${message.guild.name}`.dim)
        
    //if the channel is on partial fetch it
    if (message.channel?.partial) await message.channel.fetch().catch(() => null);
    if (message.member?.partial) await message.member.fetch().catch(() => null);
    //ensure all databases for this server/user from the databasing function
    if(client.checking[message.guild.id]) {
      if(message.content.includes(client.user.id) || message.content.startsWith(config.prefix)) {
        return message.reply(":x: I'm setting myself up for this Guild!")
      }
      return
    }
    // check the guild
    if(!Object.keys(client.checking).includes(message.guild.id)) await CheckGuild(client, message.guild.id);
    
    var not_allowed = false;
    // get the settings and setups
    let guild_settings = await client.settings.get(message.guild.id);
    let guild_setups = await client.setups.get(message.guild.id);
    //console.log(guild_settings, "guild_settings");
    // if some not available, ensure the db
    if(!guild_settings || !guild_setups || !guild_settings.prefix || !guild_settings.embed) {
      console.log("DATABASING CALLED", !guild_settings, !guild_setups , !guild_settings.prefix , !guild_settings.embed);
      return await databasing(client, message.guild.id);
      guild_settings = await client.settings.get(message.guild.id);
      guild_setups = await client.setups.get(message.guild.id);
      console.log("DATABASING FINISHED", !guild_settings , !guild_setups , !guild_settings.prefix , !guild_settings.embed);
    }
    // require the handlers
    let messageCreateHandlers = [
      "aichat", "anticaps", "antidiscord", "antilinks", "antimention", 
      "antiselfbot", "antispam", "autoembed", "blacklist", "counter",
      "ghost_ping_detector", "keyword", "ranking", "suggest", "validcode"
    ]
    for (const handler of messageCreateHandlers) {
      try{
        // require(`../../handlers/${handler}`).messageCreate(client, message, guild_settings, guild_setups)
      }catch(e){
        // console.error(`../../handlers/${handler}`, e)
      }
    }
    if(message.author.id == "442355791412854784")
          console.log(`${message.author.id == "442355791412854784" ? `  ::  [${Math.floor(Date.now() - dbEvent)}ms]  `.brightRed : ``}Executed something in :: ${message.guild.name}`.dim)
        
    let ls = guild_settings.language || "en";
    let es = guild_settings.embed || ee;
    let { prefix, botchannel, unkowncmdmessage } = guild_settings;
    // if the message  author is a bot, return aka ignore the inputs
    if (message.author?.bot) return 
    //if not in the database for some reason use the default prefix
    if (prefix === null) prefix = config.prefix;
    //the prefix can be a Mention of the Bot / The defined Prefix of the Bot
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    //if its not that then return
    if (!prefixRegex.test(message.content)) return
    
    //now define the right prefix either ping or not ping
    const [, matchedPrefix] = message.content.match(prefixRegex);
    //Check if there is guild.me
    if(!message.guild.me) await message.guild.members.fetch(client.user.id).catch(() => null);
    //CHECK PERMISSIONS
    if(!message.guild.me?.permissions?.has(Permissions.FLAGS.SEND_MESSAGES)) return console.log(`No SEND_MESSAGES PERMISSION IN ${message.guild.name}`)
    if(!message.guild.me?.permissions?.has(Permissions.FLAGS.READ_MESSAGE_HISTORY)) return message.channel.send(`${message.author}, :x: **I am missing the Permission to READ THE MESSAGE HISTORY**, otherwise none of my Commands will work!`).catch(console.error)
    if(!message.guild.me?.permissions?.has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS))
      return message.reply(`:x: **I am missing the Permission to USE EXTERNAL EMOJIS**`).catch(console.error)
    if(!message.guild.me?.permissions?.has(Permissions.FLAGS.EMBED_LINKS))
      return message.reply(`<:no:833101993668771842> **I am missing the Permission to EMBED LINKS (Sending Embeds)**`).catch(console.error)
    if(!message.guild.me?.permissions?.has(Permissions.FLAGS.ADD_REACTIONS))
      return message.reply(`<:no:833101993668771842> **I am missing the Permission to ADD REACTIONS**`).catch(console.error)


    //CHECK IF IN A BOT CHANNEL OR NOT
    if (botchannel && botchannel.length > 0 && !botchannel?.includes(message.channel.id) && !message.member?.permissions?.has("ADMINISTRATOR")) {
      //if its not in a BotChannel, and user not an ADMINISTRATOR
      for await (const channelId of botchannel?.filter(c => !message.guild.channels.cache.has(c))){
        await dbRemove(client.settings, `${message.guild.id}.botchannel`, channelId)
      }
      try {
        message.react("833101993668771842").catch(console.error)
      } catch {}
      not_allowed = true;
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.botchat.title)
        .setDescription(`${client.la[ls].common.botchat.description}\n> ${botchannel.filter(c => message.guild.channels.cache.get(c) && message.guild.channels.cache.get(c)?.permissionsFor(message.member).has(Permissions.FLAGS.VIEW_CHANNEL)).map(c=>`<#${c}>`).join(", ")}`)]}
      ).then(async msg => {
          setTimeout(()=>{
            try {
              msg.delete().catch(console.error)
            } catch {}
          }, 5000)
      }).catch(console.error)
    }
    //create the arguments with sliceing of of the rightprefix length
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    //creating the cmd argument by shifting the args by 1
    const cmd = args.shift()?.toLowerCase();
    //if no cmd added return error
    if (cmd.length === 0) {
      if (matchedPrefix.includes(client.user.id))
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.color)
          .setTitle(handlemsg(client.la[ls].common.ping, {prefix: prefix}))]}).catch(console.error);
      return 
    }
    //get the command from the collection
    let command = client.commands.get(cmd);
    //if the command does not exist, try to get it by his alias
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    var customcmd = false;
    var cuc = await client.customcommands.get(message.guild.id+".commands");
    if(cuc && Array.isArray(cuc)){
      for await (const cmd of cuc) {
        if (cmd.name.toLowerCase() === message.content.slice(prefix.length).split(" ")[0]) {
          customcmd = true;
          if (cmd.embed) {
            return message.reply({embeds: [new MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setFooter(client.getFooter(es))
              .setDescription(cmd.output)]});
          } else {
            message.reply(cmd.output)
          }
        }
      }
    } else {
      await dbEnsure(client.commands, message.guild.id, {
        commands: []
      })
    }
    
    //if the command is now valid
    if (command && !customcmd) {
      var musicData = await client.musicsettings.get(message.guild.id);
      if(musicData && musicData.channel && musicData.channel == message.channel.id){
        return message.reply("<:no:833101993668771842> **Please use a Command Somewhere else!**").then(msg=>{setTimeout(()=>{try{msg.delete().catch(() => null);}catch(e){ }}, 3000)}).catch(console.error)
      }
      if (!command || command.length == 0) {
        if (unkowncmdmessage) {
          message.reply({embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(handlemsg(client.la[ls].common.unknowncmd.title, {prefix: prefix}))
            .setDescription(handlemsg(client.la[ls].common.unknowncmd.description, {prefix: prefix}))]}).then(async msg => {
            setTimeout(() => {
              try {
                msg.delete().catch(console.error)
              } catch {}
            }, 5000)
          }).catch(console.error)
        }
        //RETURN
        return
      }
      if (!client.cooldowns.has(command.name)) { //if its not in the cooldown, set it too there
        client.cooldowns.set(command.name, new Collection());
      }
      const now = Date.now(); //get the current time
      const timestamps = client.cooldowns.get(command.name); //get the timestamp of the last used commands
      const cooldownAmount = (command.cooldown || 1) * 1000; //get the cooldownamount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^
      if (timestamps.has(message.author?.id)) { //if the user is on cooldown
        let expirationTime = timestamps.get(message.author?.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
        if (now < expirationTime) { //if he is still on cooldonw
          let timeLeft = (expirationTime - now) / 1000; //get the lefttime
          if(timeLeft < 1) timeLeft = Math.round(timeLeft)
          if(timeLeft && timeLeft != 0){
            not_allowed = true;
            return message.reply({embeds: [new MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(handlemsg(client.la[ls].common.cooldown, {time: timeLeft.toFixed(1), commandname: command.name}))]}
            ).catch(console.error) //send an information message
          }
        }
      }
      timestamps.set(message.author?.id, now); //if he is not on cooldown, set it to the cooldown
      setTimeout(() => timestamps.delete(message.author?.id), cooldownAmount); //set a timeout function with the cooldown, so it gets deleted later on again
      try {
        client.stats.add(message.guild.id+".commands", 1); //counting our Database stats for SERVER
        client.stats.add("global.commands", 1); //counting our Database Stats for GLOBA
        //if Command has specific permission return error
        if (command.memberpermissions) {
          if (!message.member?.permissions?.has(command.memberpermissions)) {
            not_allowed = true;
            try {
              message.react("833101993668771842").catch(() => null);
            } catch {}
            message.reply({embeds: [new MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(client.la[ls].common.permissions.title)
              .setDescription(`${client.la[ls].common.permissions.description}\n> \`${command.memberpermissions.join("`, ``")}\``)]}
            ).then(async msg => {
                setTimeout(()=>{
                  try {
                    msg.delete().catch(console.error)
                  } catch {}
                }, 5000)
            }).catch(console.error)
          }
        }
        //if Command has specific permission return error

        ///////////////////////////////
        ///////////////////////////////
        ///////////////////////////////
        ///////////////////////////////

        const player = client.manager.players.get(message.guild.id);
        
        ///////////////////////////////
        ///////////////////////////////
        ///////////////////////////////
        ///////////////////////////////
        if(command.parameters) {

            if(player && player.node && !player.node.connected) await player.node.connect();
            
            if(message.guild.me.voice.channel && player) {
              //destroy the player if there is no one
              if(!player.queue) await player.destroy();
              await delay(350);
            }
          
            if(command.parameters.type == "music"){
              //get the channel instance
              const { channel } = message.member.voice;
              const mechannel = message.guild.me.voice.channel;
              //if not in a voice Channel return error
              if (!channel) {
                not_allowed = true;
                return message.reply({embeds: [new MessageEmbed()
                  .setColor(es.wrongcolor)
                  .setFooter(client.getFooter(es))
                  .setTitle(client.la[ls].common.join_vc)]}).catch(console.error)
              }

              if(channel && !mechannel) {
                if(!channel?.permissionsFor(message.guild?.me)?.has(Permissions.FLAGS.CONNECT)) 
                  return message.reply({ content: "<:no:833101993668771842> **I'm missing the Permission to Connect to your Voice-Channel!**"}).catch(() => null);
                if(!channel?.permissionsFor(message.guild?.me)?.has(Permissions.FLAGS.SPEAK)) 
                  return message.reply({ content: "<:no:833101993668771842> **I'm missing the Permission to Speak in your Voice-Channel!**"}).catch(() => null);
              }

              //If there is no player, then kick the bot out of the channel, if connected to
              if(!player && mechannel) {
                await message.guild.me.voice.disconnect().catch(e=>{});
                await delay(350);
              }
              if(player && player.queue && player.queue.current && command.parameters.check_dj){
                const DJ = await check_if_dj(client, message.member, player.queue.current);
                if(DJ) {
                  return message.reply({embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(client.getFooter(es))
                    .setTitle(`<:no:833101993668771842> **You are not a DJ and not the Song Requester!**`)
                    .setDescription(`**DJ-ROLES:**\n${DJ}`)
                  ],}).catch(console.error)
                }
              }

              //if no player available return error | aka not playing anything
              if(command.parameters.activeplayer){
                if (!player){
                  not_allowed = true;
                  return message.reply({embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                    .setTitle(client.la[ls].common.nothing_playing)]}).catch(console.error)
                }
                if (!mechannel){
                  if(player) try{ await player.destroy(); await delay(350); }catch{ }
                  not_allowed = true;
                  return message.reply({embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                    .setTitle(client.la[ls].common.not_connected)]}).catch(console.error)
                }
                if(!player.queue || !player.queue.current){
                  return message.reply({embeds : [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setTitle(":x: There is no current Queue / Song Playing!")
                  ]}).catch(console.error)
                }
              }
              //if no previoussong
              if(command.parameters.previoussong){
                if (!player.queue.previous || player.queue.previous === null){
                  not_allowed = true;
                  return message.reply({embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setFooter(client.getFooter(es))
                    .setTitle(client.la[ls].common.nothing_playing)]}).catch(console.error)
                }
              }
              //if not in the same channel --> return
              if (player && channel.id !== player.voiceChannel && !command.parameters.notsamechannel){
                return message.reply({embeds: [new MessageEmbed()
                  .setColor(es.wrongcolor)
                  .setFooter(client.getFooter(es))
                  .setTitle(client.la[ls].common.wrong_vc)
                  .setDescription(`Channel: <#${player.voiceChannel}>`)]}).catch(console.error)
            }
            //if not in the same channel --> return
            if (mechannel && channel.id !== mechannel.id && !command.parameters.notsamechannel) {
              return message.reply({embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(client.la[ls].common.wrong_vc)
                .setDescription(`Channel: <#${player.voiceChannel}>`)]}).catch(console.error)
            }
          }
        }
        ///////////////////////////////
        ///////////////////////////////
        ///////////////////////////////
        ///////////////////////////////
        //run the command with the parameters:  client, message, args, user, text, prefix,
        if (not_allowed) return;
        if(message.author.id == "442355791412854784")
          console.log(`${message.author.id == "442355791412854784" ? `  ::  [${Math.floor(Date.now() - dbEvent)}ms]  `.brightRed : ``}Execute the Command ${command.name} :: ${message.guild.name}`.dim)
        //Execute the Command
        command.run(client, message, args, message.member, args.join(" "), prefix, player, es, ls, guild_settings);
      } catch (e) {
        console.error(e)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.somethingwentwrong)
          .setDescription(`\`\`\`${e.message ? e.message : e.stack ? String(e.stack).grey.substring(0, 2000) : String(e).grey.substring(0, 2000)}\`\`\``)]
        }).then(async msg => {
          setTimeout(()=>{
            try {
              msg.delete().catch(console.error)
            } catch {}
          }, 5000)
      }).catch(console.error)
    }
  } else if (!customcmd) {
    if (unkowncmdmessage) {
      message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(handlemsg(client.la[ls].common.unknowncmd.title, {prefix: prefix}))
        .setDescription(handlemsg(client.la[ls].common.unknowncmd.description, {prefix: prefix}))]
      }).then(async msg => {
        setTimeout(()=>{
          try {
            msg.delete().catch(console.error)
          } catch {}
        }, 5000)
    }).catch(console.error)
    }
    return
  }
} catch (e) {
  console.error(e)
  return message.reply({embeds: [new MessageEmbed()
    .setColor("RED")
    .setTitle(":x: An error occurred")
    .setDescription(`\`\`\`${e.message ? e.message : String(e).grey.substring(0, 2000)}\`\`\``)]}).catch(console.error)
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
