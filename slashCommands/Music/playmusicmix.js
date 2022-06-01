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
      ["Bandit Camp music storage", "bandit-camp"], 
      ["Miyagi playlist", "miyagi"], 
      ["Chill Mix", "chill"], 
      ["Default Mix", "default"], 
      ["Cepheid `s Spotify Playlist", "cepheid's-playlist"], 
      ["Gaming Mix", "gaming"], 
      ["Magic-Release Mix", "magic-release"], 
      ["Strange-Fruits Mix", "strange-fruits-gaming"], 
    ] }},
  ],

  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    let GuildSettings = client.settings.get(`${interaction.guild.id}`)
    //
    if(GuildSettings.MUSIC === false) {
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
        if (args[0].toLowerCase().startsWith("miyagi")) link = "https://open.spotify.com/playlist/4XprsFTl5HyeZ0vwgd98Nq?si=d0a913330590448d";
        //default
       if (args[0].toLowerCase().startsWith("d")) link = "https://www.youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj";
       //remixes from Magic Release
       if (args[0].toLowerCase().startsWith("re")) link = "https://www.youtube.com/watch?v=NX7BqdQ1KeU&list=PLYUn4YaogdahwfEkuu5V14gYtTqODx7R2"
       //gaming
       if (args[0].toLowerCase().startsWith("g")) link = "https://open.spotify.com/playlist/4a54P2VHy30WTi7gix0KW6";
       //Charts
  //Chill
       if (args[0].toLowerCase().startsWith("chi")) link = "https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6";
       //Jazz
    //strange-fruits
       if (args[0].toLowerCase().startsWith("s")) link = "https://open.spotify.com/playlist/6xGLprv9fmlMgeAMpW0x51";
       //magic-release
       if (args[0].toLowerCase().startsWith("magic")) link = "https://www.youtube.com/watch?v=WvMc5_RbQNc&list=PLYUn4Yaogdagvwe69dczceHTNm0K_ZG3P"
       //metal
     //my
       if (args[0].toLowerCase().startsWith("cepheid")) link = "https://open.spotify.com/playlist/70Z2lb2F2g2LXaBkcpxABM?si=16e58d38908749cb";
       //music storage
       if (args[0].toLowerCase().startsWith("bandit")) link = "https://open.spotify.com/playlist/6gCc1MHzFZhjYhwRipKtFw?si=66797fa029ce4c24";

      }
      interaction?.reply({ephemeral: true, 
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

