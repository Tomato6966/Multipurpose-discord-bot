const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { GetUser, GetGlobalUser, handlemsg, nFormatter, swap_pages2 } = require(`../../handlers/functions`)
module.exports = {
  name: "invitesleaderboard",
  aliases: ["inviteslb"],
  category: "🔰 Info",
  description: "See the Leaderboard of the Invites in this Guild!",
  usage: "invitesleaderboard",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      
      await message.guild.members.fetch().catch(() => null);

      let invites = await client.invitesdb.all();

      const filtered = invites.filter(p => p.guildId === message.guild.id).map(d => {
        let {
          invites,
          fake,
          leaves,
        } = d;
        if(invites < 0) invites *= -1;
        if(fake < 0) fake *= -1;
        if(leaves < 0) leaves *= -1;
        let realinvites = invites - fake - leaves;
        let usertag = message.guild.members.cache.get(d.id)?.user?.tag || false;
        if(!usertag) return null;
        return {
          id: d.id,
          usertag,
          invites: realinvites
        };
      }).filter(Boolean)
      if(!filtered || filtered.length < 1) return message.reply("There are no invites in this Guild yet!");
      const sorted = filtered.sort((a, b) => {
        if (a.invites > b.invites) {
          return -1;
        } else if (b.invites > a.invites) {
          return 1;
        } else {
          return 0;
        }
      });
      let maxnum = sorted.length;
      if(maxnum < 25) maxnum = 25;
      var embeds = [];
      let j = 0;
      var userrank = false;
      for (let i = 25; i <= maxnum; i += 25) {
          const top = sorted.slice(i - 25, i);
          const embed = new Discord.MessageEmbed()
              .setTitle("Invites Leaderboard")
              .setTimestamp()
              .setColor(es.color);
          var string = "";
          for (const data of top) {
              j++;
              if(j == 1) string += `:first_place: ${data.id == message.author?.id ? "__" : ""}**${data.usertag}**: \`Invites: ${data.invites}\`${data.id == message.author?.id ? "__" : ""}\n`;
              else if(j == 2) string += `:second_place: ${data.id == message.author?.id ? "__" : ""}**${data.usertag}**: \`Invites: ${data.invites}\`${data.id == message.author?.id ? "__" : ""}\n`;
              else if(j == 3) string += `:third_place: ${data.id == message.author?.id ? "__" : ""}**${data.usertag}**: \`Invites: ${data.invites}\`${data.id == message.author?.id ? "__" : ""}\n`;
              else string += `${data.id == message.author?.id ? "__" : ""}\`${j}\`. **${data.usertag}**: \`Invites: ${data.invites}\`${data.id == message.author?.id ? "__" : ""}\n`;
              if(data.id == message.author?.id) userrank = j;
          }
          embed.setDescription(string.substring(0, 2048))
          embeds.push(embed);
      }
      swap_pages2(client, message, embeds.map(e => e.setFooter(client.getFooter(`You are #${userrank} on the Leaderboard`))))
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

