const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { GetUser, GetGlobalUser, handlemsg, nFormatter } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "invites",
  aliases: ["invitecount"],
  category: "🔰 Info",
  description: "See how many Invites a user has!",
  usage: "invites [@USER]",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      var user;
      try{
        user = await GetUser(message, args)
      }catch (e){
        return message.reply({content: String('```' + e.message ? String(e.message).substring(0, 1900) : String(e) + '```')})
      }      
      // Fetch guild and member data from the db
      client.invitesdb?.ensure(message.guild.id + user.id, {
        /* REQUIRED */
        id: user.id, // Discord ID of the user
        guildId: message.guild.id,
        /* STATS */
        fake: 0,
        leaves: 0,
        invites: 0,
        /* INVITES DATA */
        invited: [],
        left: [],
        /* INVITER */
        invitedBy: "",
        usedInvite: {},
        joinData: {
          type: "unknown",
          invite: null
        }, // { type: "normal" || "oauth" || "unknown" || "vanity", invite: inviteData || null }
        messagesCount: 0,
        /* BOT */
        bot: user.bot || false
      });
      //get the new memberdata
      let memberData = client.invitesdb?.get(message.guild.id + user.id)
      let {
        invites,
        fake,
        leaves,
        messagesCount
      } = memberData;
      if(invites < 0) invites *= -1;
      if(fake < 0) fake *= -1;
      if(leaves < 0) leaves *= -1;
      if(messagesCount < 0) messagesCount *= -1;
      let realinvites = invites - fake - leaves;
        invites = nFormatter(invites, 2);
        fake = nFormatter(fake, 2);
        leaves = nFormatter(leaves, 2);
        messagesCount = nFormatter(messagesCount, 3);
      message.reply({embeds: [new Discord.MessageEmbed()
        .setAuthor(handlemsg(client.la[ls].cmds.info.invites.author, {usertag: user.tag}), user.displayAvatarURL({dynamic: true}), "https://discord.gg/milrato")
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .addField("\u200b", handlemsg(client.la[ls].cmds.info.invites.field1.value, {realinvites: realinvites, user: user}))
        .addField(client.la[ls].cmds.info.invites.field2.title, handlemsg(client.la[ls].cmds.info.invites.field2.value, {invites: invites, fake: fake, leaves: leaves}))
        .addField(client.la[ls].cmds.info.invites.field3.title, `>>> \`\`\`yml\nJoins - Fakes - Leaves = RealInvites\n${invites}${" ".repeat("Joins ".length -String(invites).length)}- ${fake}${" ".repeat("Fakes ".length -String(fake).length)}- ${leaves}${" ".repeat("Leaves ".length -String(leaves).length)}= ${realinvites}\n\`\`\``)
        .addField(client.la[ls].cmds.info.invites.field4.title, handlemsg(client.la[ls].cmds.info.invites.field4.value, {messagesCount: messagesCount}))
        .setFooter(client.getFooter(es))]});
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
/*
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
