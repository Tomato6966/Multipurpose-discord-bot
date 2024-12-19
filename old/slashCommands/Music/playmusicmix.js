const Discord = require(`discord.js`);
const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const songoftheday = require(`../../botconfig/songoftheday.json`);
const playermanager = require(`../../handlers/playermanager`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
    module.exports = {
  name: `playmusicmix`,
  category: `🎶 Music`,
  aliases: [`pmusicmix`, "pmm", "musicmix"],
  description: `Plays an awesome Music Mix`,
  usage: `playmusicmix`,
  parameters: {
    "type": "music",
    "activeplayer": false,
    "previoussong": false
  },
  options: [ 
    {"StringChoices": { name: "what_mix", description: "What Mix do you want?", required: true, 
    choices: [
      /*
blues, oldgaming, pop, remixes, rock, strange-fruits-gaming
      */
      ["Blues Mix", "blues"], 
      ["Charts Mix", "charts"], 
      ["Chill Mix", "chill"], 
      ["Default Mix", "default"], 
      ["Heavymetal Mix", "heavymetal"], 
      ["Gaming Mix", "gaming"], 
      ["Jazz Mix", "jazz"], 
      ["Metal Mix", "metal"], 
      ["Magic-Release Mix", "magic-release"], 
      ["NCS Mix", "ncs"], 
      ["No Copyright Mix", "nocopyright"], 
      ["Old Gaming Mix", "oldgaming"], 
      ["Pop Mix", "pop"], 
      ["Remixes Mix", "remixes"], 
      ["Rock Mix", "rock"], 
      ["Strange-Fruits Mix", "strange-fruits-gaming"], 
    ] }},
  ],

  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    
    //let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if (!client.settings.get(message.guild.id, "MUSIC")) {
      return interaction?.reply({ephemeral: true, embed : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      let link = "https://open.spotify.com/playlist/37i9dQZF1DXc6IFF23C9jj";
      let args = [interaction?.options.getString("what_mix")]
      if (args[0]) {
        //ncs | no copyrighted music
        if (args[0].toLowerCase().startsWith("n")) link = "https://open.spotify.com/playlist/7sZbq8QGyMnhKPcLJvCUFD";
        //pop
        if (args[0].toLowerCase().startsWith("p")) link = "https://open.spotify.com/playlist/37i9dQZF1DXc6IFF23C9jj";
        //default
        if (args[0].toLowerCase().startsWith("d")) link = "https://open.spotify.com/playlist/37i9dQZF1DXc6IFF23C9jj";
        //remixes from Magic Release
        if (args[0].toLowerCase().startsWith("re")) link = "https://www.youtube.com/watch?v=NX7BqdQ1KeU&list=PLYUn4YaogdahwfEkuu5V14gYtTqODx7R2"
        //rock
        if (args[0].toLowerCase().startsWith("ro")) link = "https://open.spotify.com/playlist/37i9dQZF1DWXRqgorJj26U";
        //oldgaming
        if (args[0].toLowerCase().startsWith("o")) link = "https://www.youtube.com/watch?v=iFOAJ12lDDU&list=PLYUn4YaogdahPQPTnBGCrytV97h8ABEav"
        //gaming
        if (args[0].toLowerCase().startsWith("g")) link = "https://open.spotify.com/playlist/4a54P2VHy30WTi7gix0KW6";
        //Charts
        if(args[0].toLowerCase().startsWith("cha")) link = "https://www.youtube.com/playlist?list=PLMC9KNkIncKvYin_USF1qoJQnIyMAfRxl"
        //Chill
        if(args[0].toLowerCase().startsWith("chi")) link = "https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6";
        //Jazz
        if (args[0].toLowerCase().startsWith("j")) link = "https://open.spotify.com/playlist/37i9dQZF1DXbITWG1ZJKYt";
        //blues
        if (args[0].toLowerCase().startsWith("b")) link = "https://open.spotify.com/playlist/37i9dQZF1DXd9rSDyQguIk";
        //strange-fruits
        if (args[0].toLowerCase().startsWith("s")) link = "https://open.spotify.com/playlist/6xGLprv9fmlMgeAMpW0x51";
        //magic-release
        if (args[0].toLowerCase().startsWith("ma"))  link = "https://www.youtube.com/watch?v=WvMc5_RbQNc&list=PLYUn4Yaogdagvwe69dczceHTNm0K_ZG3P"
        //metal
        if (args[0].toLowerCase().startsWith("me")) link = "https://open.spotify.com/playlist/37i9dQZF1DX9qNs32fujYe";
        //heavy metal
        if (args[0].toLowerCase().startsWith("h")) link = "https://open.spotify.com/playlist/37i9dQZF1DX9qNs32fujYe";
      }
      interaction?.reply({
        embeds:  [new MessageEmbed()
          .setColor(es.color)
          .setAuthor(`Loading '${args[0] ? args[0] : "Default"}' Music Mix`, "https://imgur.com/xutrSuq.gif", link)
          .setTitle(eval(client.la[ls]["cmds"]["music"]["playmusicmix"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["music"]["playmusicmix"]["variable2"]))
          .addField(eval(client.la[ls]["cmds"]["music"]["playmusicmix"]["variablex_3"]), eval(client.la[ls]["cmds"]["music"]["playmusicmix"]["variable3"]))
          .setFooter(client.getFooter(es))
        ]})
      //play the SONG from YOUTUBE
      playermanager(client, message, Array(link), `song:youtube`, interaction, "songoftheday");
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
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
