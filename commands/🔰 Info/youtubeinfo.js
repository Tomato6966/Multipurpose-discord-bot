const Discord = require("discord.js");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const moment = require('moment');
const {
  databasing,
  delay,
  getLatestVideos,
  channelInfo
} = require('../../handlers/functions');
const {
  MessageButton,
  MessageActionRow
} = require('discord.js')
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: "youtubeinfo",
  aliases: ["ytinfo", "youtubeuserinfo", "ytuserinfo", "ytuser", "youtubeuser"],
  category: "🔰 Info",
  description: "Get information about a Youtube Channel-Link",
  usage: "youtubeinfo <YOUTUBECHANNELLINK>",
  type: "util",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      let button_back = new MessageButton().setStyle('PRIMARY').setCustomId('1').setLabel("<< Back")
      let button_forward = new MessageButton().setStyle('PRIMARY').setCustomId('3').setLabel('Forward >>')
      const allbuttons = [new MessageActionRow().addComponents([button_back, button_forward])]
      let url = args[0];
      if (url && typeof url == "string") {
        if (url.match(/^https?:\/\/(www\.)?youtube\.com\/(channel\/UC[\w-]{21}[AQgw]|(c\/|user\/)?[\w-]+)$/) == null)
          return message.reply({embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].cmds.info.youtubeinfo.error1)
            .setTitle(client.la[ls].cmds.info.youtubeinfo.example)
            .setDescription(handlemsg(client.la[ls].cmds.info.youtubeinfo.example, {
              prefix: prefix
            }))
          ]});
      } else {
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].cmds.info.youtubeinfo.error1)
          .setDescription(handlemsg(client.la[ls].cmds.info.youtubeinfo.example, {
            prefix: prefix
          }))
        ]});
      }
      let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed().setColor(es.color)
        .setAuthor(client.la[ls].cmds.info.youtubeinfo.loading, "https://cdn.discordapp.com/emojis/756773010123522058.gif", "https://discord.gg/milrato")]})
      let Channel = await channelInfo(url)
      let embed = new Discord.MessageEmbed()
        .setTitle(Channel.name)
        .setURL(Channel.url)
        .setColor("RED")
        .addField(client.la[ls].cmds.info.youtubeinfo.field1, "`" + Channel.subscribers + "`")
        .addField(client.la[ls].cmds.info.youtubeinfo.field2, Channel.tags.map(t => `\`${t}\``).join(",  "))
        .addField(client.la[ls].cmds.info.youtubeinfo.field3, Channel.unlisted ? "✅" : "❌", true)
        .addField(client.la[ls].cmds.info.youtubeinfo.field4, Channel.familySafe ? "✅" : "❌", true)
        .setFooter("ID: " + Channel.id)
        .setImage(Channel.mobileBanner[0] ? Channel.mobileBanner[0].url : null)
        .setDescription(String(Channel.description).substring(0, 1500))
      let Videos = await getLatestVideos(url)
      let embed2 = new Discord.MessageEmbed()
        .setTitle(handlemsg(client.la[ls].cmds.info.youtubeinfo.videosof, {
          author: Videos[0].author
        }))
        .setColor("RED")
        .setURL(url)
      //For Each Video, add a new Field (just the first 10 Videos!)
      Videos.forEach((v, i) => {
        if (i < 10) {
          embed2.addField(v.title, handlemsg(client.la[ls].cmds.info.youtubeinfo.videos, {
            date: v.pubDate,
            link: v.link
          }))
        }
      })
      //Send the Message
      let pagemsg = await tempmsg.edit({
        embeds:  [embed],
        components: allbuttons
      })
      //create a collector for the thinggy
      const collector = pagemsg.createMessageComponentCollector({filter: (i) => i?.isButton() && i?.user && i?.user.id == cmduser.id && i?.message.author.id == client.user.id,
        time: 180e3
      }); //collector for 5 seconds
      //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
      var edited = false;
      var embeds = [embed, embed2]
      let currentPage = 0;
      collector.on('collect', async b => {
        if (b?.user.id !== message.author.id)
          return b?.reply(handlemsg(client.la[ls].cmds.info.youtubeinfo.error2, {
            prefix: prefix
          }))
        //page forward
        if (b?.customId == "1") {
          //b?.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
          if (currentPage !== 0) {
            await pagemsg.edit({
              embeds:  [embeds[currentPage]],
              components: allbuttons
            });
            await b?.deferUpdate();
          } else {
            currentPage = embeds.length - 1
            await pagemsg.edit({
              embeds:  [embeds[currentPage]],
              components: allbuttons
            });
            await b?.deferUpdate();
          }
        }

        //go forward
        else if (b?.customId == "3") {
          //b?.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
          if (currentPage < embeds.length - 1) {
            currentPage++;
            await pagemsg.edit({
              embeds:  [embeds[currentPage]],
              components: allbuttons
            });
            await b?.deferUpdate();
          } else {
            currentPage = 0
            await pagemsg.edit({
              embeds:  [embeds[currentPage]],
              components: allbuttons
            });
            await b?.deferUpdate();
          }
        }
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
