var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing, isValidURL
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: "stopbot",
  category: "👑 Owner",
  aliases: ["botstop"],
  cooldown: 5,
  usage: "stopbot",
  type: "bot",
  description: "Stops the Bot, to set it OFFLINE",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if (!config.ownerIDS.some(r => r.includes(message.author.id)))
      return message.channel.send({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["stopbot"]["variable1"]))
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["stopbot"]["variable2"]))
      ]});
    try {
      let clientapp = client.application ? await client.application.fetch().catch(e=>false) : false;
      let guild = client.guilds.cache.get("773668217163218944")
      return message.reply({content : `**<:no:833101993668771842> THIS COMMAND IS DISABLED, go to discord.gg/milrato and <#840332764603351101> to get it restarted!**\n\n\n> **Path:**
\`\`\`yml
${process.cwd()}
\`\`\`
> **Server:**
\`\`\`yml
${String(Object.values(require(`os`).networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i?.family===`IPv4` && !i?.internal && i?.address || []), [])), [])).split(".")[3]}
\`\`\`
> **Command:**
\`\`\`yml
pm2 list | grep "${String(String(process.cwd()).split("/")[String(process.cwd()).split("/").length - 1]).toLowerCase()}" --ignore-case
\`\`\`
${clientapp ? `
> **Application Information:**
\`\`\`yml
Link: https://discord.com/developers/applications/${client.user.id}
Name: ${clientapp.name} 
${clientapp.owner.discriminator ? "Owner: " + clientapp.owner.tag : "Team: " + clientapp.owner.name + "\n |-> Members: " + clientapp.owner.members.map(uid=>`${uid.user.tag}`).join(", ")  + "\n |-> Team-Owner: " + `${guild.members.cache.get(clientapp.owner.ownerId) && guild.members.cache.get(clientapp.owner.ownerId).user ? guild.members.cache.get(clientapp.owner.ownerId).user.tag : clientapp.owner.ownerId }`} 
Icon: ${clientapp.iconURL()}
Bot-Public: ${clientapp.botPublic ? "✅": "❌"} (Invite able)
\`\`\`
> **About me:**
\`\`\`yml
${clientapp.description ? clientapp.description : "❌ NO DESCRIPTION YET!"}
\`\`\``
      : ""}
      `});

      require("child_process").exec(`pm2 stop index.js CLANBOT_${process.cwd().split(require("path").sep).pop()}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          message.reply({content : eval(client.la[ls]["cmds"]["owner"]["stopbot"]["variable4"])})
          return;
        }
      });
    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["stopbot"]["variable5"]))
      ]});
    }
  },
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