const {
  MessageEmbed, Permissions
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: `warn`,
  category: `🚫 Administration`,
  cooldown: 0.5,
  description: `Warns a Member with a Reason`,
  usage: `warn @User [Reason]`,
  type: "member",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      let adminroles = client.settings.get(message.guild.id, "adminroles")
      let cmdroles = client.settings.get(message.guild.id, "cmdadminroles.warn")
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
              client.settings.remove(message.guild.id, r, `cmdadminroles.warn`)
            }
          }
        }
      if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author.id) && !message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]))
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable2"]))
        ]});
      let warnmember = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0] ? args[0] : ``);
      if (!warnmember)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable4"]))
        ]});

      let reason = args.slice(1).join(` `);
      if (!reason) {
        reason = `NO REASON`;
      }

      const memberPosition = warnmember.roles.highest.position;
      const moderationPosition = message.member.roles.highest.position;

      if (moderationPosition <= memberPosition)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable5"]))
        ]});

      try {
        client.userProfiles.ensure(warnmember.user.id, {
          id: message.author.id,
          guild: message.guild.id,
          totalActions: 0,
          warnings: [],
          kicks: []
        });
        const newActionId = client.modActions.autonum;
        client.modActions.set(newActionId, {
          user: warnmember.user.id,
          guild: message.guild.id,
          type: 'warning',
          moderator: message.author.id,
          reason: reason,
          when: new Date().toLocaleString(`de`),
          oldhighesrole: warnmember.roles ? warnmember.roles.highest : `Had No Roles`,
          oldthumburl: warnmember.user.displayAvatarURL({
            dynamic: true
          })
        });
        // Push the action to the user's warnings
        client.userProfiles.push(warnmember.user.id, newActionId, 'warnings');
        client.userProfiles.inc(warnmember.user.id, 'totalActions');
        
        client.stats.push(message.guild.id+message.author.id, new Date().getTime(), "warn"); 
        const warnIDs = client.userProfiles.get(warnmember.user.id, 'warnings')
        const warnData = warnIDs.map(id => client.modActions.get(id));
        let warnings = warnData.filter(v => v.guild == message.guild.id);
        warnmember.send({embeds :[new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(`You have: ${client.userProfiles.get(warnmember.user.id, 'warnings') ? client.userProfiles.get(warnmember.user.id, 'warnings').length : 0} Global Warns`, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/joypixels/275/globe-with-meridians_1f310.png"))
          
          .setAuthor(`You've got warned by: ${message.author.tag}`, message.author.displayAvatarURL({
            dynamic: true
          }))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable6"]))]}).catch(e => console.log(e.message))

        message.reply({embeds :[new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(`He has: ${client.userProfiles.get(warnmember.user.id, 'warnings') ? client.userProfiles.get(warnmember.user.id, 'warnings').length : 0} Global Warns`, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/joypixels/275/globe-with-meridians_1f310.png"))
          
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable7"]))
          .setThumbnail(warnmember.user.displayAvatarURL({
            dynamic: true
          }))
          .setDescription(`**He now has: ${warnings.length} Warnings in ${message.guild.name}**`.substr(0, 2048))
        ]});

        let warnsettings = client.settings.get(message.guild.id, "warnsettings")
        if(warnsettings.kick && warnsettings.kick == warnings.length){
          if (!warnmember.kickable)
            return message.reply({embeds :[new MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable8"]))
            ]});
            try{
              warnmember.send({embeds : [new MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable9"]))
                .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable10"]))
              ]});
            } catch{
              return message.reply({embeds :[new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable11"]))
                .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable12"]))
              ]});
            }
            try {
              warnmember.kick({
                reason: `Reached ${warnings.length} Warnings`
              }).then(() => {
                message.reply({embeds :[new MessageEmbed()
                  .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                  .setFooter(client.getFooter(es))
                  .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable13"]))
                  .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable14"]))
                ]});
              });
            } catch (e) {
              console.log(e.stack ? String(e.stack).grey : String(e).grey);
              return message.reply({embeds : [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(client.la[ls].common.erroroccur)
                .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable15"]))
              ]});
            }
        }
        if(warnsettings.ban && warnsettings.ban == warnings.length){
          if (!warnmember.bannable)
            return message.reply({embeds : [new MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable16"]))
            ]});
            try{
              warnmember.send({embeds :[new MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable17"]))
              ]});
            } catch {
              return message.reply({embeds :[new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable18"]))
                .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable19"]))
              ]});
            }
            try {
              warnmember.ban({
                reason: `Reached ${warnings.length} Warnings`
              }).then(() => {
                message.reply({embeds :[new MessageEmbed()
                  .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                  .setFooter(client.getFooter(es))
                  .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable20"]))
                  .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable21"]))
                ]});
              });
            } catch (e) {
              console.log(e.stack ? String(e.stack).grey : String(e).grey);
              return message.reply({embeds :[new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable22"]))
                .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable23"]))
              ]});
            }
        }
        for(const role of warnsettings.roles){
          if(role.warncount == warnings.length){
            if(!warnmember.roles.cache.has(role.roleid)){
              warnmember.roles.add(role.roleid).catch((O)=>{})
            }
          }
        }
        if(client.settings.get(message.guild.id, `adminlog`) != "no"){
          try{
            var channel = message.guild.channels.cache.get(client.settings.get(message.guild.id, `adminlog`))
            if(!channel) return client.settings.set(message.guild.id, "no", `adminlog`);
            channel.send({embeds : [new MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
              .setAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
              .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable24"]))
              .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
             .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
              .setTimestamp().setFooter(client.getFooter("ID: " + message.author.id, message.author.displayAvatarURL({dynamic: true})))
            ]})
          }catch (e){
            console.log(e.stack ? String(e.stack).grey : String(e).grey)
          }
        } 
        
      } catch (e) {
        console.log(e.stack ? String(e.stack).grey : String(e).grey);
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable27"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable28"]))
        ]});
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable29"]))
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable30"]))
       ]} );
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
