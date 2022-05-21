const Discord = require("discord.js");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  GetUser,
  GetGlobalUser, handlemsg
} = require(`../../handlers/functions`)
const fetch = require("node-fetch")
module.exports = {
  name: "connectioninfo",
  aliases: ["coinfo"],
  category: "🔰 Info",
  description: "Get Information of your Connection",
  usage: "connectioninfo",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {

		try {
      var user;
      if(args[0]){
        try {
          if(args[1] && args[1].toLowerCase() == "global"){
            args.pop()
            user = await GetGlobalUser(message, args)
          } else {
            user = await GetUser(message, args)
          }
        } catch (e){
          console.error(e)
          return message.reply(client.la[ls].common.usernotfound)
        }
      } else{
        user = message.author;
      }
      let member = message.guild.members.cache.get(user.id) || await message.guild.members.fetch(user.id).catch(() => null) || false;
      
      if(!member) return message.reply(":x: **This User is not a Member of this Guild!**")
      if(!member.voice || !member.voice.channel) return message.reply(":x: **This User is not Connected to a Voicechannel in this Guild!**")
      

      const embed = new Discord.MessageEmbed()
        .setTitle(`Connection Info of: \`${user.tag}\``)
        .addField('<a:arrow:943027097348227073> **Channel**', `> **${member.voice.channel.name}** ${member.voice.channel}`, true)
        .addField('<a:arrow:943027097348227073> **Channel-ID**', `> \`${member.voice.channel.id}\``, true)
        .addField('<a:arrow:943027097348227073> **Members in there**', `> \`${member.voice.channel.members.size} total Members\``, true)
        .addField('<a:arrow:943027097348227073> **Full Channel?**', `> ${member.voice.channel.full ? "✅" : "❌"}`, true)
        .addField('<a:arrow:943027097348227073> **Bitrate**', `> ${member.voice.channel.bitrate}`, true)
        .addField('<a:arrow:943027097348227073> **User join limit**', `> \`${member.voice.channel.userLimit != 0 ? member.voice.channel.userLimit : "No limit!"}\``, true)
      
      message.reply({
        embeds: [embed]
      });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
      ]});
    }
  }
}

