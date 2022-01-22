const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const translate = require("translatte");
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: "translate",
  description: "Gives you an Invite link for this Bot",
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    //things u can directly access in an interaction!
    const { member, channelId, guildId, applicationId, commandName, deferred, replied, ephemeral, options, id, createdTimestamp } = interaction; 
    const { guild } = member;
    
    
    try {
      if(!args[0]) return interaction?.reply({ephemeral: true, content: handlemsg(client.la[ls].cmds.info.translate.error, {prefix: prefix})})
      if(!args[1]) return interaction?.reply({ephemeral: true, content: handlemsg(client.la[ls].cmds.info.translate.error, {prefix: prefix})})
      if(!args[2]) return interaction?.reply({ephemeral: true, content: handlemsg(client.la[ls].cmds.info.translate.error, {prefix: prefix})})

      translate(args.slice(2).join(" "), {from: args[0], to: args[1]}).then(res=>{
        let embed = new MessageEmbed()
        .setColor(es.color)
        .setAuthor(handlemsg(client.la[ls].cmds.info.translate.to, { to: args[1] }), "https://imgur.com/0DQuCgg.png", "https://discord.gg/milrato")
        .setFooter(handlemsg(client.la[ls].cmds.info.translate.from, { from: args[0] }), member.user.displayAvatarURL({dynamic:true}))
        .setDescription(eval(client.la[ls]["cmds"]["info"]["translate"]["variable1"]))
        interaction?.reply({ephemeral: true, embeds: [embed]})
        }).catch(err => {
          let embed = new MessageEmbed()
          .setColor(RED)
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(String("```"+err.stack+"```").substr(0, 2000))
          interaction?.reply({ephemeral: true, embeds: [embed]})
            console.log(err);
      });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
    }
  }
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
