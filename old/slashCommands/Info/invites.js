const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { GetUser, GetGlobalUser, handlemsg, nFormatter } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "invites",
  description: "See how many Invites a user has!",
  options: [ 
		//{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
		//{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
		{"User": { name: "which_user", description: "From Which User do you want to see the Invites?", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
		//{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
		//{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
		//{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
		//{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    //things u can directly access in an interaction!
		const { member, channelId, guildId, applicationId, commandName, deferred, replied, ephemeral, options, id, createdTimestamp } = interaction; 
    const { guild } = member;
    let user = options.getUser("which_user");
    if(!user) user = member.user;
    try{
      // Fetch guild and member data from the db
      client.invitesdb?.ensure(guild.id + user.id, {
        /* REQUIRED */
        id: user.id, // Discord ID of the user
        guildId: guild.id,
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
      let memberData = client.invitesdb?.get(guild.id + user.id)
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
      interaction?.reply({ephemeral: true, embeds: [new Discord.MessageEmbed()
        .setAuthor(handlemsg(client.la[ls].cmds.info.invites.author, {usertag: user.tag}), user.displayAvatarURL({dynamic: true}), "https://discord.gg/milrato")
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .addField("\u200b", handlemsg(client.la[ls].cmds.info.invites.field1.value, {realinvites: realinvites, user: user}))
        .addField(client.la[ls].cmds.info.invites.field2.title, handlemsg(client.la[ls].cmds.info.invites.field2.value, {invites: invites, fake: fake, leaves: leaves}))
        .addField(client.la[ls].cmds.info.invites.field3.title, `>>> \`\`\`yml\nJoins - Fakes - Leaves = RealInvites\n${invites}${" ".repeat("Joins ".length -String(invites).length)}- ${fake}${" ".repeat("Fakes ".length -String(fake).length)}- ${leaves}${" ".repeat("Leaves ".length -String(leaves).length)}= ${realinvites}\n\`\`\``)
        .addField(client.la[ls].cmds.info.invites.field4.title, handlemsg(client.la[ls].cmds.info.invites.field4.value, {messagesCount: messagesCount}))
        .setFooter(client.getFooter(es))]});
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
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
