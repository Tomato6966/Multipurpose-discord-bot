const { MessageEmbed } = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { dbEnsure, handlemsg } = require("../../handlers/functions")
module.exports = {
    name: `msbttoggle`,
    category: `⚙️ Settings`,
    description: `Let's you change the Prefix of the BOT`,
    usage: `msbttoggle`,
    memberpermissions: [`ADMINISTRATOR`],
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
      
    try{
      //set the new prefix
      let musicsettings = await client.musicsettings.get(message.guild.id)
      if(musicsettings.message == "" || musicsettings.channel.length < 5) {
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(handlemsg(client.la[ls]["cmds"]["settings"]["msbt"]["errt"]))
            .setDescription(handlemsg(client.la[ls]["cmds"]["settings"]["msbt"]["err"]))
        ]});
      }
      if(musicsettings.text == false) {
          await client.musicsettings.set(message.guild.id+".text", true);
          message.reply({embeds : [new MessageEmbed()
            .setColor(es.color)
            .setFooter(client.getFooter(es))
            .setTitle(handlemsg(client.la[ls]["cmds"]["settings"]["msbt"]["title1"]))
            .setDescription(handlemsg(client.la[ls]["cmds"]["settings"]["msbt"]["subtitle1"]))
        ]});
      }else{
          await client.musicsettings.set(message.guild.id+".text", false);
          message.reply({embeds : [new MessageEmbed()
            .setColor(es.color)
            .setFooter(client.getFooter(es))
            .setTitle(handlemsg(client.la[ls]["cmds"]["settings"]["msbt"]["title2"]))
            .setDescription(handlemsg(client.la[ls]["cmds"]["settings"]["msbt"]["subtitle2"]))
        ]});
      }
      return;
  } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
					.setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["settings"]["prefix"]["variable6"]))
      ]});
  }
  }
};

