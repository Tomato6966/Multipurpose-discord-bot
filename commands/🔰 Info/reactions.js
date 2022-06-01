/*const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: "reactions",
  category: "🔰 Info",
  aliases: ["reacts"],
  cooldown: 5,
  usage: "reactions",
  description: "Gives you Information, which reaction dues what",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      
      message.reply({embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setTitle(eval(client.la[ls]["cmds"]["info"]["reactions"]["variable1"]))
        .setFooter(client.getFooter(es))
        .addField(`\u200b`, `${emoji?.msg.rewind} Rewind 20 seconds\n${emoji?.msg.forward} Forward 20 seconds\n${emoji?.msg.pause_resume} Pause/Resume\n${emoji?.msg.stop} Stop Track\n${emoji?.msg.previous_track} Play previous\n`, true)
        .addField(`\u200b`, `${emoji?.msg.skip_track} Skip / Next\n${emoji?.msg.replay_track} Replay Track\n${emoji?.msg.reduce_volume} Volume -10 %\n${emoji?.msg.raise_volume} Volume +10 %\n${emoji?.msg.toggle_mute} Toggle Volume Mute`, true)
        .addField(`\u200b`, `${emoji?.msg.repeat_mode} Change repeat mode\n${emoji?.msg.autoplay_mode} Toggle Autoplay\n${emoji?.msg.shuffle} Shuffle the queue\n${emoji?.msg.show_queue} Show the Queue\n${emoji?.msg.show_current_track} Shows Current Track`, true)
      ]});
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["reactions"]["variable2"]))
      ]});
    }
  }
}
*/
