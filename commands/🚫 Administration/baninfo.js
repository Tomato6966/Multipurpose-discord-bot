const {
  MessageEmbed,
  Permissions
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  databasing, swap_pages
} = require(`../../handlers/functions`);
module.exports = {
  name: `baninfo`,
  category: `🚫 Administration`,
  aliases: ["infoban"],
  description: `Shows information of a Ban`,
  usage: `baninfo <ID/Ping>`,
  type: "server",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    

    try {
      if(!message.guild.me.permissions.has([Permissions.FLAGS.BAN_MEMBERS]))      
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable1"]))
        ]})
        //databasing(client, message.guild.id, message.author?.id);
        let adminroles = GuildSettings?.adminroles || [];
        let cmdroles = GuildSettings?.cmdadminroles?.ban || [];
        var cmdrole = []
        if (cmdroles.length > 0) {
          for (const r of cmdroles) {
            if (message.guild.roles.cache.get(r)) {
              cmdrole.push(` | <@&${r}>`)
            } else if (message.guild.members.cache.get(r)) {
              cmdrole.push(` | <@${r}>`)
            } else {
              const File = `ban`;
              let index = GuildSettings && GuildSettings.cmdadminroles && typeof GuildSettings.cmdadminroles == "object" ? GuildSettings.cmdadminroles[File]?.indexOf(r) || -1 : -1;
              if(index > -1) {
                GuildSettings.cmdadminroles[File].splice(index, 1);
                client.settings.set(`${message.guild.id}.cmdadminroles`, GuildSettings.cmdadminroles)
              }
            }
          }
        }
        if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author?.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author?.id) && !message.member?.permissions?.has([Permissions.FLAGS.ADMINISTRATOR]))
          return message.reply({embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable2"]))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable3"]))
          ]});
      if(!args[0]) {
        return message.reply(`You need to ping a Member / Add the id to the command, e.g: \`${prefix}baninfo 442355791412854784\``)
      }
      const id = message.mentions.users.first()?.id || args[0];

      const ban = await message.guild.bans.fetch(id).catch(() => null)
      
      if(!ban) {
        return message.reply(`There is no ban with the ID \`${id}\``);
      }
      
      message.reply({
        embeds: [
          new MessageEmbed()
            .setColor(es.color)
            .setFooter(client.getFooter(es))
            .setTitle(`🔨 Ban Information about ${ban.user.username}#${ban.user.discriminator}`)
            .addField("Tag:", `\`\`\`${ban.user.username}#${ban.user.discriminator}\`\`\``)
            .addField("Id:", `\`\`\`${ban.user.id}\`\`\``)
            .addField("Bot:", `\`\`\`${ban.user.bot ? "✅" : "❌"}\`\`\``)
            .setThumbnail(ban.user.displayAvatarURL())
            .addField("Reason:", `\`\`\`${ban.reason ? ban.reason?.substring(0, 1000) : "No Reason"}\`\`\``)
        ]
      })
    } catch (e) {
      console.error(e)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable18"]))
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable19"]))
      ]});
    }
  }
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
