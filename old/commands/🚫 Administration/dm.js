const { fail } = require("assert");
const {
  MessageEmbed,
  Permissions
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require("../../botconfig/emojis.json");
const ms = require("ms")
const {
  databasing, delay
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: "dm",
  category: "🚫 Administration",
  aliases: ["dm"],
  cooldown: 2,
  usage: "dm <@User/@Role> <MESSAGE>",
  description: "Allows you to DM a USER or every USER of a ROLE",
  type: "memberrole",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["dm"]["variable1"])})
      if (!message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]))
        return message.reply({embeds  :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["dm"]["variable2"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["dm"]["variable3"]))
        ]});
      let member = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first();
      let role = message.mentions.roles.filter(role=>role.guild.id==message.guild.id).first();
      if(member){
        if (!args[1])
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["dm"]["variable4"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["dm"]["variable5"]))
        ]});
        message.delete().catch(e => console.log("Couldn't delete msg, this is a catch to prevent crash"))
        try{
          member.send({embeds : [new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setFooter(client.getFooter(es))
            .setAuthor(`Message from: ${message.author.username}`, message.author.displayAvatarURL({dynamic:true}), "https://discord.gg/milrato")
            .setDescription(args.slice(1).join(" ").substring(0, 2048))
          ]})
          message.reply({embeds : [new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["dm"]["variable6"]))
          ]})
        }catch{
          message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["dm"]["variable7"]))
          ]})
        }
      }
      else if(role){
        await message.guild.members.fetch().catch(() => {});
        if (!args[1])
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["dm"]["variable8"]))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["dm"]["variable9"]))
          ]});
        var members = message.guild.members.cache.filter(member=> member.roles.cache.has(role.id) && !member.user.bot).map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966);  
        var failed = [];
        var succeeded = [];
        message.delete().catch(e => console.log("Couldn't delete msg, this is a catch to prevent crash"))
        if (!members || members == null || members.length == null || members.length == 0)
          return message.reply({embeds :[new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["dm"]["variable10"]))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["dm"]["variable11"]))
          ]});
        let seconds = Number(members.length) * 1500;
        await message.reply({embeds :[new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(es))
          .setAuthor(`Dming ${members.length} Members...`, "https://images-ext-1.discordapp.net/external/ANU162U1fDdmQhim_BcbQ3lf4dLaIQl7p0HcqzD5wJA/https/cdn.discordapp.com/emojis/756773010123522058.gif", "https://discord.gg/2dKrZQyaC4")
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["dm"]["variable12"]))
        ]});
        for(const member of members) {
          try{
            var failedd = false
            await member.send({embeds : [new MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setFooter(client.getFooter(es))
              .setAuthor(`Message from: ${message.author.username}`, message.author.displayAvatarURL({dynamic:true}), "https://discord.gg/milrato")
              .setDescription(args.slice(1).join(" ").substring(0, 2048))
            ]}).catch(e=>{
              failedd = true
            })
            if(failedd){
              failed.push(member.user.tag)
            }else {
              succeeded.push(member.user.tag)
            }
          }catch{
            failed.push(member.user.tag)
          }
          await delay(1500);
        }
        await message.reply({content: `<@${message.author.id}>`, embeds: [new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["dm"]["variable13"]))
          .setDescription(failed.length > 0 ? `**FAILED MEMBERS:**\n> ${failed.map(r => `\`${r}\``).join("\n")}`.substring(0, 2048) : "**FAILED MEMBERS:**\n> No one Failed")
          .addField(eval(client.la[ls]["cmds"]["administration"]["dm"]["variablex_14"]), eval(client.la[ls]["cmds"]["administration"]["dm"]["variable14"]))
        ]})
      }
      else {
        return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["dm"]["variable15"]))
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["dm"]["variable16"]))
        ]});
      }
      if(client.settings.get(message.guild.id, `adminlog`) != "no"){
        try{
          var channel = message.guild.channels.cache.get(client.settings.get(message.guild.id, `adminlog`))
          if(!channel) return client.settings.set(message.guild.id, "no", `adminlog`);
          channel.send({embeds : [new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
            .setAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["dm"]["variable17"]))
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
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["dm"]["variable20"]))
      ]});
    }
  }
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github?.com/Tomato6966/Discord-Js-Handler-Template
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
