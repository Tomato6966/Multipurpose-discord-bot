const Discord = require(`discord.js`);
const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const playermanager = require(`../../handlers/playermanager`);
const {
  createBar
} = require(`${process.cwd()}/handlers/functions`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
    module.exports = {
  name: `queuestatus`,
  category: `🎶 Music`,
  aliases: [`qs`, `queueinfo`, `status`, `queuestat`, `queuestats`, `qus`],
  description: `Shows the current Queuestatus`,
  usage: `queuestatus`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "previoussong": false
  },
  type: "queue",
  run: async (client, message, args, cmduser, text, prefix, player) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if (!client.settings.get(message.guild.id, "MUSIC")) {
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      client.settings.ensure(message.guild.id, {
        playmsg: true
      });
      //toggle autoplay
      let embed = new MessageEmbed()
      embed.setTitle(eval(client.la[ls]["cmds"]["music"]["queuestatus"]["variable1"]))
      embed.setDescription(eval(client.la[ls]["cmds"]["music"]["queuestatus"]["variable2"]))
      embed.addField(`${emoji?.msg.raise_volume} Volume`, `\`\`\`${player.volume}%\`\`\``, true)
      embed.addField(`${emoji?.msg.repeat_mode} Queue Length: `, `\`\`\`${player.queue.length} Songs\`\`\``, true)
      embed.addField(`📨 Pruning: `, `\`\`\`${client.settings.get(message.guild.id, "playmsg") ? `✅ Enabled` : `❌ Disabled`}\`\`\``, true)

      embed.addField(`${emoji?.msg.autoplay_mode} Song Loop: `, `\`\`\`${player.trackRepeat ? `✅ Enabled` : `❌ Disabled`}\`\`\``, true)
      embed.addField(`${emoji?.msg.autoplay_mode} Queue Loop: `, `\`\`\`${player.queueRepeat ? `✅ Enabled` : `❌ Disabled`}\`\`\``, true)
      embed.addField(eval(client.la[ls]["cmds"]["music"]["queuestatus"]["variablex_3"]), eval(client.la[ls]["cmds"]["music"]["queuestatus"]["variable3"]), true)

      embed.addField(`${emoji?.msg.equalizer} Equalizer: `, `\`\`\`${player.get("eq")}\`\`\``, true)
      embed.addField(`🎛 Filter: `, `\`\`\`${player.get("filter")}\`\`\``, true)
      embed.addField(`:clock1: AFK Mode`, `\`\`\`PLAYER: ${player.get("afk") ? `✅ Enabled` : `❌ Disabled`}\`\`\``, true)

      embed.setColor(es.color)

      embed.addField(eval(client.la[ls]["cmds"]["music"]["queuestatus"]["variablex_4"]), eval(client.la[ls]["cmds"]["music"]["queuestatus"]["variable4"]))
      if (player.queue && player.queue.current) {
        embed.addField(eval(client.la[ls]["cmds"]["music"]["queuestatus"]["variablex_5"]), eval(client.la[ls]["cmds"]["music"]["queuestatus"]["variable5"]))
      }
      message.reply({embeds : [embed]});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)

        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["music"]["queuestatus"]["variable6"]))
      ]});
    }
  }
};

/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github?.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
