const { MessageEmbed } = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
    name: `adddj`,
    aliases: [`adddjrole`],
    category: `⚙️ Settings`,
    description: `Let's you define a DJ ROLE (as an array, aka you can have multiple)`,
    usage: `adddj @role`,
    memberpermissions: [`ADMINISTRATOR`],
    type: "music",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    try{
      
      //get the role of the mention
      let role = message.mentions.roles.filter(role=>role.guild.id==message.guild.id).first();
      //if no pinged role return error
      if (!role)
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["adddj"]["variable1"]))
        ]});
      //try to find the role in the guild just incase he pings a role of a different server
      try {
          message.guild.roles.cache.get(role.id);
      } catch {
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["adddj"]["variable2"]))
        ]});
      }
      //if ther role is already in the Database, return error
      if(GuildSettings.djroles.includes(role.id))
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["adddj"]["variable3"]))
        ]});
      //push it into the database
      await client.settings.push(`${message.guild.id}.djroles`, role.id);
      //these lines creates a string with all djroles
      var leftb = await client.settings.get(`${message.guild.id}.djroles`).then(d => d.map(r => `<@&${r}>`));
      if (leftb?.length == 0) leftb = "`not setup`";
      else leftb = String(leftb?.join(", "));

      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["settings"]["adddj"]["variable4"]))
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["adddj"]["variable5"]))
      ]});
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
						.setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.erroroccur)
            .setDescription(eval(client.la[ls]["cmds"]["settings"]["adddj"]["variable6"]))
        ]});
    }
  }
};

