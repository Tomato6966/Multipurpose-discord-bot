const { MessageEmbed } = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);


module.exports = {
    name: "mirror",
    aliases: ["mirrortext"],
    category: "🎮 MiniGames",
    description: "Would you Rather?",
    usage: "mirror TEXT",
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
        message.reply(mirror(args[0] ? args.join(" ") : "No Text Added! Please Retry!"))
        
    }
  }
  const map = {
    a: '\u0252',
    b: 'd',
    c: '\u0254',
    e: '\u0258',
    f: '\u13b8',
    g: '\u01eb',
    h: '\u029c',
    j: '\ua781',
    k: '\u029e',
    l: '|',
    n: '\u1d0e',
    p: 'q',
    r: '\u027f',
    s: '\ua645',
    t: '\u019a',
    y: '\u028f',
    z: '\u01b9',
    B: '\u1660',
    C: '\u0186',
    D: '\u15e1',
    E: '\u018e',
    F: '\ua7fb',
    G: '\u13ae',
    J: '\u10b1',
    K: '\u22ca',
    L: '\u2143',
    N: '\u0376',
    P: '\ua7fc',
    Q: '\u1ecc',
    R: '\u042f',
    S: '\ua644',
    Z: '\u01b8',
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
    7: '',
    '&': '',
    ';': '',
    '[': ']',
    '(': ')',
    '{': '}',
    '?': '\u2e2e',
    '<': '>',
  }
  function mirror(str) {
		let c = [];
		const d = [];
		for (let a, e = 0, f = str.length; e < f; e++) {
			(a = str.charAt(e)),
			e > 0 &&
				(a == '\u0308' || a == '\u0300' || a == '\u0301' || a == '\u0302')
				? ((a = map[str.charAt(e - 1) + a]), c.pop())
				: ((a = map[a]), typeof a == 'undefined' && (a = str.charAt(e))),
			a == '\n' ? (d.push(c.reverse().join('')), (c = [])) : c.push(a);
		}
		d.push(c.reverse().join(''));
		return d.join('\n');
	}