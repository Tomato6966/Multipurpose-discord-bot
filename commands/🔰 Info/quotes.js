const Discord = require("discord.js");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  swap_pages, dbEnsure
} = require(`../../handlers/functions`)
const moment = require("moment");
module.exports = {
  name: "quotes",
  aliases: ["quos", "quote"],
  category: "🔰 Info",
  description: "Shows the Quotes which are saved on this User/you",
  usage: "quotes [@USER]",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      //"HELLO"
      var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if(member){
        args.shift();
      } else {
        member = message.member;
      }
      var { user } = member;
      await dbEnsure(client.afkDB, user.id, {
        quotes: [
          /*
          { by: "id", text: "", image: null, at: Date.now(), }
          */
        ]
      })
      let data = await client.afkDB.get(user.id+".quotes")
      data = data.sort((a,b)=> a.at - b?.at);
      if(args[0] && !isNaN(args[0])){
        if(Number(args[0]) < 0 || Number(args[0]) > data.length - 1 || !data[Number(args[0])] || !data[Number(args[0])].text){
          return message.reply(`:x: **Invalid Quote ID!**\n> Use one between \`0\` and \`${data.length - 1}\``)
        }
        let embed = new MessageEmbed()
          .setColor(es.color)
          .setFooter(user.id, user.displayAvatarURL({dynamic: true}))
          .addField("**Quote by:**", `<@${data[Number(args[0])].by}>`)
          .addField("**Quote at:**", `\`\`\`${moment(data[Number(args[0])].at).format("DD/MM/YYYY HH:mm")}\`\`\``)
          .setTitle("**Quote Text:**")
          .setDescription(`${String(data[Number(args[0])].text).substring(0, 2000)}`)
        if(data[Number(args[0])].image){
          embed.setImage(data[Number(args[0])].image)
        }
        return message.reply({embeds: [
          embed
        ]})
      }
      if(!data || data.length == 0) return message.reply({content: ":x: **This User has no Quotes in this Server yet!**"})
      var datas = data.map((data, index) => 
        `\` ${index}. \` By: <@${data.by}> | At: \`${moment(data.at).format("DD/MM/YYYY HH:mm")}\` \n> ${String(data.text).length > 80 ? String(data.text).substring(0, 75) + " ..." : String(data.text)}\n`
        );
      swap_pages(client, message, datas, `Quotes of **\`${user.tag}\`** in **\`${message.guild.name}\`**\n*(Sorted after Date)*\n For more details type:\n> \`${prefix}quotes ${user.id} [ID]\``);
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

