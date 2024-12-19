const {
  MessageEmbed,
  Permissions
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: `unban`,
  category: `🚫 Administration`,
  aliases: [`unbanhammer`],
  description: `Unbans a Member from this Guild`,
  usage: `unban <ID>`,
  memberpermissions: ["ADMINISTRATOR"],
  type: "member",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")

    try {
      if(!message.guild.me.permissions.has([Permissions.FLAGS.BAN_MEMBERS]))      
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable1"]))
        ]})
      //databasing(client, message.guild.id, message.author.id);
      //message.guild.members.unban("564036254111629332");
      if(!args[0])
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(`${emoji?.msg.ERROR} Please add a valid USERID`)
          .setDescription(`Usage: \`${prefix}unban <ID>\`\nExample: \`${prefix}unban ${message.author.id}\``)
        ]});
      
      let bans = await message.guild.bans.fetch().catch(() => {});
      if (!bans.map(b=>b?.user.id).includes(args[0]))
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(`${emoji?.msg.ERROR} The User with that Id is not banned in this Server!`)
          .setDescription(`Type: \`${prefix}listbans\` to see all Bans!`)
        ]});
      try{
        let banuser = bans.map(b=>b?.user).find(u => u.id == args[0]);
        message.guild.members.unban(banuser ? banuser.id : args[0]);
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.color)
          .setFooter(client.getFooter(es))
          .setTitle(`${emoji?.msg.SUCCESS} Successfully Unbanned ${banuser ? banuser.tag : args[0]}`)
          .setDescription(`Type: \`${prefix}listbans\` to see all ${bans.size - 1} Bans!`)
        ]});
      } catch (e){
        console.log(e.stack ? String(e.stack).grey : String(e).grey)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable10"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["ban"]["variable11"]))
        ]});
      }
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
