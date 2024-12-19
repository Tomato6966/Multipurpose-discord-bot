const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const customEmojis = require(`${process.cwd()}/botconfig/customEmojis.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require("../../botconfig/emojis.json");
module.exports = {
  name: "toggledjonly",
  aliases: ["adddjonly", "djonly", "setdjonly", ""],
  category: "⚙️ Settings",
  description: "Set's a Command to the DJ ONLY State, by typing it again, it gets to not DJ ONLY aka its a toggle",
  usage: "adddj @role",
  memberpermissions: ["ADMINISTRATOR"],
  run: async (client, message, args, cmduser, text, prefix) => {

    let es = client.settings.get(message.guild.id, "embed"); let ls = client.settings.get(message.guild.id, "language")
    try {

      //get the role of the mention
      let cmd = args[0]
      //if no pinged role return error
      if (!cmd)
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable1"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable2"]))
          ]
        });

      let musiccmds = [];
      const commands = (category) => {
        return client.commands.filter((cmd) => cmd.category.toLowerCase().includes("music")).map((cmd) => `${cmd.name}`);
      };
      for (let i = 0; i < client.categories.length; i += 1) {
        if (client.categories[i].toLowerCase().includes("music")) {
          musiccmds = commands(client.categories[i]);
        }
      }
      if (musiccmds.join(" ").toLowerCase().split(" ").includes(args[0].toLowerCase())) {
        //if its in then its dj only so remove it
        if (client.settings.get(message.guild.id, `djonlycmds`).join(" ").toLowerCase().split(" ").includes(args[0].toLowerCase())) {
          try {
            client.settings.remove(message.guild.id, args[0], `djonlycmds`);
            return message.reply({
              embeds: [new MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable3"].replace(":yes:", customEmojis.general.yes)))
                .setDescription(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable4"]))
              ]
            });
          } catch (e) {
            console.log(e.stack ? String(e.stack).grey : String(e).grey);
            return message.reply({
              embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable5"].replace(":no:", customEmojis.general.no)))
                .setDescription(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable6"]))
              ]
            });
          }
        }
        else {
          try {
            client.settings.push(message.guild.id, args[0], `djonlycmds`);
            return message.reply({
              embeds: [new MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable7"].replace(":yes:", customEmojis.general.yes)))
                .setDescription(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable8"]))
              ]
            });
          } catch (e) {
            console.log(e.stack ? String(e.stack).grey : String(e).grey);
            return message.reply({
              embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable9"].replace(":no:", customEmojis.general.no)))
                .setDescription(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable10"]))
              ]
            });
          }
        }
      } else {
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable11"].replace(":no:", customEmojis.general.no)))
          ]
        });
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur.replace(":no:", customEmojis.general.no))
          .setDescription(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable12"]))
        ]
      });
    }
  }
};

/**
  * @INFO
  * Bot Coded by Tomato#6966 | https://discord.gg/milrato
  * @INFO
  * Work for Milrato Development | https://milrato.eu
  * @INFO
  * Please mention him / Milrato Development, when using this Code!
  * @INFO
*/
