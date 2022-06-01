const { MessageEmbed } = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require("../../botconfig/emojis.json");
module.exports = {
    name: "toggleplaymessage",
    aliases: ["toggleplaymsg", "playmessage", "playmsg"],
    category: "⚙️ Settings",
    description: "Toggles playmessage (same as pruning...). If its true a message of playing a new track will be sent, even if your afk. If false it wont send any message if a new Track plays! | Default: true aka send new Track information",
    usage: "toggleplaymessage",
    memberpermissions: ["ADMINISTRATOR"],
    type: "music",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
      var guildpremData = await client.premium.get(`${message.guild.id}.enabled`)
      if(guildpremData === false){
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.premium.title)
          .setDescription(handlemsg(client.la[ls].common.premium.description))
        ]});
      }
      
      
      //run the code of togglepruning
      let { run } = require("./playmsg");
      run(client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings);
  }
};


