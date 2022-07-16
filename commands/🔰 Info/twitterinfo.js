const Discord = require("discord.js");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const moment = require('moment');
const twitconfig = require("../../social_log/twitter.json");
const Twit = require('twit');
const { handlemsg } = require(`../../handlers/functions`);
module.exports = {
  name: "twitterinfo",
  aliases: ["twitterinfo", "twitteruserinfo", "tuserinfo", "uinfo", "tuser", "twitteruser"],
  category: "🔰 Info",
  cooldown: 60,
  description: "Get information about a Twitter User",
  usage: "twitterinfo <TWITTERUSER>",
  type: "util",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      if(!args[0]) return message.reply(":x: Usage: twitterinfo <TWITTERUSER_NAME>")
      var T = new Twit({
        consumer_key: twitconfig.consumer_key,
        consumer_secret: twitconfig.consumer_secret,
        access_token: twitconfig.access_token,
        access_token_secret: twitconfig.access_token_secret,
        timeout_ms: twitconfig.timeout_ms,
        strictSSL: twitconfig.strictSSL,
      })
      await T.get('users/search', {
        q: `${args[0]}`,
        count: 1
      }, function (err, data, response) {
        //handlemsg(client.la[ls].cmds.info.translate.to, { to: args[1] })
        if (err) return message.reply(client.la[ls].common.usernotfound)
        var user = data[0];
        if(!user) message.reply(client.la[ls].common.usernotfound)
        var embed = new Discord.MessageEmbed()
        .setColor(`#${user.profile_background_color}`)
        .setThumbnail(user.profile_image_url_https ? user.profile_image_url_https : user.profile_image_url)
        .setFooter(client.getFooter(`ID: ${user.id_str}`, user.profile_image_url_https ? user.profile_image_url_https : user.profile_image_url))
        .addField(client.la[ls].cmds.info.twitterinfo.field1.title, `\`${user.name}\``, true)
        .addField(client.la[ls].cmds.info.twitterinfo.field2.title, `\`${moment(user.created_at).format("DD/MM/YYYY")}\`\n\`${moment(user.created_at).format("hh:mm:ss")}\``, true)
        .addField(client.la[ls].cmds.info.twitterinfo.field3.title, handlemsg(client.la[ls].cmds.info.twitterinfo.field3.value, {userfollowers : user.followers_count}), true)
        .addField(client.la[ls].cmds.info.twitterinfo.field4.title, handlemsg(client.la[ls].cmds.info.twitterinfo.field4.value, {userfriends : user.friends_count}), true)
        .addField(client.la[ls].cmds.info.twitterinfo.field5.title, handlemsg(client.la[ls].cmds.info.twitterinfo.field5.value, {userstatuses : user.statuses_count}), true)
        if(user.location) embed.addField(client.la[ls].cmds.info.twitterinfo.field6.title, `\`${user.location}\``, true)
        .setTitle(handlemsg(client.la[ls].cmds.info.twitterinfo.title, {name: user.screen_name}))
        .setURL(`https://twitter.com/${user.screen_name}`)
        if(user.description) embed.setDescription(eval(client.la[ls]["cmds"]["info"]["twitterinfo"]["variable1"]))
        message.reply({embeds: [embed]})
      })
    } catch (e) {
      console.error(e)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
      ]});
    }
    return;
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
