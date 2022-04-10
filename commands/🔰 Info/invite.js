const {
	MessageEmbed, MessageButton, MessageActionRow
} = require("discord.js")
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { handlemsg } = require(`../../handlers/functions`)
const dash = `\n❯ Dashboard: www.milrato.com`
module.exports = {
  name: "invite",
  category: "🔰 Info",
  aliases: ["add"],
  usage: "invite",
  description: "Gives you an Invite link for this Bot",
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      let user = message.mentions.users.first() || client.user;
      if(user) {
        if(!user.bot) return interaction?.reply({ephemeral: true, content: "<:no:833101993668771842> You can't Invite a Normal user! **IT MUST BE A BOT**"})
        let button_public_invite = new MessageButton().setStyle('LINK').setEmoji("863876115584385074").setLabel('Invite me').setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
        let button_support_dc = new MessageButton().setStyle('LINK').setEmoji("936723374644789370").setLabel('Support Server').setURL("https://discord.gg/milrato")//array of all buttons
        let button_dash = new MessageButton().setStyle('LINK').setEmoji("867777823817465886").setLabel('Dashboard-Website').setURL("https://milrato.com")//array of all buttons
        const allbuttons = [new MessageActionRow().addComponents([button_public_invite, button_support_dc, button_dash])]
        message.reply({ 
          embeds: [new MessageEmbed()
            .setColor(ee.color)
            .setTitle(`Invite: __**${user.tag}**__`)
            .setDescription(`||[*Click here for an Invitelink without Slash Commands*](https://discord.com/api/oauth2/authorize?client_id=${user.id}&permissions=8&scope=bot)||`)
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${user.id}&permissions=8&scope=bot%20applications.commands`)
            .setFooter(client.getFooter(`${user.username}`+dash, "https://imgur.com/jPItIw0.gif"))],
          components: allbuttons
        });
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
      ]});
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
