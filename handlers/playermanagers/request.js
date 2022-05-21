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

//function for playling song
async function request(client, message, args, type, slashCommand) {
  let ls = await client.settings.get(message.guild.id+".language")
  var search = args.join(" ");
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
  }
  let state = player.state;
  if (state !== "CONNECTED") {
    //set the variables
    player.set("message", message);
    player.set("playerauthor", message.author?.id);
    player.connect();
    player.stop();
  }
  res = await client.manager.search(search, message.author);
  // Check the load type as this command is not that advanced for basics
  if (res.loadType === "LOAD_FAILED") {
    throw res.exception;
  } else if (res.loadType === "PLAYLIST_LOADED") {
    playlist_()
  } else {
    song_()
  }
  //function for calling the song
  async function song_() {
    //if no tracks found return info msg
    if (!res.tracks[0]){
      if(slashCommand)
      return slashCommand.reply({ephemeral: true, embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(String("❌ Error | Found nothing for: **`" + search).substring(0, 256 - 3) + "`**")
        .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["request"]["variable1"]))
      ]}).catch(() => null)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(String("❌ Error | Found nothing for: **`" + search).substring(0, 256 - 3) + "`**")
        .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["request"]["variable1"]))
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
      //add track
      player.queue.add(res.tracks[0]);
      //play track
      player.play();
      player.pause(false);
    } else if (!player.queue || !player.queue.current) {
      //add track
      player.queue.add(res.tracks[0]);
      //play track
      player.play();
      player.pause(false);
    }
    //otherwise
    else {
      //add track
      player.queue.add(res.tracks[0]);
    }
    
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
          message.edit(data).catch(console.error)
          if(musicsettings.channel == player.textChannel){
            return;
          }
        }
      } 
    }
  }
  //function for playist
  async function playlist_() {
    if (!res.tracks[0]){
      if(slashCommand)
        return slashCommand.reply({ephemeral: true, embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(String("❌ Error | Found nothing for: **`" + search).substring(0, 256 - 3) + "`**")
          .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["request"]["variable2"]))
        ]}).catch(() => null)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(String("❌ Error | Found nothing for: **`" + search).substring(0, 256 - 3) + "`**")
        .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["request"]["variable2"]))
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
      player.queue.add(res.tracks);
    }
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
          message.edit(data).catch(console.error)
          if(musicsettings.channel == player.textChannel){
            return;
          }
        }
      } 
    }
  }
}

module.exports = request;

