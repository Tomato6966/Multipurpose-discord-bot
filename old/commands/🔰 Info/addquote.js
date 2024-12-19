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
  name: "addquote",
  aliases: ["aquote", "addquotes"],
  category: "🔰 Info",
  description: "Adds a Quote to a User/you",
  usage: "addquote [@USER] <TEXT> [Attachment of an Image]",
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
      let quotetext = args.join(" ");
      let image = null;
      let by = message.author.id;
      let at = Date.now();
      if (message.attachments.size > 0){
        if (message.attachments.every(attachIsImage)) {
          //image = url;
        } else {
          image = null;
        }
      }
      function attachIsImage(msgAttach) {
        image = msgAttach.url;
        return image.indexOf(`png`, image.length - 3 ) !== -1 ||
          image.indexOf(`jpeg`, image.length - 4 ) !== -1 ||
          image.indexOf(`gif`, image.length - 3) !== -1 ||
          image.indexOf(`jpg`, image.length - 3) !== -1;
      }
      client.afkDB.push(user.id,{
        text: quotetext,
        image: image,
        by: by,
        at: at,
      }, "quotes");
      message.reply("Added the Quote to his Quotes!")
      let data = client.afkDB.get(user.id, "quotes")
      if(!data || data.length == 0) return message.reply({content: ":x: **This User has no Quotes in this Server yet!**"})
      var datas = data.sort((a,b)=> b?.at - a.at).map((data, index) => 
        `\` ${index}. \` By: <@${data.by}> | At: \`${moment(data.at).format("DD/MM/YYYY HH:mm")}\` \n> ${String(data.text).length > 80 ? String(data.text).substring(0, 75) + " ..." : String(data.text)}\n`
        );
      swap_pages(client, message, datas, `Latest Quotes of **\`${user.tag}\`** in **\`${message.guild.name}\`**\n\nFor more details type: \`${prefix}quotes ${user.id} [ID]\``);
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
