const Discord = require("discord.js");
const Canvas = require("discord-canvas");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  GetUser,
  GetGlobalUser,
  handlemsg,dbEnsure 
} = require(`../../handlers/functions`)
module.exports = {
  name: "fnstats",
  aliases: ["fortnitestats", "fstats"],
  category: "🔰 Info",
  description: "Shows the Fortnite Stats of a User",
  usage: "fnstatns @USER | fnstats <platform> <Epic> | usermentions will only work if the user verification is setup",
  type: "games",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      let usermention = message.mentions.users.first();
      let Epic, platform;
      if(!usermention){
        if(!args[0] || !args[1]) {
          await dbEnsure(client.epicgamesDB, message.author?.id, { 
            epic: "",
            user: message.author?.id,
            guild: message.guild.id,
            Platform: "",
            InputMethod: "",
          });
          let data = await client.epicgamesDB.get(message.author?.id);
          if(!data || !data.epic || data.epic.length < 5) return message.reply(`❌ **Your Account is not linked!**\nPlease enter a Epic Games name for individual Search!\n>Usage: \`fnstats <platform> <Epic>\``)
          Epic = data.epic;
          platform = data.Platform;
        } else {
          Epic = args.slice(1).join(" ");
          if(!Epic) return message.reply("Please enter a Epic Games name!\n>Usage: `fnstats <platform> <Epic>`")
          platform = String(args[0]).toLowerCase() || "PC".toLowerCase();
          if (platform !== "pc" && platform !== "xbl" && platform !== "psn") return message.channel.send("Please enter a valid platform\n> Valid Platforms: `xbl, psn, pc`\n> Usage: `fnstats <platform> <Epic>`")
        }
      } else {
        await dbEnsure(client.epicgamesDB, usermention.id, { 
          epic: "",
          user: usermention.id,
          guild: message.guild.id,
          Platform: "",
          InputMethod: "",
        });
        let data = await client.epicgamesDB.get(usermention.id);
        if(!data || !data.epic || data.epic.length < 5) return message.reply(`❌ **${usermention.tag}** did not verify/connect their Epic Games Account`)
        Epic = data.epic;
        platform = data.Platform;
      }
      try{
        if (platform !== "pc" && platform !== "xbl" && platform !== "psn") platform = "pc";
        let themsg = await message.reply(`<a:Loading:950883677255118898> Getting the Fortnite Stats of ${Epic}`)
        const stats = new Canvas.FortniteStats()
        const image = await stats.setToken(
          process.env.fortnitetracker || config.fortnitetracker
          )
          .setUser(Epic)
          .setPlatform(platform.toLowerCase())
          .toAttachment();
        if (!image) return message.channel.send("User not found / Epic INvalid")
        let attachment = new Discord.MessageAttachment(image.toBuffer(), "FortniteStats.png");
        themsg.edit({content: `Stats of: \`${Epic}\` on \`${platform}\``, files: [attachment]});
      }catch (e){
        console.error(e)
        message.channel.send("EPIC INVALID").catch(() => null)
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["avatar"]["variable1"]))
      ]});
    }
  }
}

