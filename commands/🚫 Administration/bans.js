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
  name: `bans`,
  category: `🚫 Administration`,
  aliases: [`listbans`, "list-bans"],
  description: `Shows all Bans of this Server`,
  usage: `bans`,
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
      let allbans = await message.guild.bans.fetch().catch(() => null).then(bans => bans.map(ban => `**${ban.user.username}**#${ban.user.discriminator} (\`${ban.user.id}\`)\n**Reason**:\n> ${ban.reason ? ban.reason : "No Reason"}\n`)); 
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

