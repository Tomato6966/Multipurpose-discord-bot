const Discord = require("discord.js");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const moment = require('moment');
const TikTokScraper = require('tiktok-scraper');
const { handlemsg } = require(`${process.cwd()}/handlers/functions`) 
module.exports = {
  name: "tiktokinfo",
  aliases: ["tiktokinfo", "tiktokuserinfo", "ttuserinfo", "ttuser", "tiktokuser"],
  category: "🔰 Info",
  description: "Get information about a Twitter User",
  usage: "tiktokinfo <TWITTERUSER>",
  type: "util",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      (async () => {
        try {
            const posts = await TikTokScraper.user(args.join(" "), {
                number: 5,
            });
            if(!posts.collector[0]) return message.reply(client.la[ls].common.usernotfound) 
            author = posts.collector[0].authorMeta;
            var embed = new Discord.MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setThumbnail(author.avatar)
            .setTitle(handlemsg(client.la[ls].cmds.info.tiktokinfo.title, { name: author.name}))
            .setDescription(handlemsg(client.la[ls].cmds.info.tiktokinfo.description, { nickName: author.nickName, video: author.video, signature: author.signature, fans: author.fans, following: author.following}))
            .setFooter(client.getFooter(`ID: ${author.id_str}`, author.avatar))
            var allposts = posts.collector.map(p => {
                const Obj = {};
                Obj.id = p.id;
                Obj.url = p.webVideoUrl;
                Obj.views = p.playCount;
                Obj.shares = p.shareCount;
                Obj.comments = p.commentCount;
                Obj.mentions = p.mentions;
                Obj.hashtags = p.hashtags;
                let title = p.text;
                for(const tag of p.hashtags) title = String(title).toLowerCase().replace(String(tag.name).toLowerCase(), "")
                for(const mention of p.mentions) title = String(title).toLowerCase().replace(String(mention), "")
                Obj.title = title.split("#").join("");
                if(title.length <= 1) Obj.title = p.id;
                return Obj;
            })
            for(const post of allposts)
            embed.addField(`**${String(post.title).charAt(0).toUpperCase() + String(post.title).slice(1)}**`, handlemsg(client.la[ls].cmds.info.tiktokinfo.videos, { url: author.url, views: author.views, shares: author.shares, comments: author.comments}))
            message.reply({embeds: [embed]});
        } catch (e) {
            console.log(e.stack ? String(e.stack).grey : String(e).grey);
            return message.reply({embeds: [new MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(client.la[ls].common.erroroccur)
              .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
            ]});
        }
    })();
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
