const {
  MessageEmbed, Collection, Permissions
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  delay,
  databasing
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: `clear`,
  aliases: [`purge`],
  category: `🚫 Administration`,
  description: `Deletes messages in a text channel or specified number of messages in a text channel.\n\nIf you Ping a User / Type "BOTS" after it, the amount of messages you give, is the amount of messages that will be checked, not that will be cleared!`,
  usage: `clear <Amount of messages> [@USER/BOTS]`,
  type: "channel",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      if(!message.guild.me.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES]))      
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["clear"]["variable1"]))
        ]})
      let adminroles = client.settings.get(message.guild.id, "adminroles")
      let cmdroles = client.settings.get(message.guild.id, "cmdadminroles.clear")
      var cmdrole = []
      if (cmdroles.length > 0) {
        for (const r of cmdroles) {
          if (message.guild.roles.cache.get(r)) {
            cmdrole.push(` | <@&${r}>`)
          } else if (message.guild.members.cache.get(r)) {
            cmdrole.push(` | <@${r}>`)
          } else {
            
            //console.log(r)
            client.settings.remove(message.guild.id, r, `cmdadminroles.clear`)
          }
        }
      }
      if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author.id) && !message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]))
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["clear"]["variable2"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["clear"]["variable3"]))
        ]});
      if(args[1]){
        if(args[1].toLowerCase() == "bots" || args[1].toLowerCase() == "bot"){
          let messageCollection = new Collection(); //make a new collection
          let channelMessages = await message.channel.messages.fetch({ //fetch the last 100 messages
              limit: 100
          }).catch(err => console.log(err)); //catch any error
          messageCollection = messageCollection.concat(channelMessages.filter(msg => msg.author.bot)); //add them to the Collection
          let tomanymsgs = 1; //some calculation for the messagelimit
          let messagelimit = 250 / 100; //devide it by 100 to get a counter
          if(args[0]){
              if(Number(args[0]) > 5000 || Number(args[0]) < 0) return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["clear"]["variable4"])})
              if(isNaN(args[0])) return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["clear"]["variable5"])})
              messagelimit = Number(args[0])/ 100;
          }
          if(Number(args[0]) > 100){
          while (channelMessages.size === 100) { //make a loop if there are more then 100 messages in this channel to fetch
              if (tomanymsgs === messagelimit) break; //if the counter equals to the limit stop the loop
              tomanymsgs += 1; //add 1 to the counter
              let lastMessageId = channelMessages.lastKey(); //get key of the already fetched messages above
              channelMessages = await message.channel.messages.fetch({
              limit: 100,
              before: lastMessageId
              }).catch(() => {}) //Fetch again, 100 messages above the already fetched messages
              if (channelMessages) //if its true
              messageCollection = messageCollection.concat(channelMessages.filter(msg => msg.author.bot)); //add them to the collection
          }}
          let msgs = messageCollection.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966)
          for(let i = 0; i < msgs.length; i+=100)
            await message.channel.bulkDelete(msgs.slice(i, i+100))
    
          await message.reply({embeds : [new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["clear"]["variable6"]))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["clear"]["variable7"]))
          ]}).then(msg => setTimeout(()=>{try { 
            msg.delete()
          } catch {} 
          }, 5000));
        }else {
          let user = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0] ? args[0] : ``);
          if(!user) return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["clear"]["variable8"])})
          let messageCollection = new Collection(); //make a new collection
          let channelMessages = await message.channel.messages.fetch({ //fetch the last 100 messages
              limit: 100
          }).catch(() => {}) //catch any error
          messageCollection = messageCollection.concat(channelMessages.filter(msg => msg.author.id == user.id)); //add them to the Collection
          let tomanymsgs = 1; //some calculation for the messagelimit
          let messagelimit = 250 / 100; //devide it by 100 to get a counter
          if(args[0]){
              if(Number(args[0]) > 5000 || Number(args[0]) < 0) return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["clear"]["variable9"])})
              if(isNaN(args[0])) return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["clear"]["variable10"])})
              messagelimit = Number(args[0])/ 100;
          }
          if(Number(args[0]) > 100){
          while (channelMessages.size === 100) { //make a loop if there are more then 100 messages in this channel to fetch
              if (tomanymsgs === messagelimit) break; //if the counter equals to the limit stop the loop
              tomanymsgs += 1; //add 1 to the counter
              let lastMessageId = channelMessages.lastKey(); //get key of the already fetched messages above
              channelMessages = await message.channel.messages.fetch({
              limit: 100,
              before: lastMessageId
              }).catch(() => {}) //Fetch again, 100 messages above the already fetched messages
              if (channelMessages) //if its true
              messageCollection = messageCollection.concat(channelMessages.filter(msg => msg.author.id == user.id)); //add them to the collection
          }}
          let msgs = messageCollection.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966)
          for(let i = 0; i < msgs.length; i+=100)
            await message.channel.bulkDelete(msgs.slice(i, i+100))
    
          await message.reply({embeds : [new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["clear"]["variable11"]))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["clear"]["variable12"]))
          ]}).then(msg => setTimeout(()=>{try { 
            msg.delete()
          } catch {} 
          }, 5000));
        }
      }else{
        await message.delete().catch(e=>console.log(e.stack ? String(e.stack).grey : String(e).grey))
        clearamount = Number(args[0]);
        if (clearamount >= 1 && clearamount <= 100) {
          await message.channel.bulkDelete(clearamount).catch(() => {});
        } else {
          let limit = clearamount > 1000 ? 1000 : clearamount;
          for (let i = 100; i <= limit; i += 100) {
            try {
              await message.channel.bulkDelete(100).catch(() => {});
            } catch {}
            await delay(1500);
          }
        }
        await message.reply({embeds : [new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["clear"]["variable13"]))
        ]}).then(msg => setTimeout(()=>{try { 
          msg.delete().catch(() => {})
        } catch {} 
        }, 5000));
      }
      if (client.settings.get(message.guild.id, `adminlog`) != "no") {
        try {
          var channel = message.guild.channels.cache.get(client.settings.get(message.guild.id, `adminlog`))
          if (!channel) return client.settings.set(message.guild.id, "no", `adminlog`);
          channel.send({embeds : [new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
            .setAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({
              dynamic: true
            }))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["clear"]["variable14"]))
            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
           .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
            .setTimestamp().setFooter(client.getFooter("ID: " + message.author.id, message.author.displayAvatarURL({dynamic: true})))
          ]})
        } catch (e) {
          console.log(e.stack ? String(e.stack).grey : String(e).grey)
        }
      }
    } catch (e) {
      console.log(e.stack ? String(e.stack).grey : String(e).grey);
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["clear"]["variable17"]))
      ]}).catch(() => {});
    }
  }
}