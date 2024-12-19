const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
module.exports = {
    name: "bent",
    aliases: ["benttext", "bendtext"],
    category: "🎮 MiniGames",
    description: "Would you Rather?",
    usage: "bent TEXT",
    type: "text",
    run: async (client, message, args, cmduser, text, prefix) => {
    
        let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        if(!client.settings.get(message.guild.id, "MINIGAMES")){
          return message.reply(new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          );
        }
        message.reply(bent(args[0] ? args.join(" ") : "No Text Added! Please Retry!"))
        
    }
  }
const map = {
  a: '\u0105',
  b: '\u048d',
  c: '\u00e7',
  d: '\u056a',
  e: '\u04bd',
  f: '\u0192',
  g: '\u0581',
  h: '\u0570',
  i: '\u00ec',
  j: '\u029d',
  k: '\u049f',
  l: '\u04c0',
  m: '\u028d',
  n: '\u0572',
  o: '\u0585',
  p: '\u0584',
  q: '\u0566',
  r: '\u027e',
  s: '\u0282',
  t: '\u0567',
  u: '\u0574',
  v: '\u0475',
  w: '\u0561',
  x: '\u00d7',
  y: '\u057e',
  z: '\u0540',
  A: '\u023a',
  B: '\u03b2',
  C: '\u21bb',
  D: '\u13a0',
  E: '\u0190',
  F: '\u0191',
  G: '\u0193',
  H: '\u01f6',
  I: '\u012f',
  J: '\u0644',
  K: '\u04a0',
  L: '\ua748',
  M: '\u2c6e',
  N: '\u17a0',
  O: '\u0da7',
  P: '\u03c6',
  Q: '\u04a8',
  R: '\u0f60',
  S: '\u03da',
  T: '\u0372',
  U: '\u0531',
  V: '\u1efc',
  W: '\u0c1a',
  X: '\u10ef',
  Y: '\u04cb',
  Z: '\u0240',
  0: '\u2298',
  1: '\ud835\udfd9',
  2: '\u03e9',
  3: '\u04e0',
  4: '\u096b',
  5: '\u01bc',
  6: '\u03ec',
  7: '7',
  8: '\ud835\udfe0',
  9: '\u096f',
  '&': '\u214b',
  '(': '{',
  ')': '}',
  '{': '(',
  '}': ')',
}
function bent(str) {
  let c = '';
  for (let a, d = 0, e = str.length; d < e; d++) {
    (a = map[str.charAt(d)]),
    typeof a == 'undefined' && (a = str.charAt(d)),
    (c += a);
  }
  return c;
}