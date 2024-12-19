const Discord = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { duration, handlemsg } = require(`${process.cwd()}/handlers/functions`)
const { MessageActionRow, MessageSelectMenu } = require("discord.js")
module.exports = {
    name: "botfaq",
    aliases: ["faq"],
    category: "🔰 Info",
    description: "Sends the FAQ Options for the BOT",
    usage: "botfaq",
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    
		try{
      let milratodc = client.guilds.cache.get("773668217163218944")
      let milratomembers = await milratodc.members.fetch().catch(() => {});
      let partnercount = milratomembers.filter(m => m.roles.cache.has("823150244509515807"))
      partnercount = partnercount.map(m=>m.id).length
      
      let menuoptions = [
        {
          value: client.la[ls].cmds.info.botfaq.menuoptions[0].value,
          description: client.la[ls].cmds.info.botfaq.menuoptions[0].description,
          replymsg: client.la[ls].cmds.info.botfaq.menuoptions[0].replymsg,
          emoji: client.la[ls].cmds.info.botfaq.menuoptions[0].emoji //optional
        },
        {
          value: client.la[ls].cmds.info.botfaq.menuoptions[1].value,
          description: client.la[ls].cmds.info.botfaq.menuoptions[1].description,
          replymsg: handlemsg(client.la[ls].cmds.info.botfaq.menuoptions[1].replymsg, {
            commandcount: client.commands.map(a=>a).length,
            guildcount: client.guilds.cache.size,
            uptime: duration(client.uptime).map(i=> `\`${i}\``).join(", "),
            ping: Math.floor(client.ws.ping)
          }),
          emoji: client.la[ls].cmds.info.botfaq.menuoptions[1].emoji //optional
        },
        {
          value: client.la[ls].cmds.info.botfaq.menuoptions[2].value,
          description: client.la[ls].cmds.info.botfaq.menuoptions[2].description,
          replymsg: handlemsg(client.la[ls].cmds.info.botfaq.menuoptions[2].replymsg, {
            prefix: prefix,
            commandcount: client.commands.map(a=>a).length,
          }),
          emoji: client.la[ls].cmds.info.botfaq.menuoptions[2].emoji //optional
        },
        {
          value: client.la[ls].cmds.info.botfaq.menuoptions[3].value,
          description: client.la[ls].cmds.info.botfaq.menuoptions[3].description,
          replymsg: client.la[ls].cmds.info.botfaq.menuoptions[3].replymsg,
          emoji: client.la[ls].cmds.info.botfaq.menuoptions[3].emoji //optional
        },
        {
          value: client.la[ls].cmds.info.botfaq.menuoptions[4].value,
          description: client.la[ls].cmds.info.botfaq.menuoptions[4].description,
          replymsg: handlemsg(client.la[ls].cmds.info.botfaq.menuoptions[4].replymsg, {
            partnercount: partnercount
          }),
          emoji: client.la[ls].cmds.info.botfaq.menuoptions[4].emoji //optional
        },
        {
          value: client.la[ls].cmds.info.botfaq.menuoptions[5].value,
          description: client.la[ls].cmds.info.botfaq.menuoptions[5].description,
          replymsg: handlemsg(client.la[ls].cmds.info.botfaq.menuoptions[5].replymsg, {
            prefix: prefix
          }),
          emoji: client.la[ls].cmds.info.botfaq.menuoptions[5].emoji //optional
        },
        {
          value: client.la[ls].cmds.info.botfaq.menuoptions[6].value,
          description: client.la[ls].cmds.info.botfaq.menuoptions[6].description,
          replymsg: handlemsg(client.la[ls].cmds.info.botfaq.menuoptions[6].replymsg, {
            prefix: prefix,
            clientusertag: client.user.tag
          }),
          emoji: client.la[ls].cmds.info.botfaq.menuoptions[6].emoji //optional
        },
      ]
      //define the selection
      let Selection = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
          .setCustomId("MenuSelection")
          .setPlaceholder(client.la[ls].cmds.info.botfaq.placeholder)
          .addOptions(menuoptions.map(o => {
            let Obj = {}; 
            Obj.value = o.value.substring(0, 25);
            Obj.label = o.value.substring(0, 25);
            Obj.description = o.description.substring(0, 50);
            if(o.emoji){
              Obj.emoji = o.emoji;
            }
            return Obj;
          }))
        );
      //define the embed
      let MenuEmbed = new Discord.MessageEmbed()
      .setColor(es.color)
      .setAuthor(client.la[ls].cmds.info.botfaq.menuembed.title, client.user.displayAvatarURL(), "https://discord.gg/milrato")
      .setDescription(client.la[ls].cmds.info.botfaq.menuembed.description)
      //send the menu msg
      let menumsg = await message.reply({embeds: [MenuEmbed], components: [Selection]})
      //function to handle the menuselection
      function menuselection(interaction) {
        let menuoptiondata = menuoptions.find(v=>v.value.substring(0, 25) == interaction?.values[0])
        interaction?.reply({embeds: [new Discord.MessageEmbed()
        .setColor(es.color)
        .setAuthor(client.la[ls].cmds.info.botfaq.menuembed.title, client.user.displayAvatarURL(), "https://discord.gg/milrato")
        .setDescription(menuoptiondata.replymsg)], ephemeral: true});
      }
      //Event
      client.on('interactionCreate', (interaction) => {
        if (!interaction?.isSelectMenu()) return;
        if (interaction?.message.id === menumsg.id && interaction?.applicationId == client.user.id) {
          if (interaction?.user.id === cmduser.id) menuselection(interaction);
          else interaction?.reply({content: handlemsg(client.la[ls].cmds.info.botfaq.notallowed, {cmduserid: cmduser.id}), ephemeral:true});
        }
      });
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({embeds: [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.erroroccur)
            .setDescription(eval(client.la[ls]["cmds"]["info"]["botfaq"]["variable1"]))
        ]}).catch(()=>{});
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
