const { MessageEmbed } = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
module.exports = {
    name: "tiny",
    aliases: ["tinytext"],
    category: "🎮 MiniGames",
    description: "Would you Rather?",
    usage: "tiny TEXT",
    type: "text",
     run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
        
        if(GuildSettings.FUN === false){
          return message.reply(new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          );
        }
        message.reply(tinyCaptial(args[0] ? args.join(" ") : "No Text Added! Please Retry!"))
    }
  }
  const map = {
    A: '\u1d00',
    B: '\u0299',
    C: '\u1d04',
    D: '\u1d05',
    E: '\u1d07',
    F: '\ua730',
    G: '\u0262',
    H: '\u029c',
    I: '\u026a',
    J: '\u1d0a',
    K: '\u1d0b',
    L: '\u029f',
    M: '\u1d0d',
    N: '\u0274',
    O: '\u1d0f',
    P: '\u1d18',
    Q: 'Q',
    R: '\u0280',
    S: '\ua731',
    T: '\u1d1b',
    U: '\u1d1c',
    V: '\u1d20',
    W: '\u1d21',
    X: 'x',
    Y: '\u028f',
    Z: '\u1d22',
  }
  function tinyCaptial(str) {
		let c = '',
			a;
		str = str.toUpperCase();
		for (let d = 0, e = str.length; d < e; d++) {
			(a = map[str.charAt(d)]),
			typeof a == 'undefined' && (a = str.charAt(d)),
			(c += a);
		}
		return c;
	}