const {
    MessageEmbed,
    MessageAttachment
  } = require("discord.js");
  const config = require(`${process.cwd()}/botconfig/config.json`);
  var ee = require(`${process.cwd()}/botconfig/embed.json`);
  const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
  const fetch = require("node-fetch");
  module.exports = {
    name: "chess",
    category: "🎮 MiniGames",
    type: "voice",
    description: "Generate a chess.io Link to play a game of chess with your friends (through discord)",
    usage: "chess --> Click on the Link | YOU HAVE TO BE IN A VOICE CHANNEL!",
    /*
755827207812677713 Poker Night
773336526917861400 Betrayal.io
832012586023256104 Chess
773336526917861400 End-Game
755600276941176913 YouTube Together
814288819477020702 Fishington.io
    */
    run: async (client, message, args, cmduser, text, prefix) => {
    
        let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        if(!client.settings.get(message.guild.id, "MINIGAMES")){
          return message.reply(new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          );
        }
      try {
        const { channel } = message.member.voice;
        if (!channel) return message.reply(new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["minigames"]["chess"]["variable1"]))
        );
        if (!channel.permissionsFor(channel.guild.me).has("CREATE_INSTANT_INVITE")) {
          const nochannel = new MessageEmbed()
          .setDescription(eval(client.la[ls]["cmds"]["minigames"]["chess"]["variable2"]))
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          return message.reply(nochannel);
        }
  
        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: "832012586023256104", // chess
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${config.token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(invite => {
                if (!invite.code) {
                  return message.reply(new MessageEmbed()
                  .setDescription(eval(client.la[ls]["cmds"]["minigames"]["chess"]["variable3"]))
                  .setColor(es.wrongcolor)
                  .setFooter(client.getFooter(es)));
                }

                message.reply(eval(client.la[ls]["cmds"]["minigames"]["chess"]["variable4"]));
            })
        } catch (e) {
            console.log(String(e.stack).grey.bgRed)
            return message.reply(new Discord.MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(client.la[ls].common.erroroccur)
                .setDescription(eval(client.la[ls]["cmds"]["minigames"]["chess"]["variable5"]))
            );
        }
    }
  }