const { MessageEmbed } = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require("../../botconfig/emojis.json");
module.exports = {
    name: "togglepruning",
    aliases: ["toggleprunning", "pruning", "prunning", "toggeldebug", "debug"],
    category: "⚙️ Settings",
    description: "Toggles pruning. If its true a message of playing a new track will be sent, even if your afk. If false it wont send any message if a new Track plays! | Default: true aka send new Track information",
    usage: "togglepruning",
    memberpermissions: ["ADMINISTRATOR"],
    type: "music",
    run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
      //run the code of togglepruning
      let { run } = require("./playmsg");
      run(client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings);
  }
};

