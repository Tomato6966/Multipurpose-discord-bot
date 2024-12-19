
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);

module.exports = {
    name: "flip",
    aliases: ["fliptext"],
    category: "🎮 MiniGames",
    description: "Would you Rather?",
    usage: "flip TEXT",
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
        message.reply(flip(args[0] ? args.join(" ") : "No Text Added! Please Retry!"))
        
    }
  }
const map = {
  a: '\u0250',
  b: 'q',
  c: '\u0254',
  d: 'p',
  e: '\u01dd',
  f: '\u025f',
  g: '\u0253',
  h: '\u0265',
  i: '\u0131',
  j: '\u027e',
  k: '\u029e',
  l: 'l',
  m: '\u026f',
  n: 'u',
  r: '\u0279',
  t: '\u0287',
  v: '\u028c',
  w: '\u028d',
  y: '\u028e',
  A: '\u2200',
  B: '\u1660',
  C: '\u0186',
  D: '\u15e1',
  E: '\u018e',
  F: '\u2132',
  G: '\u2141',
  J: '\u017f',
  K: '\u22ca',
  L: '\u02e5',
  M: 'W',
  P: '\u0500',
  Q: '\u038c',
  R: '\u1d1a',
  T: '\u22a5',
  U: '\u2229',
  V: '\u039b',
  Y: '\u2144',
  1: '\u21c2',
  2: '\u1105',
  3: '\u0190',
  4: '\u3123',
  5: '\u078e',
  6: '9',
  7: '\u3125',
  '&': '\u214b',
  '.': '\u02d9',
  '"': '\u201e',
  ';': '\u061b',
  '[': ']',
  '(': ')',
  '{': '}',
  '?': '\u00bf',
  '!': '\u00a1',
  '\'': ',',
  '<': '>',
  '\u203e': '_',
  '\u00af': '_',
  '\u203f': '\u2040',
  '\u2045': '\u2046',
  '\u2234': '\u2235',
  '\r': '\n',
  ß: '\u1660',
  '\u0308': '\u0324',
  ä: '\u0250\u0324',
  ö: 'o\u0324',
  ü: 'n\u0324',
  Ä: '\u2200\u0324',
  Ö: 'O\u0324',
  Ü: '\u2229\u0324',
  '\u00b4': ' \u0317',
  é: '\u01dd\u0317',
  á: '\u0250\u0317',
  ó: 'o\u0317',
  ú: 'n\u0317',
  É: '\u018e\u0317',
  Á: '\u2200\u0317',
  Ó: 'O\u0317',
  Ú: '\u2229\u0317',
  '`': ' \u0316',
  è: '\u01dd\u0316',
  à: '\u0250\u0316',
  ò: 'o\u0316',
  ù: 'n\u0316',
  È: '\u018e\u0316',
  À: '\u2200\u0316',
  Ò: 'O\u0316',
  Ù: '\u2229\u0316',
  '^': ' \u032e',
  ê: '\u01dd\u032e',
  â: '\u0250\u032e',
  ô: 'o\u032e',
  û: 'n\u032e',
  Ê: '\u018e\u032e',
  Â: '\u2200\u032e',
  Ô: 'O\u032e',
  Û: '\u2229\u032e',
};
function flip(str) {
  const c = [];
  for (let a, d = 0, e = str.length; d < e; d++) {
    (a = str.charAt(d)),
    d > 0 &&
      (a == '\u0324' || a == '\u0317' || a == '\u0316' || a == '\u032e')
      ? ((a = map[str.charAt(d - 1) + a]), c.pop())
      : ((a = map[a]), typeof a == 'undefined' && (a = str.charAt(d))),
    c.push(a);
  }
  return c.reverse().join('');
}