var {
  MessageEmbed
} = require("discord.js")
var ee = require(`${process.cwd()}/botconfig/embed.json`)
var config = require(`${process.cwd()}/botconfig/config.json`)
var {
  format,
  delay,
  arrayMove,isValidURL
} = require("../functions")

//function for playling song + skipping
async function skiptrack(client, message, args, type, slashCommand) {
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
    }
    let state = player.state;
    if (state !== "CONNECTED") {
      //set the variables
      player.set("message", message);
      player.set("messageid", message.id);
      player.set("playerauthor", message.author?.id);
      player.connect();
      try{message.react("863876115584385074").catch(() => null);}catch(e){console.log(String(e).grey)}
      player.stop();
    }
    try {
      // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
      if (type.split(":")[1] === "youtube" || type.split(":")[1] === "soundcloud"){
        if(isValidURL(search)){
          res = await client.manager.search(search, message.author);
        } else {
          res = await client.manager.search({
            query: search,
            source: type.split(":")[1]
          }, message.author);
        }
      }
      else {
        res = await client.manager.search(search, message.author);
      }
      // Check the load type as this command is not that advanced for basics
      if (res.loadType === "LOAD_FAILED") throw res.exception;
      else if (res.loadType === "PLAYLIST_LOADED") throw {
        message: "Playlists are not supported with this command. Use   ?playlist  "
      };
    } catch (e) {
      console.error(e)
      
      if(slashCommand)
        return slashCommand.reply({ephemeral: true, embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(eval(client.la[ls]["handlers"]["playermanagers"]["skiptrack"]["variable1"]))
          .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["skiptrack"]["variable2"]))
        ]});
      return message.reply({embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(eval(client.la[ls]["handlers"]["playermanagers"]["skiptrack"]["variable1"]))
        .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["skiptrack"]["variable2"]))
      ]});
    }
    if (!res.tracks[0]){
      if(slashCommand)
        return slashCommand.reply({ephemeral: true, embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setTitle(String("❌ Error | Found nothing for: **`" + search).substring(0, 256 - 3) + "`**")
          .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["skiptrack"]["variable3"]))
        ]})
      return message.reply({embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setTitle(String("❌ Error | Found nothing for: **`" + search).substring(0, 256 - 3) + "`**")
        .setDescription(eval(client.la[ls]["handlers"]["playermanagers"]["skiptrack"]["variable3"]))
      ]}).then(msg => {
        setTimeout(()=>{
          msg.delete().catch(() => null)
        }, 3000)
      })
    }
    //if the player is not connected, then connect and create things
    if (state !== "CONNECTED") {
      //set the variables
      player.set("message", message);
      player.set("playerauthor", message.author?.id);
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
    } else {
      player.queue.add(res.tracks[0]);
      player.queue[player.queue.length - 1];
      //move the Song to the first position using my selfmade Function and save it on an array
      var QueueArray = arrayMove(player.queue, player.queue.length - 1, 0);
      //clear teh Queue
      player.queue.clear();
      //now add every old song again
      for (var track of QueueArray)
        player.queue.add(track);
      //skip the track
      player.stop();
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
      ]})
    return message.reply({embeds: [new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setTitle(String("❌ Error | Found nothing for: **`" + search).substring(0, 256 - 3) + "`**")
    ]}).then(msg => {
      setTimeout(()=>{
        msg.delete().catch(() => null)
      }, 3000)
    })
  }
}

module.exports = skiptrack;


