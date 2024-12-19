const Discord = require("discord.js");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  swap_pages
} = require(`${process.cwd()}/handlers/functions`)
const moment = require("moment");
module.exports = {
  name: "removequote",
  aliases: ["rquote", "removequotes"],
  category: "🔰 Info",
  description: "Removes a Quote from a User/you",
  usage: "removequote <@USER> <ID>",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      //"HELLO"
      var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if(member){
        args.shift();
      } else {
        member = message.member;
      }
      var { user } = member;
      if(user.id != message.author.id) {
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR))  
        {
          return message.reply(":x: **Only Admins can add Quotes to other Users!**")
        }
      }
      client.afkDB.ensure(user.id, {
        quotes: [
          /*
          { by: "id", text: "", image: null, at: Date.now(), }
          */
        ]
      })
      let data = client.afkDB.get(user.id, "quotes")
      data = data.sort((a,b) => a.at - b?.at);
      let id = String(args[0]);
      if(!id || !isNaN(id))
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(":x: Wrong command Usage!")
          .setDescription(`\`${prefix}removequote ${user.id} <QuoteId (E.G: 0 ... First Quote)>\``)
        ]});
        
      if(Number(id) < 0 || Number(id) > data.length - 1 || !data[Number(id)] || !data[Number(id)].text){
        return message.reply(`:x: **Invalid Quote ID!**\n> Use one between \`0\` and \`${data.length - 1}\`\nTo see all Quotes type: \`${prefix}quotes ${user.id}\``)
      }
      let embed = new MessageEmbed()
        .setColor(es.color)
        .setFooter(user.id, user.displayAvatarURL({dynamic: true}))
        .addField("**Quote by:**", `<@${data[Number(id)].by}>`)
        .addField("**Quote at:**", `\`\`\`${moment(data[Number(id)].at).format("DD/MM/YYYY HH:mm")}\`\`\``)
        .setTitle("**Quote Text:**")
        .setDescription(`${String(data[Number(id)].text).substring(0, 2000)}`)
      if(data[Number(id)].image){
        embed.setImage(data[Number(id)].image)
      }
      //remove the data
      data.splice(Number(id), 1);
      //set the new data
      client.afkDB.set(user.id, data, "quotes")
      //send information message
      return message.reply({embeds: [
        embed,
        new MessageEmbed()
        .setColor(es.wrongcolor)
        .setTitle(`🗑️ Removed the above showed Quoted from \`${user.tag}\``)
        .setDescription(`**${user.username}** now has **\`${data.length} Quotes\`**!`)
      ]})
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["info"]["avatar"]["variable1"]))
        ]});
    }
  }
}
/*
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
