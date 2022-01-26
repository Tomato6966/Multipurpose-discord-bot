const Discord = require("discord.js")
const {
  MessageEmbed
} = require("discord.js")
const config = require(`${process.cwd()}/botconfig/config.json`)
ee = require(`${process.cwd()}/botconfig/embed.json`)
const {
  format,
  delay,
  arrayMove
} = require(`./functions`)
module.exports = async (client, message, args, type, slashCommand = false, extras = false) => {
  let method = type.includes(":") ? type.split(":") : Array(type)
  if (!message.guild) return;
  
  //just visual for the console
  
  ee = client.settings.get(message.guild.id, "embed")
  var es = client.settings.get(message.guild.id, "embed")
  if(!client.settings.has(message.guild.id, "language")) client.settings.ensure(message.guild.id, { language: "en" });
  let ls = client.settings.get(message.guild.id, "language");

  let {
    channel
  } = message.member.voice;
  let botchannel = message.guild.me.voice.channel;
  const permissions = channel.permissionsFor(client.user);

  if (!permissions.has("CONNECT")){
    if(slashCommand) 
      return slashCommand.reply({ephemeral: true, embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(client.getFooter(ee))
        .setTitle(eval(client.la[ls]["handlers"]["playermanagerjs"]["playermanager"]["variable1"]))
      ]}).catch((e)=>console.log(String(e).grey));
    return message.reply({embeds: [new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setFooter(client.getFooter(ee))
      .setTitle(eval(client.la[ls]["handlers"]["playermanagerjs"]["playermanager"]["variable1"]))
    ]}).catch((e)=>console.log(String(e).grey));
  }
  if (!permissions.has("SPEAK")){
    if(slashCommand) 
      return slashCommand.reply({ephemeral: true, embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(client.getFooter(ee))
        .setTitle(eval(client.la[ls]["handlers"]["playermanagerjs"]["playermanager"]["variable2"]))
      ]}).catch((e)=>console.log(String(e).grey));
    return message.reply({embeds: [new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setFooter(client.getFooter(ee))
      .setTitle(eval(client.la[ls]["handlers"]["playermanagerjs"]["playermanager"]["variable2"]))
    ]}).catch((e)=>console.log(String(e).grey));
  }
  if(botchannel && channel.userLimit != 0 && channel.full){
    if(slashCommand)  return slashCommand.reply({embeds: [new MessageEmbed().setTitle(":x: Your Voice Channel is full!").setColor(es.wrongcolor).setFooter(client.getFooter(es))]}).catch(()=>{});
    return message.reply({embeds: [new MessageEmbed().setTitle(":x: Your Voice Channel is full!").setColor(es.wrongcolor).setFooter(client.getFooter(es))]}).catch(()=>{});
  }
  if (method[0] === "song")
    require("./playermanagers/song")(client, message, args, type, slashCommand, extras); 
  else if (method[0] === "request")
    require("./playermanagers/request")(client, message, args, type, slashCommand);  
  else if (method[0] === "playlist")
    require("./playermanagers/playlist")(client, message, args, type, slashCommand);
  else if (method[0] === "similar")
    require("./playermanagers/similar")(client, message, args, type, slashCommand);
  else if (method[0] === "search")
    require("./playermanagers/search")(client, message, args, type, slashCommand);
  else if (method[0] === "skiptrack")
    require("./playermanagers/skiptrack")(client, message, args, type, slashCommand); 
  else if (method[0] === "playtop")
    require("./playermanagers/playtop")(client, message, args, type, slashCommand)
  else {
    if(slashCommand) 
      return slashCommand.reply({ephemeral: true, embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(client.getFooter(ee))
        .setTitle(eval(client.la[ls]["handlers"]["playermanagerjs"]["playermanager"]["variable3"]))
      ]}).catch((e)=>console.log(String(e).grey));
    return message.reply({embeds: [new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setFooter(client.getFooter(ee))
      .setTitle(eval(client.la[ls]["handlers"]["playermanagerjs"]["playermanager"]["variable3"]))
    ]}).catch((e)=>console.log(String(e).grey));
  }
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
