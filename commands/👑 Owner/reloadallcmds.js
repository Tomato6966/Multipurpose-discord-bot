var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var emoji = require(`../../botconfig/emojis.json`);
const fs = require('fs');
var {
  dbEnsure,
  isValidURL
} = require(`../../handlers/functions`);
module.exports = {
  name: `reloadallcmds`,
  category: `👑 Owner`,
  type: "info",
  aliases: [`reloadallcommands`],
  description: `Reloads all commands`,
  usage: `reloadallcmds`,
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    if (!config.ownerIDS.includes(message.author?.id))
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["cmdreload"]["variable1"]))
      ]});
    try {
      let t = await message.reply("Now reloading all Commands, can take up to 10 Seconds!");
      const {
        readdirSync
      } = require("fs");
      readdirSync("./commands/").forEach(async (dir) => {
        const commands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));
        for (let file of commands) {
          try{
            await client.cluster.broadcastEval(async (c, ctx) => {
              try{
                c.commands.clear();
                c.aliases.clear()
              }catch{}
              let thecmd = ctx;
              if(thecmd){
                try {
                  delete require.cache[require.resolve(`${process.cwd()}/commands/${thecmd.category}/${thecmd.name}`)] // usage !reload <name>
                  const pull = require(`${process.cwd()}/commands/${thecmd.category}/${thecmd.name}`)
                  c.commands.set(thecmd.name, pull)
                  if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
                  return { success: true, error: false };
                } catch (e) {
                  console.error(e)
                  return { success: false, error: e };
                }
              }
              return true;
            }, { context: { name: file.name, category: file.category } })
            
          }catch(e){
            console.log(String(e.stack).grey.bgRed)
          }
        }
      });
      if(d.some(x => x.error)) {
        message.reply(`Failed to reload on some shards...\n\`\`\`\n${String(d.find(x => x.error)?.[0]).substring(0, 250)}\n\`\`\``);
      }
      await t.edit(`Loaded ${client.commands.size} Commands!`)
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["cmdreload"]["variable6"]))
      ]});
    }
  },
};

