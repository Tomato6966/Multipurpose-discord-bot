const {
  MessageEmbed,
  Permissions
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  databasing
} = require(`../../handlers/functions`);
module.exports = {
  name: `detailwarn`,
  category: `🚫 Administration`,
  aliases: [`warninfo`, `snipe`, `infowarn`, `infowarning`, `detailwarning`, `warninginfo`],
  description: `Shows details about one warn Command of a Member`,
  usage: `detailwarn @User [Reason]`,
  type: "member",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      //find the USER
      let warnmember = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0]) || message.member
      if (!warnmember)
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["detailwarn"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["detailwarn"]["variable2"]))
        ]});

      if (!args[1])
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["detailwarn"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["detailwarn"]["variable4"]))
        ]});


      try {
        client.userProfiles.ensure(warnmember.user.id, {
          id: message.author?.id,
          guild: message.guild.id,
          totalActions: 0,
          warnings: [],
          kicks: []
        });

        const warnIDs = client.userProfiles.get(warnmember.user.id, 'warnings');
        const dwarnData = warnIDs.map(id => client.modActions.get(id));
        const warnData = dwarnData.filter(v=> v.guild == message.guild.id)
        
        if (!warnIDs || !warnIDs.length || warnIDs.length < 1 || !dwarnData || !dwarnData.length || !warnData || !warnData.length)
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["detailwarn"]["variable5"]))
          ]});
        if (isNaN(args[1]) || Number(args[1]) >= warnIDs.length || Number(args[1]) < 0)
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["detailwarn"]["variable6"]))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["detailwarn"]["variable7"]))
          ]});

        let warning = warnData[parseInt(args[1])]
        let warned_by = message.guild.members.cache.get(warning.moderator) ? `${message.guild.members.cache.get(warning.moderator).user.tag} (${warning.moderator})` : warning.moderator;
        let warned_in = client.guilds.cache.get(warning.guild) ? `${client.guilds.cache.get(warning.guild).name} (${warning.guild})` : warning.guild;

        message.reply({embeds : [new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(es))
          .setAuthor(`Warn from ${warnmember.user.tag}`, warnmember.user.displayAvatarURL({
            dynamic: true
          }))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["detailwarn"]["variable8"]))
          .addField(`Warn:`, `\`${parseInt(args[1]) + 1}\` out of **${warnIDs.length} Warns**`, true)
          .addField(`Warned by:`, `\`${warned_by}\``, true)
          .addField(`Warned at:`, `\`${warning.when}\``, true)
          .addField(`Warned in:`, `\`${warned_in}\``, true)
          .addField(`Old Thumbnail URL`, `[\`Click here\`](${warning.oldthumburl})`, true)
          .addField(`Old Highest Role:`, `${message.guild.roles.cache.get(warning.oldhighesrole.id) ? `<@&`+message.guild.roles.cache.get(warning.oldhighesrole.id)+`>` : `\`${warning.oldhighesrole.name} (${warning.oldhighesrole.id})\``}`, true)
        ]});
      } catch (e) {
        console.error(e);
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["detailwarn"]["variable9"]))
        ]});
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["detailwarn"]["variable10"]))
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["detailwarn"]["variable11"]))
      ]});
    }
  }
};

