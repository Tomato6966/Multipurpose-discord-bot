const config = require(`../../botconfig/config.json`);
const emoji = require(`../../botconfig/emojis.json`);
var ee = require(`../../botconfig/embed.json`)
const {
  MessageEmbed, Permissions
} = require(`discord.js`)
const {
  databasing
} = require(`../../handlers/functions`);
module.exports = {
  name: `react`,
  category: `🚫 Administration`,
  aliases: [``],
  description: `Closes the ticket`,
  usage: `react <msgid> <Emoji>`,
  type: "server",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      let adminroles = GuildSettings?.adminroles || [];
      let cmdroles = GuildSettings?.cmdadminroles?.react || [];
      var cmdrole = []
        if(cmdroles.length > 0){
          for await (const r of cmdroles){
            if(message.guild.roles.cache.get(r)){
              cmdrole.push(` | <@&${r}>`)
            }
            else if(message.guild.members.cache.get(r)){
              cmdrole.push(` | <@${r}>`)
            }
            else {
              const File = `react`;
              let index = GuildSettings && GuildSettings.cmdadminroles && typeof GuildSettings.cmdadminroles == "object" ? GuildSettings.cmdadminroles[File]?.indexOf(r) || -1 : -1;
              if(index > -1) {
                GuildSettings.cmdadminroles[File].splice(index, 1);
                client.settings.set(`${message.guild.id}.cmdadminroles`, GuildSettings.cmdadminroles)
              }
            }
          }
        }
      if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author?.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author?.id) && !message.member?.permissions?.has([Permissions.FLAGS.ADMINISTRATOR]))  
     return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["react"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["react"]["variable2"]))
     ]});
      
      if (!args[0])
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["react"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["react"]["variable4"]))
        ]});
      if (args[0].length != 18)
          return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["react"]["variable5"]))
          ]});

      if (!args[1]) 
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["react"]["variable6"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["react"]["variable7"]))
        ]});

      if(args[1].includes("<")){
        let emojii = args[1].split(":")[args[1].split(":").length - 1].replace(">", "");
        console.log(emojii)
        if (!emojii)
          return message.reply({embeds :[new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["react"]["variable8"]))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["react"]["variable9"]))
          ]});
        message.channel.messages.fetch(args[0]).catch(() => null)
          .then((msg) => msg.react(emojii).catch(() => null))
          .catch(() => null);
        if(GuildSettings && GuildSettings.adminlog && GuildSettings.adminlog != "no"){
          try{
            var channel = message.guild.channels.cache.get(GuildSettings.adminlog)
            if(!channel) return client.settings.set(`${message.guild.id}.adminlog`, "no");
            channel.send({embeds : [new MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
              .setAuthor(client.getAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true})))
              .setDescription(eval(client.la[ls]["cmds"]["administration"]["react"]["variable10"]))
              .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
             .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
              .setTimestamp().setFooter(client.getFooter("ID: " + message.author?.id, message.author.displayAvatarURL({dynamic: true})))
            ]})
          }catch (e){
            console.error(e)
          }
        } 
      }else{
        let emojii = args[1];
        if (!emojii)
          return message.reply({embeds :[new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["react"]["variable13"]))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["react"]["variable14"]))
           ]} );
        message.channel.messages.fetch(args[0]).catch(() => null)
          .then((msg) => msg.react(emojii).catch(() => null))
          .catch(e=>{
            console.log(String(e.stack).grey.bgRed)
            return message.reply({embeds :[new MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(client.la[ls].common.erroroccur)
              .setDescription(eval(client.la[ls]["cmds"]["administration"]["react"]["variable15"]))
            ]});
          })
      }
      
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["react"]["variable16"]))
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["react"]["variable17"]))
      ]});
    }
  }
};

