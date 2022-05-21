const {
  MessageEmbed, MessageActionRow
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { MessageButton } = require('discord.js')
const dash = `\n❯ Dashboard: www.milrato.com`
module.exports = {
  name: "support",
  category: "🔰 Info",
  usage: "invite",
  description: "Sends you the Support Server Link",
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      //
      let button_public_invite = new MessageButton().setStyle('LINK').setEmoji("863876115584385074").setLabel('Invite me').setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
      let button_support_dc = new MessageButton().setStyle('LINK').setEmoji("936723374644789370").setLabel('Support Server').setURL("https://discord.gg/milrato")//array of all buttons
      let button_dash = new MessageButton().setStyle('LINK').setEmoji("867777823817465886").setLabel('Dashboard-Website').setURL("https://milrato.com")//array of all buttons
      const allbuttons = [new MessageActionRow().addComponents([button_public_invite, button_support_dc, button_dash])]
      message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.color)
          .setTitle(client.la[ls].cmds.info.support.title)
          .setDescription(`  •  [Support Discord]()\n  •  [Self-Hosting-Wiki](https://github.com/Tomato6966/Multipurpose-discord-bot)\n  •  [Website / Dashboard](https://milrato.com)\n  •  [Website / Status](https://status.milrato.com)\n  •  [Website / Development](https://milrato.dev)\n  •  [Invite](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)`)
          .setFooter(client.getFooter('Milrato'+dash, 'https://imgur.com/jPItIw0.gif'))
          .setURL("https://discord.com/api/oauth2/authorize?client_id=784364932149280778&permissions=8&scope=bot%20applications.commands")],
        components: allbuttons
      });
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
