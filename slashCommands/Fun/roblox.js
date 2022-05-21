const Discord = require("discord.js");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const request = require("request");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: "roblox",
  aliases: [""],
  category: "🕹️ Fun",
  description: "IMAGE CMD",
  usage: "roblox @User",
  type: "user",
  options: [
    { "User": { name: "which_user", description: "From Which User do you want to get ... ?", required: false } }, //to use in the code: interacton.getUser("ping_a_user")
  ],
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
    //send loading message
    await interaction?.deferReply({ephemeral: false});
    //find the USER
    let user = interaction?.options.getUser("which_user");
    if (!user) user = interaction?.member.user;
    //get avatar of the user
    var avatar = user.displayAvatarURL({ format: "png" });
    //get the memer image
    client.memer.roblox(avatar).then(image => {
      //make an attachment
      var attachment = new MessageAttachment(image, "roblox.png");
      //send new Message
      interaction?.editReply({
        embeds: [new MessageEmbed()
          .setColor(es.color)
          .setFooter(client.getFooter(es))
          .setAuthor(`Meme for: ${user.tag}`, avatar)
          .setImage("attachment://roblox.png")
        ], files: [attachment]
      }).catch(() => null)
    })

  }
}

