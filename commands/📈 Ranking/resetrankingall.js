//Here the command starts
const config = require(`../../botconfig/config.json`)
var ee = require(`../../botconfig/embed.json`)
module.exports = {
	//definition
	name: "resetrankingall", //the name of the command 
	category: "📈 Ranking", //the category this will be listed at, for the help cmd
	aliases: [""], //every parameter can be an alias
	cooldown: 4, //this will set it to a 4 second cooldown
	usage: "resetrankingall", //this is for the help command for EACH cmd
  	description: "Reset ranking of everyone in this Server", //the description of the command
	  type: "manage",
	//running the command with the parameters: client, message, args, user, text, prefix
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    

	}
}
