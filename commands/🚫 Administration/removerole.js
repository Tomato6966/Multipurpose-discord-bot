const config = require(`${process.cwd()}/botconfig/config.json`);
const ms = require(`ms`);
var ee = require(`${process.cwd()}/botconfig/embed.json`)
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  MessageEmbed, Permissions
} = require(`discord.js`)
const {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: `removerole`,
  category: `🚫 Administration`,
  aliases: [`roleremove`, "remove-role", "role-remove"],
  cooldown: 4,
  usage: `removerole @User @Role`,
  description: `Removes a Role from a User`,
  type: "memberrole",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      if(!message.guild.me.permissions.has([Permissions.FLAGS.MANAGE_ROLES]))      
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["removerole"]["variable1"]))
      ]})
      let adminroles = client.settings.get(message.guild.id, "adminroles")
      let cmdroles = client.settings.get(message.guild.id, "cmdadminroles.removerole")
      var cmdrole = []
        if(cmdroles.length > 0){
          for(const r of cmdroles){
            if(message.guild.roles.cache.get(r)){
              cmdrole.push(` | <@&${r}>`)
            }
            else if(message.guild.members.cache.get(r)){
              cmdrole.push(` | <@${r}>`)
            }
            else {
              
              //console.log(r)
              client.settings.remove(message.guild.id, r, `cmdadminroles.removerole`)
            }
          }
        }
      if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author.id) && !message.member.permissions.has("ADMINISTRATOR"))
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["removerole"]["variable2"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["removerole"]["variable3"]))
        ]});
      let member = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0]);
      if (!member)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["removerole"]["variable4"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["removerole"]["variable5"]))
        ]});
      let role = message.mentions.roles.filter(role=>role.guild.id==message.guild.id).first()  || message.guild.roles.cache.get(args[1]);
      if (!role || role == null || role == undefined|| role.name == null || role.name == undefined)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["removerole"]["variable6"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["removerole"]["variable7"]))
        ]});
      if (member.roles.highest.position >= message.member.roles.highest.position)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["removerole"]["variable8"]))
         ]} );
      if(message.member.roles.highest.position <= role.position)
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["removerole"]["variable9"]))
         ]} );
      if(!member.roles.cache.some(r=>r.id == (role.id)))
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["removerole"]["variable10"]))
        ]});
      var ge = false;
      member.roles.remove(role.id).catch(e=>{
        console.log(e.stack ? String(e.stack).grey : String(e).grey)
        ge = e;
      })
      if(ge) return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["removerole"]["variable11"]))
        .setDescription(ge.message)
      ]});
      message.reply({embeds :[new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["removerole"]["variable12"]))
      ]});

      if(client.settings.get(message.guild.id, `adminlog`) != "no"){
        try{
          var channel = message.guild.channels.cache.get(client.settings.get(message.guild.id, `adminlog`))
          if(!channel) return client.settings.set(message.guild.id, "no", `adminlog`);
          channel.send({embeds :[new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
            .setAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["removerole"]["variable13"]))
            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
           .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
            .setTimestamp().setFooter(client.getFooter("ID: " + message.author.id, message.author.displayAvatarURL({dynamic: true})))
          ]})
        }catch (e){
          console.log(e.stack ? String(e.stack).grey : String(e).grey)
        }
      } 
      
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["removerole"]["variable16"]))
      ]});
    }
  }
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
