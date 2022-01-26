const {
  MessageEmbed,
  Permissions
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  databasing, swap_pages
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: `bans`,
  category: `🚫 Administration`,
  aliases: [`listbans`, "list-bans"],
  description: `Shows all Bans of this Server`,
  usage: `bans`,
  type: "server",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")

    try {
      if(!message.guild.me.permissions.has([Permissions.FLAGS.BAN_MEMBERS]))      
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable1"]))
        ]})
        //databasing(client, message.guild.id, message.author.id);
        let adminroles = client.settings.get(message.guild.id, "adminroles")
        let cmdroles = client.settings.get(message.guild.id, "cmdadminroles.ban")
        var cmdrole = []
        if (cmdroles.length > 0) {
          for (const r of cmdroles) {
            if (message.guild.roles.cache.get(r)) {
              cmdrole.push(` | <@&${r}>`)
            } else if (message.guild.members.cache.get(r)) {
              cmdrole.push(` | <@${r}>`)
            } else {
              //console.log(r)
              client.settings.remove(message.guild.id, r, `cmdadminroles.ban`)
            }
          }
        }
        if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author.id) && !message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]))
          return message.reply({embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable2"]))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable3"]))
          ]});
      let allbans = await message.guild.bans.fetch().catch(() => {}).then(bans => bans.map(ban => `**${ban.user.username}**#${ban.user.discriminator} (\`${ban.user.id}\`)\n**Reason**:\n> ${ban.reason ? ban.reason : "No Reason"}\n`)); 
      swap_pages(client, message, allbans, `🔨 All Bans of **${message.guild.name}**`);      
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
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
