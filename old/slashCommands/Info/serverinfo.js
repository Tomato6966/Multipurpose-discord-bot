const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`)
var ee = require(`${process.cwd()}/botconfig/embed.json`)
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const moment = require("moment")
const { swap_pages, handlemsg } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "serverinfo",
  description: "Shows info about a server",
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    //things u can directly access in an interaction!
    const { member, channelId, guildId, applicationId, commandName, deferred, replied, ephemeral, options, id, createdTimestamp } = interaction; 
    const { guild } = member;
    
    try {
      function trimArray(arr, maxLen = 25) {
        if (arr.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length > maxLen) {
          const len = arr.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length - maxLen;
          arr = arr.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).sort((a, b) => b?.rawPosition - a.rawPosition).slice(0, maxLen);
          arr.map(role => `<@&${role.id}>`)
          arr.push(`${len} more...`);
        }
        return arr.join(", ");
      }
      function emojitrimarray(arr, maxLen = 20) {
        if (arr.length > maxLen) {
          const len = arr.length - maxLen;
          arr = arr.slice(0, maxLen);
          arr.push(`${len} more...`);
        }
        return arr.join(", ");
      }
      guild.owner = await guild.fetchOwner().then(m => m.user)
      message.guild = guild;
      await message.guild.members.fetch();
      
      let boosts = message.guild.premiumSubscriptionCount;
      var boostlevel = 0;
      if (boosts >= 2) boostlevel = "1";
      if (boosts >= 15) boostlevel = "2";
      if (boosts >= 30) boostlevel = "3 / ∞";
      let maxbitrate = 96000;
      if (boosts >= 2) maxbitrate = 128000;
      if (boosts >= 15) maxbitrate = 256000;
      if (boosts >= 30) maxbitrate = 384000;
        interaction?.reply({ephemeral: true, embeds: [new Discord.MessageEmbed()
        .setAuthor(client.la[ls].cmds.info.serverinfo.author + " " +  message.guild.name, message.guild.iconURL({
          dynamic: true
        }), "https://discord.com/api/oauth2/authorize?client_id=734513783338434591&permissions=8&scope=bot%20applications.commands")
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .addField(client.la[ls].cmds.info.serverinfo.field1, `${message.guild.owner}\n\`${message.guild.owner.tag}\``, true)
        .addField(client.la[ls].cmds.info.serverinfo.field2, "\`" + moment(message.guild.createdTimestamp).format("DD/MM/YYYY") + "\`\n" + "`"+ moment(message.guild.createdTimestamp).format("hh:mm:ss") +"`", true)
        .addField(client.la[ls].cmds.info.serverinfo.field3, "\`" + moment(message.member.joinedTimestamp).format("DD/MM/YYYY") + "\`\n" + "`"+ moment(message.member.joinedTimestamp).format("hh:mm:ss") +"`", true)
      
        .addField(client.la[ls].cmds.info.serverinfo.field4, "👁‍🗨 \`" + message.guild.channels.cache.size + "\`", true)
        .addField(client.la[ls].cmds.info.serverinfo.field5, "💬 \`" + message.guild.channels.cache.filter(channel => channel.type == "GUILD_TEXT").size + "\`", true)
        .addField(client.la[ls].cmds.info.serverinfo.field6, "🔈 \`" + message.guild.channels.cache.filter(channel => channel.type == "GUILD_VOICE").size + "\`", true)
       
        .addField(client.la[ls].cmds.info.serverinfo.field7, "😀 \`" + message.guild.memberCount + "\`", true)
        .addField(client.la[ls].cmds.info.serverinfo.field8, "👤 \`" + message.guild.members.cache.filter(member => !member.user.bot).size + "\`", true)
        .addField(client.la[ls].cmds.info.serverinfo.field9, "🤖 \`" + message.guild.members.cache.filter(member => member.user.bot).size + "\`", true)
        
        .addField(client.la[ls].cmds.info.serverinfo.field10, "🟢 \`" + message.guild.members.cache.filter(member => member.presence && member.presence.status != "offline").size + "\`", true)
        .addField(client.la[ls].cmds.info.serverinfo.field11, ":black_circle:\`" + message.guild.members.cache.filter(member => !member.presence || member.presence.status == "offline").size + "\`", true)

        .addField(client.la[ls].cmds.info.serverinfo.field12, "<a:nitro_logo:833402717950836806> \`" + message.guild.premiumSubscriptionCount + "\`", true)
        .addField(client.la[ls].cmds.info.serverinfo.field13, "<a:nitro:833402717506502707> \`" + boostlevel + "\`", true)
        .addField(client.la[ls].cmds.info.serverinfo.field14, "👾 \`" + maxbitrate + " kbps\`", true)
        
        .addField(eval(client.la[ls]["cmds"]["info"]["serverinfo"]["variablex_1"]), eval(client.la[ls]["cmds"]["info"]["serverinfo"]["variable1"]))
        .addField(eval(client.la[ls]["cmds"]["info"]["serverinfo"]["variablex_2"]), eval(client.la[ls]["cmds"]["info"]["serverinfo"]["variable1"]))
        .setThumbnail(message.guild.iconURL({
          dynamic: true
        }))
        .setFooter(client.getFooter("ID: " + message.guild.id, message.guild.iconURL({
          dynamic: true
        })))]});
     
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
