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

module.exports = playtop;
async function playtop(client, message, args, type, slashCommand) {
  let ls = await client.settings.get(message.guild.id+".language")
  const search = args.join(" ");
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
  let res;
  res = await client.manager.search({
    query: search,
    source: type.split(":")[1]
  }, message.author);
  // Check the load type as this command is not that advanced for basics
  if (res.loadType === "LOAD_FAILED") throw res.exception;
  else if (res.loadType === "PLAYLIST_LOADED") {
    playlist_()
  } else {
    song_()
  }
  async function song_() {
    //if no tracks found return info msg

    if (!res.tracks[0]){
      if(slashCommand)
      return slashCommand.reply({ephemeral: true, embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(String("❌ Error | Found nothing for: **`" + search).substring(0, 256 - 3) + "`**")
        .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["playtop"]["variable1"]))
      ]}).catch(() => null)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(String("❌ Error | Found nothing for: **`" + search).substring(0, 256 - 3) + "`**")
        .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["playtop"]["variable1"]))
      ]}).catch(() => null).then(msg => {
        setTimeout(()=>{
          msg.delete().catch(() => null)
        }, 3000)
      })
    }
    //if the player is not connected, then connect and create things
    if (state !== "CONNECTED") {
      //set the variables
      player.set("message", message);
      player.set("messageid", message.id);
      player.set("playerauthor", message.author?.id);
      //connect
      player.connect();
      try{message.react("863876115584385074").catch(() => null);}catch(e){console.log(String(e).grey)}
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
      //save old tracks on an var
      let oldQueue = []
      for (const track of player.queue)
        oldQueue.push(track);
      //clear queue
      player.queue.clear();
      //add new tracks
      player.queue.add(res.tracks[0]);
      //now add every old song again
      for (const track of oldQueue)
        player.queue.add(track);
    }
    //send track information
    var playembed = new MessageEmbed()
      .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["playtop"]["variable2"]))
      .setColor(ee.color)
      .setThumbnail(`https://img.youtube.com/vi/${res.tracks[0].identifier}/mqdefault.jpg`)
      .addField("⌛ Duration: ", `\`${res.tracks[0].isStream ? "LIVE STREAM" : format(res.tracks[0].duration)}\``, true)
      .addField("💯 Song By: ", `\`${res.tracks[0].author}\``, true)
      .addField("🔂 Queue length: ", `\`${player.queue.length} Songs\``, true)
      .addField(":notes: Music Dashboard :new: ", `[**Check out the :new: Music Dashboard!**](https://milrato.com/dashboard/queue/${player.guild})\n> Live Music View, Live Music Requests, Live Music Control and more!`) 
    if(slashCommand) slashCommand.reply({ephemeral: true, embeds: [playembed]}).catch(() => null);
    else message.reply({embeds: [playembed]}).catch(() => null);
    
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
  }
  //function ffor playist
  async function playlist_() {

    if (!res.tracks[0]){
      if(slashCommand)
        return slashCommand.reply({ephemeral: true, embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(String("❌ Error | Found nothing for: **`" + search).substring(0, 256 - 3) + "`**")
          .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["playtop"]["variable3"]))
        ]}).catch(() => null)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(String("❌ Error | Found nothing for: **`" + search).substring(0, 256 - 3) + "`**")
        .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["playtop"]["variable3"]))
      ]}).catch(() => null).then(msg => {
        setTimeout(()=>{
          msg.delete().catch(() => null)
        }, 3000)
      })
    }
    //if the player is not connected, then connect and create things
    if (state !== "CONNECTED") {

      player.set("message", message);
      player.set("playerauthor", message.author?.id);
      //add track
      player.queue.add(res.tracks);
      //play track
      player.play();
    } else if (!player.queue || !player.queue.current) {
      //add track
      player.queue.add(res.tracks);
      //play track
      player.play();
    } else {
      //save old tracks on an var
      let oldQueue = []
      for (const track of player.queue)
        oldQueue.push(track);
      //clear queue
      player.queue.clear();
      //add new tracks
      player.queue.add(res.tracks);
      //now add every old song again
      for (const track of oldQueue)
        player.queue.add(track);
    }
    var time = 0;
    let playlistembed = new Discord.MessageEmbed()
      .setAuthor(`Playlist added to Queue`, message.author.displayAvatarURL({
        dynamic: true
      }), "https://milrato.eu")
      .setColor(ee.color)
      .setTitle(eval(client.la[ls]["handlers"]["playermanagers"]["playtop"]["variable4"]))
      .setThumbnail(`https://img.youtube.com/vi/${res.tracks[0].identifier}/mqdefault.jpg`)
    //timing for estimated time creation
    if (player.queue.size > 0) player.queue.map((track) => time += track.duration)
    time += player.queue.current.duration - player.position;
    for (const track of res.tracks)
      time -= track.duration;

    playlistembed.addField(eval(client.la[ls]["handlers"]["playermanagers"]["playtop"]["variablex_5"]), eval(client.la[ls]["handlers"]["playermanagers"]["playtop"]["variable5"]))
      .addField("Position in queue", `${player.queue.length - res.tracks.length + 1 === 0 ? "NOW" : player.queue.length - res.tracks.length + 1}`, true)
      .addField("Enqueued", `\`${res.tracks.length}\``, true)
    //if bot allowed to send embed, do it otherwise pure txt msg
    if (message.guild.me.permissionsIn(message.channel).has("EMBED_LINKS")){
      if(slashCommand)
        return slashCommand.reply({ephemeral: true, embeds: [playlistembed]}).catch(() => null);
      message.reply({embeds: [playlistembed]}).catch(() => null);
    } else{
      if(slashCommand)
        return slashCommand.reply({ephemeral: true, content: [eval(client.la[ls]["handlers"]["playermanagers"]["playtop"]["variable6"])]}).catch(() => null);
      message.reply({content: [eval(client.la[ls]["handlers"]["playermanagers"]["playtop"]["variable6"])]}).catch(() => null);
    }
      
  }
}