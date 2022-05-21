const fetch = require("node-fetch");
const Discord = require("discord.js");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const request = require("request");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const subreddits = [
  "memes",
  "DeepFriedMemes",
  "bonehurtingjuice",
  "surrealmemes",
  "dankmemes",
  "meirl",
  "me_irl",
  "funny"
];
const path = require("path");
module.exports = {
  name: path.parse(__filename).name,
  category: "🕹️ Fun",
  usage: `${path.parse(__filename).name} [@User]`,
  type: "user",
  description: "*Image cmd in the style:* " + path.parse(__filename).name,
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    let GuildSettings = client.settings.get(`${interaction.guild.id}`)
    if (GuildSettings.FUN === false) {
      return interaction?.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.disabled.title)
          .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, { prefix: prefix }))
        ], ephemeral: true
      });
    }
    const data = await fetch(`https://imgur.com/r/${subreddits[Math.floor(Math.random() * subreddits.length)]}/hot.json`)
      .then(response => response.json())
      .then(body => body.data);
    const selected = data[Math.floor(Math.random() * data.length)];
    if(!selected || !selected.hash) return interaction?.reply({
      content: `:x: **Could not find a new Meme...**\n> *Try again please!*`, ephemeral: true
    });
    return interaction?.reply({
      content: `https://imgur.com/${selected.hash}${selected.ext.replace(/\\?.*/, '')}`
    });
  }
}

