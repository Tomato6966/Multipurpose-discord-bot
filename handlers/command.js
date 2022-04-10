const {
  readdirSync
} = require("fs");
const { MessageEmbed } = require("discord.js")
const serialize = require('serialize-javascript');
const ee = require(`${process.cwd()}/botconfig/embed.json`);
console.log("Welcome to SERVICE HANDLER /--/ By https://milrato.eu /--/ Discord: Tomato#6966".yellow);
module.exports = (client) => {
  let dateNow = Date.now();
  console.log(`${String("[x] :: ".magenta)}Now loading the Commands ...`.brightGreen)
  try {
    readdirSync("./commands/").forEach((dir) => {
      const commands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));
      for (let file of commands) {
        try{
          let pull = require(`../commands/${dir}/${file}`);
          if (pull.name) {
            client.commands.set(pull.name, pull);
            //console.log(`    | ${file} :: Ready`.brightGreen)
          } else {
            //console.log(`    | ${file} :: error -> missing a help.name,or help.name is not a string.`.brightRed)
            continue;
          }
          if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
        }catch(e){
          console.log(String(e.stack).grey.bgRed)
        }
      }
    });
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }

  console.log(`[x] :: `.magenta + `LOADED THE ${client.commands.size} COMMANDS after: `.brightGreen + `${Date.now() - dateNow}ms`.green)
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */


