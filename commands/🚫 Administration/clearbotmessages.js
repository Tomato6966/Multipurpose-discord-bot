const {
  MessageEmbed, Collection, Permissions
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  delay,
  databasing
} = require(`../../handlers/functions`);
module.exports = {
  name: `clearbotmessages`,
  aliases: [`clearbotmsgs`, "purgebotmessages", "purgebotmsgs", "prune"],
  category: `🚫 Administration`,
  description: `Deletes a amount of messages from the bot in a Channel.`,
  usage: `clearbotmessages <Amount of messages>`,
  type: "channel",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      if(!message.guild.me.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES]))      
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["clearbotmessages"]["variable1"]))
        ]})
      let adminroles = GuildSettings?.adminroles || [];
      let cmdroles = GuildSettings?.cmdadminroles?.clearbotmessages || [];
      var cmdrole = []
      if (cmdroles.length > 0) {
        for (const r of cmdroles) {
          if (message.guild.roles.cache.get(r)) {
            cmdrole.push(` | <@&${r}>`)
          } else if (message.guild.members.cache.get(r)) {
            cmdrole.push(` | <@${r}>`)
          } else {
            const File = `clearbotmessages`;
            let index = GuildSettings && GuildSettings.cmdadminroles && typeof GuildSettings.cmdadminroles == "object" ? GuildSettings.cmdadminroles[File]?.indexOf(r) || -1 : -1;
            if(index > -1) {
              GuildSettings.cmdadminroles[File].splice(index, 1);
              client.settings.set(`${message.guild.id}.cmdadminroles`, GuildSettings.cmdadminroles)
            }
          }
        }
      }
      if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author?.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author?.id) && !message.member?.permissions?.has([Permissions.FLAGS.ADMINISTRATOR]))
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["clearbotmessages"]["variable2"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["clearbotmessages"]["variable3"]))
        ]});

      let messageCollection = new Collection(); //make a new collection
      let channelMessages = await message.channel.messages.fetch({ //fetch the last 100 messages
          limit: 100
      }).catch(err => console.log(err)); //catch any error
      messageCollection = messageCollection.concat(channelMessages.filter(msg => msg.author.id == client.user.id)); //add them to the Collection
      let tomanymsgs = 1; //some calculation for the messagelimit
      let messagelimit = 250 / 100; //devide it by 100 to get a counter
      if(args[0]){
          if(Number(args[0]) > 5000 || Number(args[0]) < 100) return message.reply(eval(client.la[ls]["cmds"]["administration"]["clearbotmessages"]["variable4"]))
          if(isNaN(args[0])) return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["clearbotmessages"]["variable5"])})
          messagelimit = Number(args[0]) / 100;
      }
      while (channelMessages.size === 100) { //make a loop if there are more then 100 messages in this channel to fetch
          if (tomanymsgs === messagelimit) break; //if the counter equals to the limit stop the loop
          tomanymsgs += 100; //add 1 to the counter
          let lastMessageId = channelMessages.lastKey(); //get key of the already fetched messages above
          channelMessages = await message.channel.messages.fetch({
          limit: 100,
          before: lastMessageId
          }).catch(err => console.log(err)); //Fetch again, 100 messages above the already fetched messages
          if (channelMessages) //if its true
          messageCollection = messageCollection.concat(channelMessages.filter(msg => msg.author.id == client.user.id)); //add them to the collection
      }
      let msgs = messageCollection.map(_ => _)
      for (let i = 0; i < msgs.length; i+=100)
        await message.channel.bulkDelete(msgs.slice(i, i+100))

      await message.reply({embeds : [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["clearbotmessages"]["variable6"]))
      ]}).then(msg => setTimeout(()=>{try{
        msg.delete()
      }catch{}
    },5000));
      if (GuildSettings && GuildSettings.adminlog && GuildSettings.adminlog != "no") {
        try {
          var channel = message.guild.channels.cache.get(GuildSettings.adminlog)
          if (!channel) return client.settings.set(`${message.guild.id}.adminlog`, "no");
          channel.send({embeds : [new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
            .setAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({
              dynamic: true
          }))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["clearbotmessages"]["variable7"]))
            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
           .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
            .setTimestamp().setFooter(client.getFooter("ID: " + message.author?.id, message.author.displayAvatarURL({dynamic: true})))
        ]})
        } catch (e) {
          console.error(e)
        }
      }
    } catch (e) {
      console.error(e);
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["clearbotmessages"]["variable10"]))
      ]});
    }
  }
}
