const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  format,
  delay,
  swap_pages,
  swap_pages2_interaction
} = require(`${process.cwd()}/handlers/functions`);
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: `queue`,
  description: `Shows the Queue`,
  parameters: {
    "type": "music",
    "activeplayer": true,
    "previoussong": false
  },
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    		//things u can directly access in an interaction!
        let GuildSettings = client.settings.get(`${interaction.guild.id}`)
		const { member } = interaction;
    const { guild } = member;
    //
    if(GuildSettings.MUSIC === false) {
      return interaction?.reply({ephemeral: true, embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
      //get the right tracks of the current tracks
      const tracks = player.queue;
      //if there are no other tracks, information
      if (!tracks.length)
        return interaction?.reply({ephemeral: true, embeds : [new MessageEmbed()
          .setAuthor(`Queue for ${message.guild.name}  -  [ ${tracks.length} Tracks ]`, message.guild.iconURL({
            dynamic: true
          }))
          .setColor(es.color)
          .addField(eval(client.la[ls]["cmds"]["music"]["queue"]["variablex_1"]), eval(client.la[ls]["cmds"]["music"]["queue"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["music"]["queue"]["variable2"]))
        ]}).then(msg => {
          setTimeout(()=>{
            try { 
              msg.delete().catch(() => null);
            } catch {} 
          }, 5000)
        })
      //if not too big send queue in channel
      if (tracks.length < 15)
        return interaction?.reply({ephemeral: true, embeds :[new MessageEmbed()
          .setAuthor(`Queue for ${message.guild.name}  -  [ ${player.queue.length} Tracks ]`, message.guild.iconURL({
            dynamic: true
          }))
          .addField(eval(client.la[ls]["cmds"]["music"]["queue"]["variablex_3"]), eval(client.la[ls]["cmds"]["music"]["queue"]["variable3"]))
          .setColor(es.color).setDescription(tracks.map((track, i) => `**${++i})** **${track.title.substring(0, 60)}** - \`${track.isStream ? `LIVE STREAM` : format(track.duration).split(` | `)[0]}\`\n*requested by: ${track.requester.tag}*`).join(`\n`))
        ]}).then(msg => {
          setTimeout(()=>{
            try { 
              msg.delete().catch(() => null);
            } catch {} 
          }, 5000)
        })
      //get an array of quelist where 15 tracks is one index in the array
      let quelist = [];
      for (let i = 0; i < tracks.length; i += 15) {
        let songs = tracks.slice(i, i + 15);
        quelist.push(songs.map((track, index) => `**${i + ++index})** **${track.title.substring(0, 60)}** - \`${track.isStream ? `LIVE STREAM` : format(track.duration).split(` | `)[0]}\`\n*requested by: ${track.requester.tag}*`).join(`\n`))
      }
      let limit = quelist.length <= 5 ? quelist.length : 5
      let embeds = []
      for (let i = 0; i < limit; i++) {
        let desc = String(quelist[i]).substring(0, 2048)
        await embeds.push(new MessageEmbed()
          .setAuthor(`Queue for ${guild.name}  -  [ ${player.queue.length} Tracks ]`, guild.iconURL({
            dynamic: true
          }))
          .setColor(es.color)
          .addField(eval(client.la[ls]["cmds"]["music"]["queue"]["variablex_4"]), eval(client.la[ls]["cmds"]["music"]["queue"]["variable4"]))
          .setDescription(desc));
      }
      //return susccess messagec
      interaction?.reply({embeds: embeds.slice(0, 10), ephemeral: true});
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
    }
  }
};

