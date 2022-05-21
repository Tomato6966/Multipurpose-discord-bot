const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  databasing
} = require(`../../handlers/functions`);
module.exports = {
  name: `globalwarnings`,
  category: `🚫 Administration`,
  aliases: [`globalwarns`, `globalwarnlist`, `global-warn-list`],
  description: `Shows the warnings of a User, globally`,
  usage: `globalwarnings @User`,
  type: "member",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      //find the USER
      let warnmember = message.mentions.users.first();
      if(!warnmember && args[0] && args[0].length == 18) {
        let tmp = await client.users.fetch(args[0]).catch(() => null)
        if(tmp) warnmember = tmp;
        if(!tmp) return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["globalwarnings"]["variable1"])})
      }
      else if(!warnmember && args[0]){
        let alluser = message.guild.members.cache.map(member=> String(member.user.username).toLowerCase())
        warnmember = alluser.find(user => user.includes(args[0].toLowerCase()))
        warnmember = message.guild.members.cache.find(me => (me.user.username).toLowerCase() == warnmember)
        if(!warnmember || warnmember == null || !warnmember.id) return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["globalwarnings"]["variable2"])})
        warnmember = warnmember.user;
      }
      else {
        warnmember = message.mentions.users.first() || message.author;
      }
      if (!warnmember)
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["globalwarnings"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["globalwarnings"]["variable4"]))
        ]});


      try {
        client.userProfiles.ensure(warnmember.id, {
          id: message.author?.id,
          guild: message.guild.id,
          totalActions: 0,
          warnings: [],
          kicks: []
        });
        const warnIDs = client.userProfiles.get(warnmember.id, 'warnings');
        const warnData = warnIDs.map(id => client.modActions.get(id));
        if (!warnIDs || !warnData || !warnIDs.length)
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(`He/She has: ${client.userProfiles.get(warnmember.id, 'warnings') ? client.userProfiles.get(warnmember.id, 'warnings').filter(v=>v.guild == message.guild.id).length : 0} in ${message.guild.name}`, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/joypixels/275/globe-with-meridians_1f310.png"))
            
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["globalwarnings"]["variable5"]))
          ]});

        let warnings = warnData
        let warnembed = new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(`He/She has: ${client.userProfiles.get(warnmember.id, 'warnings') ? client.userProfiles.get(warnmember.id, 'warnings').filter(v=>v.guild == message.guild.id).length : 0} in ${message.guild.name}`, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/joypixels/275/globe-with-meridians_1f310.png"))
          
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["globalwarnings"]["variable6"]))
        let string = ``;
        for (let i = 0; i < warnings.length; i++) {
          string +=
            `================================
**Warn Id:** \`${i}\`
**Warned at:** \`${warnings[i].when}\`
**Warned in:** \`${client.guilds.cache.get(warnings[i].guild) ? client.guilds.cache.get(warnings[i].guild).name :  warnings[i].guild}\`
**Reason:** \`${warnings[i].reason.length > 50 ? warnings[i].reason.substring(0, 50) + ` ...` : warnings[i].reason}\`
`
        }
        warnembed.setDescription(string)
        let k = warnembed.description
        for (let i = 0; i < k.length; i += 2048) {
          await message.reply({embeds :[warnembed.setDescription(k.substring(i, i + 2048))]})
        }

        if(GuildSettings && GuildSettings.adminlog && GuildSettings.adminlog != "no"){
          try{
            var channel = message.guild.channels.cache.get(GuildSettings.adminlog)
            if(!channel) return client.settings.set(`${message.guild.id}.adminlog`, "no");
            channel.send({embeds : [new MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
              .setAuthor(client.getAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true})))
              .setDescription(eval(client.la[ls]["cmds"]["administration"]["globalwarnings"]["variable7"]))
              .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
             .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
              .setTimestamp().setFooter(client.getFooter("ID: " + message.author?.id, message.author.displayAvatarURL({dynamic: true})))
            ]})
          }catch (e){
            console.error(e)
          }
        } 

      } catch (e) {
        console.error(e);
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["globalwarnings"]["variable10"]))
        ]});
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["globalwarnings"]["variable11"]))
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["globalwarnings"]["variable12"]))
      ]});
    }
  }
};

