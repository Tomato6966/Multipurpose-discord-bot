//Here the command starts
const config = require(`../../botconfig/config.json`)
var ee = require(`../../botconfig/embed.json`)
module.exports = {
	//definition
	name: "voiceleaderboard", //the name of the command 
	category: "📈 Ranking", //the category this will be listed at, for the help cmd
	aliases: ["voicelb", "voicetop"], //every parameter can be an alias
	cooldown: 4, //this will set it to a 4 second cooldown
	usage: "voiceleaderboard", //this is for the help command for EACH cmd
  	description: "Shows the Top 10 Voice-Leaderboard", //the description of the command
	  type: "info",
	//running the command with the parameters: client, message, args, user, text, prefix
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    

	}
}
