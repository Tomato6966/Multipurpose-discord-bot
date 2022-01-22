const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: `warnings`,
  category: `🚫 Administration`,
  aliases: [`warns`, `warnlist`, `warn-list`],
  description: `Shows the warnings of a User`,
  usage: `warnings @User`,
  type: "member",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      //find the USER
      let warnmember = message.mentions.users.first();
      if(!warnmember && args[0] && args[0].length == 18) {
        let tmp = await client.users.fetch(args[0]).catch(() => {})
        if(tmp) warnmember = tmp;
        if(!tmp) return message.reply(eval(client.la[ls]["cmds"]["administration"]["warnings"]["variable1"]))
      }
      else if(!warnmember && args[0]){
        let alluser = message.guild.members.cache.map(member=> String(member.user.username).toLowerCase())
        warnmember = alluser.find(user => user.includes(args[0].toLowerCase()))
        warnmember = message.guild.members.cache.find(me => (me.user.username).toLowerCase() == warnmember)
        if(!warnmember || warnmember == null || !warnmember.id) return message.reply(eval(client.la[ls]["cmds"]["administration"]["warnings"]["variable2"]))
        warnmember = warnmember.user;
      }
      else {
        warnmember = message.mentions.users.first() || message.author;
      }
      if (!warnmember)
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["warnings"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["warnings"]["variable4"]))
        ]});


      try {
        client.userProfiles.ensure(warnmember.id, {
          id: message.author.id,
          guild: message.guild.id,
          totalActions: 0,
          warnings: [],
          kicks: []
        });
        const warnIDs = client.userProfiles.get(warnmember.id, 'warnings');
        const warnData = warnIDs.map(id => client.modActions.get(id));
        let warnings = warnData.filter(v => v.guild == message.guild.id);
        if (!warnIDs || !warnData || !warnIDs.length || warnIDs.length ==null|| !warnings.length || warnings.length ==null)
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(`He/She has: ${client.userProfiles.get(warnmember.id, 'warnings') ? client.userProfiles.get(warnmember.id, 'warnings').length : 0} Global Warns`, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/joypixels/275/globe-with-meridians_1f310.png"))
            
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["warnings"]["variable5"]))
           ]} );

        let warnembed = new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(`He/She has: ${client.userProfiles.get(warnmember.id, 'warnings') ? client.userProfiles.get(warnmember.id, 'warnings').length : 0} Global Warns`, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/joypixels/275/globe-with-meridians_1f310.png"))
          
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["warnings"]["variable6"]))
        let string = ``;
        for (let i = 0; i < warnings.length; i++) {
          string +=
            `================================
**Warn Id:** \`${i}\`
**Warned at:** \`${warnings[i].when}\`
**Warned by:** \`${message.guild.members.cache.get(warnings[i].moderator) ? message.guild.members.cache.get(warnings[i].moderator).user.tag :  warnings[i].moderator}\`
**Reason:** \`${warnings[i].reason.length > 50 ? warnings[i].reason.substr(0, 50) + ` ...` : warnings[i].reason}\`
`
        }
        warnembed.setDescription(string)
        let k = warnembed.description
        for (let i = 0; i < k.length; i += 2048) {
          await message.reply({embeds :[warnembed.setDescription(k.substr(i, i + 2048))]})
        }

        if(client.settings.get(message.guild.id, `adminlog`) != "no"){
          try{
            var channel = message.guild.channels.cache.get(client.settings.get(message.guild.id, `adminlog`))
            if(!channel) return client.settings.set(message.guild.id, "no", `adminlog`);
            channel.send({embeds : [new MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
              .setAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
              .setDescription(eval(client.la[ls]["cmds"]["administration"]["warnings"]["variable7"]))
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
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["warnings"]["variable10"]))
        ]});
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["warnings"]["variable11"]))
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["warnings"]["variable12"]))
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
