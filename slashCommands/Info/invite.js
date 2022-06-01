const {
    MessageEmbed
  } = require("discord.js");
  const config = require("../../botconfig/config.json");
  var ee = require("../../botconfig/embed.json");
  const settings = require("../../botconfig/settings.json");
  const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
  module.exports = {
    name: "invite", //the command name for execution & for helpcmd [OPTIONAL]
    cooldown: 5, //the command cooldown for execution & for helpcmd [OPTIONAL]
    description: "Sends you an invite link", //the command description for helpcmd [OPTIONAL]
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    run: async (client, interaction) => {
      try {
        //things u can directly access in an interaction!
        let es = await client.settings.get(interaction.guild.id+ ".embed") 
        let ls = await client.settings.get(interaction.guild.id+ ".language")
        const {
          member,
          channelId,
          guildId,
          applicationId,
          commandName,
          deferred,
          replied,
          ephemeral,
          options,
          id,
          createdTimestamp
        } = interaction;
        const {
          guild
        } = member;
        interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed().setColor(es.color)
            .setFooter(ee.footertext, ee.footericon)
            .setDescription(`[**${client.la[ls].cmds.info.inviteslash.click}**](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)\n\n||[**${client.la[ls].cmds.info.inviteslash.clickwithout}**](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)||`)
          ]
        });
      } catch (e) {
        console.log(String(e.stack).bgRed)
      }
    }
  }