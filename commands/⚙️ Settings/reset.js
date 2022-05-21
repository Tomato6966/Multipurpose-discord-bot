const { MessageEmbed } = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { databasing, clearDBData } = require("../../handlers/functions");
module.exports = {
  name: `reset`,
  aliases: [`hardreset`],
  category: `⚙️ Settings`,
  description: `Resets / Deletes all of the Setups as well as the prefix!`,
  usage: `reset`,
  memberpermissions: [`ADMINISTRATOR`],
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try{
      
      //if not enough permissions aka not the guild owner, return error
      if (message.member.guild.ownerId !== message.author?.id)
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["variable1"]))
        ]});
      //ask for second yes
      let themsg = message.reply({embeds : [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["variable2"]))
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["reset"]["variable3"]))
      ]}).then((msg) => {
        //wait for answer of the right user
        msg.channel.awaitMessages({filter: m => m.author.id === message.author?.id,
          max: 1,
          time: 30 * 1000,
          errors: ['time']
        })
        //after right user answered
        .then(async collected => {
          //and if its yes
          if(collected.first().content.toLowerCase() === `yes`)
          {
            await clearDBData(client, message.guild.id);
            await databasing(client, message.guild.id);
            //databasing(client, message.guild.id)
            var es = await client.settings.get(message.guild.id, "embed")
            var ls = await client.settings.get(message.guild.id, "language")
            //send the success message
            return message.reply({embeds : [new MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setFooter(client.getFooter(es))
              .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["variable4"]))
              .setDescription(eval(client.la[ls]["cmds"]["settings"]["reset"]["variable5"]))
            ]});
          }
          //if an error happens, reply
        }).catch(e => {
          console.log(String(e.stack).grey.yellow)
          return message.reply({embeds :[new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["settings"]["reset"]["variable6"]))
          ]});
        })
      });
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({embeds :[new MessageEmbed()
            .setColor(es.wrongcolor)
						.setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.erroroccur)
            .setDescription(eval(client.la[ls]["cmds"]["settings"]["reset"]["variable7"]))
        ]});
    }
  }
};

