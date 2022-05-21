var {
  MessageEmbed
} = require("discord.js")
var ee = require(`${process.cwd()}/botconfig/embed.json`)
var config = require(`${process.cwd()}/botconfig/config.json`)
var {
  format,
  delay,
  arrayMove
} = require("../functions")

//function for playing playlists
async function playlist(client, message, args, type, slashCommand = false) {
  let ls = await client.settings.get(message.guild.id+".language")
  var search = args.join(" ");
  try {
    var res;
    var player = client.manager.players.get(message.guild.id);
    //if no node, connect it 
    if (player && player.node && !player.node.connected) await player.node.connect()
    //if no player create it
    if (!player) {
      player = await client.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
        selfDeafen: true,
      });
      if (player && player.node && !player.node.connected) await player.node.connect()
      player.set("messageid", message.id);
    }
    let state = player.state;
    if (state !== "CONNECTED") {
      //set the variables
      player.set("message", message);
      player.set("playerauthor", message.author?.id);
      player.connect();
      try{message.react("863876115584385074").catch(() => null);}catch(e){console.log(String(e).grey)}
      player.stop();
    }
    try {
      // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
      res = await client.manager.search(search, message.author);
      // Check the load type as this command is not that advanced for basics
      if (res.loadType === "LOAD_FAILED") throw res.exception;
      else if (res.loadType === "SEARCH_RESULT") throw {
        message: "Searches are not supported with this command. Use   ?play   or   ?search"
      };
    } catch (e) {
      console.error(e)
      if(slashCommand)
        return slashCommand.reply({ephemeral: true, embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(eval(client.la[ls]["handlers"]["playermanagers"]["playlist"]["variable1"]))
          .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["playlist"]["variable2"]))
        ]}).catch(() => null);
      return message.reply({embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(eval(client.la[ls]["handlers"]["playermanagers"]["playlist"]["variable1"]))
        .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["playlist"]["variable2"]))
      ]}).catch(() => null).then(msg => {
        setTimeout(()=>{
          msg.delete().catch(() => null)
        }, 3000)
      })
    }

    if (!res.tracks[0]){
      if(slashCommand)
        return slashCommand.reply({ephemeral: true, embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(String("❌ Error | Found nothing for: **`" + search).substring(0, 256 - 3) + "`**")
          .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["playlist"]["variable3"]))
        ]}).catch(() => null)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(String("❌ Error | Found nothing for: **`" + search).substring(0, 256 - 3) + "`**")
        .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["playlist"]["variable3"]))
      ]}).catch(() => null).then(msg => {
        setTimeout(()=>{
          msg.delete().catch(() => null)
        }, 3000)
      })
    }
    //if the player is not connected, then connect and create things
    if (player.state !== "CONNECTED") {
      //set the variables
      player.set("message", message);
      player.set("playerauthor", message.author?.id);
      player.connect();
      try{message.react("863876115584385074").catch(() => null);}catch(e){console.log(String(e).grey)}
      //add track
      player.queue.add(res.tracks);
      //play track
      player.play();
      player.pause(false);
    } else if (!player.queue || !player.queue.current) {
      //add track
      player.queue.add(res.tracks);
      //play track
      player.play();
      player.pause(false);
    } else {
      //add the tracks
      player.queue.add(res.tracks);
    }
    //send information
    var playlistembed = new MessageEmbed()
      .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["playlist"]["variable4"]))
      .setColor(ee.color)
      .setThumbnail(`https://img.youtube.com/vi/${res.tracks[0].identifier}/mqdefault.jpg`)
      .addField("⌛ Duration: ", `\`${format(res.playlist.duration)}\``, true)
      .addField("🔂 Queue length: ", `\`${player.queue.length} Songs\``, true) 
      
    if(slashCommand) slashCommand.reply({ephemeral: true, embeds: [playlistembed]}).catch(() => null);
    else message.reply({embeds: [playlistembed]}).catch(() => null)
    
    const musicsettings = await client.musicsettings.get(player.guild)
    if(musicsettings.channel && musicsettings.channel.length > 5){
      let messageId = musicsettings.message;
      let guild = await client.guilds.cache.get(player.guild)
      if(guild && messageId) {
        let channel = guild.channels.cache.get(musicsettings.channel);
        let message = await channel.messages.fetch(messageId).catch(() => null);
        if(message) {
          //edit the message so that it's right!
          var data = await require("../erela_events/musicsystem").generateQueueEmbed(client, player.guild)
          message.edit(data).catch(() => null)
          if(musicsettings.channel == player.textChannel){
            return;
          }
        }
      }
    }
  } catch (e) {
    console.error(e)
    
    if(slashCommand)
    return slashCommand.reply({ephemeral: true, embeds: [new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setTitle(String("❌ Error | Found nothing for: **`" + search).substring(0, 256 - 3) + "`**")
    ]}).catch(() => null)
    message.reply({embeds: [new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setTitle(String("❌ Error | Found nothing for: **`" + search).substring(0, 256 - 3) + "`**")
    ]}).catch(() => null).then(msg => {
      setTimeout(()=>{
        msg.delete().catch(() => null)
      }, 3000)
    })
  }
}

module.exports = playlist;

