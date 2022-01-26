const config = require(`${process.cwd()}/botconfig/config.json`);
const ms = require(`ms`);
var ee = require(`${process.cwd()}/botconfig/embed.json`)
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  MessageEmbed, Permissions
} = require(`discord.js`)
const {
  databasing, handlemsg
} = require(`${process.cwd()}/handlers/functions`);
let running = new Map();
const { MessageButton, MessageActionRow } = require('discord.js')
module.exports = {
  name: `sync-invites`,
  category: `🚫 Administration`,
  cooldown: 4,
  usage: `sync-invites`,
  description: `Syncs all Invites, it could delete some old invites tho (if the link got deleted, etc.)`,
  memberpermissions: ["ADMINISTRATOR"],
  type: "server",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      if(!message.guild.me.permissions.has([Permissions.FLAGS.MANAGE_GUILD]))      
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["sync-invites"]["variable1"]))
        ]})
      if(running.has(message.guild.id) && running.get(message.guild.id)) {   
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["sync-invites"]["variable2"]))
        ]})

      }
      let approve = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji("833101995723194437").setLabel("YES DO IT!")
      let deny = new MessageButton().setStyle('PRIMARY').setCustomId('2').setEmoji("833101993668771842").setLabel("Cancel")
      let awaitedmsg = await message.reply({   
          embeds: [new MessageEmbed()
            .setColor(es.color).setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["sync-invites"]["variable3"])), 
          
      ],buttons: [approve, deny]});//create a collector for the thinggy
      const collector = awaitedmsg.createMessageComponentCollector({filter: (i) => i?.isButton() && i?.user && i?.user.id == cmduser.id && i?.message.author.id == client.user.id, time: 30e3 }); //collector for 5 seconds
      //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
      var edited = false;
      collector.on('collect', async b => {
          if(b?.user.id !== message.author.id)
            return b?.reply(handlemsg(client.la[ls].cmds.info.help.buttonerror, {prefix: prefix}), true)
          //page forward
          if(b?.customId == "1") {
            b?.reply("Syncing Invites...", true)
            edited = true;
            running.set(message.guild.id, true);
            let guildInvites = await message.guild.invites.fetch().catch(() => {});
            guildInvites = [...guildInvites.values()]
            if(guildInvites.size == 0) {
              return message.reply({embeds: [new MessageEmbed()
                .setColor(es.wrongcolor).setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["administration"]["sync-invites"]["variable4"]))
              ]})
            }
            async function asyncForEach(array, callback) {
              for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array);
              }
            }
            let Users = new Set(guildInvites.map((i) => i?.inviter));
            Users = [...Users];
            await asyncForEach(Users, async (user) => {
              try{
                // Fetch guild and member data from the db
                client.invitesdb?.ensure(message.guild.id + user.id, {
                  /* REQUIRED */
                  id: user.id, // Discord ID of the user
                  guildId: message.guild.id,
                  /* STATS */
                  fake: 0,
                  leaves: 0,
                  invites: 0,
                  /* INVITES DATA */
                  invited: [],
                  left: [],
                  /* INVITER */
                  invitedBy: "",
                  usedInvite: {},
                  joinData: {
                    type: "unknown",
                    invite: null
                  }, // { type: "normal" || "oauth" || "unknown" || "vanity", invite: inviteData || null }
                  messagesCount: 0,
                  /* BOT */
                  bot: user.bot || false
                });
                let memberData = await client.invitesdb?.find(v => v.id == user.id && v.guildId == message.guild.id && v.bot == user.bot || false);
                let memberDataKey = await client.invitesdb?.findKey(v => v.id == user.id && v.guildId == message.guild.id && v.bot == user.bot  || false);
                memberData.invites = guildInvites.filter((i) => i?.inviter.id === user.id).map((i) => i?.uses).greyuce((p, c) => p + c)
                client.invitesdb?.set(memberDataKey, memberData)
              }catch (e){
                console.log(e.stack ? String(e.stack).grey : String(e).grey)
              }
            })
            running.set(message.guild.id, false);
            return message.reply(eval(client.la[ls]["cmds"]["administration"]["sync-invites"]["variable5"]))
          }
          //go home
          else if(b?.customId == "2"){
            b?.reply("Cancelled!", true)
          } 
      });        
      collector.on('end', collected => {
        if(!edited)
          awaitedmsg.edit({content: "TIME HAS ENDED!", embeds: awaitedmsg.embeds[0], buttons: [approve.setDisabled(true), deny.setDisabled(true)]})
        edited = true;
      });
      setTimeout(()=>{
        if(!edited)
          awaitedmsg.edit({content: "TIME HAS ENDED!", embeds: awaitedmsg.embeds[0], buttons: [approve.setDisabled(true), deny.setDisabled(true)]})
          edited = true;
      }, 30e3 + 150)
      


      if (client.settings.get(message.guild.id, `adminlog`) != "no") {
        try {
          var channel = message.guild.channels.cache.get(client.settings.get(message.guild.id, `adminlog`))
          if (!channel) return client.settings.set(message.guild.id, "no", `adminlog`);
          channel.send({embeds: [new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
            .setAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({
              dynamic: true
            }))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["sync-invites"]["variable6"]))
            .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_15"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable15"]))
           .addField(eval(client.la[ls]["cmds"]["administration"]["ban"]["variablex_16"]), eval(client.la[ls]["cmds"]["administration"]["ban"]["variable16"]))
            .setTimestamp().setFooter(client.getFooter("ID: " + message.author.id, message.author.displayAvatarURL({dynamic: true})))
          ]})
        } catch (e) {
          console.log(e.stack ? String(e.stack).grey : String(e).grey)
        }
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["sync-invites"]["variable9"]))
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