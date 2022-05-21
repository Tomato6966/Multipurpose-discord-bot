const {
  MessageEmbed, Collection, MessageAttachment, Permissions
} = require("discord.js");
const Discord = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const moment = require("moment")
const fs = require('fs')
const {
  databasing, delay, create_transcript, GetUser, GetRole
} = require(`../../handlers/functions`);
const { MessageButton, MessageActionRow } = require('discord.js')
module.exports = {
  name: "ticket",
  category: "🚫 Administration",
  aliases: ["close", "manageticket"],
  cooldown: 2,
  usage: "ticket",
  description: "Manages the Ticket, closes, deletes, createlog, etc. etc.",
  type: "channel",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
    try {
      let adminroles = GuildSettings?.adminroles || [];
      let cmdroles = GuildSettings?.cmdadminroles?.ticket || [];
      let cmdroles2 = GuildSettings?.cmdadminroles?.close || [];
      try{for (const r of cmdroles2) cmdroles.push(r)}catch{}
     
      if(!await client.isTicket(message.channel.id)) 
        return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["close"]["variable2"])})
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
              const File = `ticket`;
              let index = GuildSettings && GuildSettings.cmdadminroles && typeof GuildSettings.cmdadminroles == "object" ? GuildSettings.cmdadminroles[File]?.indexOf(r) || -1 : -1;
              if(index > -1) {
                GuildSettings.cmdadminroles[File].splice(index, 1);
                client.settings.set(`${message.guild.id}.cmdadminroles`, GuildSettings.cmdadminroles)
              }
              const File2 = `close`;
              let index2 = GuildSettings && GuildSettings.cmdadminroles && typeof GuildSettings.cmdadminroles == "object" ? GuildSettings.cmdadminroles[File2]?.indexOf(r) || -1 : -1;
              if(index2 > -1) {
                GuildSettings.cmdadminroles[File2].splice(index2, 1);
                client.settings.set(`${message.guild.id}.cmdadminroles`, GuildSettings.cmdadminroles)
              }
            }
          }
        }
      let Ticketdata = client.setups.get(message.channel.id, "ticketdata");
      let ticketSystemNumber = String(Ticketdata.type).split("-");
      ticketSystemNumber = ticketSystemNumber[ticketSystemNumber.length - 1];
      let ticket = client.setups.get(message.guild.id, `${String(Ticketdata.type).includes("menu") ? "menu": ""}ticketsystem${ticketSystemNumber}`)
      
      if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author?.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author?.id) && !message.member?.permissions?.has([Permissions.FLAGS.ADMINISTRATOR]) && !message.member.roles.cache.some(r => ticket.adminroles.includes(r ? r.id : r)))
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["administration"]["close"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["administration"]["close"]["variable4"]))
        ]});
        let button_close = new MessageButton().setStyle('PRIMARY').setCustomId('ticket_close').setLabel('Close').setEmoji("🔒") 
        let button_delete = new MessageButton().setStyle('SECONDARY').setCustomId('ticket_delete').setLabel("Delete").setEmoji("🗑️")
        let button_transcript = new MessageButton().setStyle('PRIMARY').setCustomId('ticket_transcript').setLabel("Transcript").setEmoji("📑")
        let button_user = new MessageButton().setStyle('SUCCESS').setCustomId('ticket_user').setLabel("Manage Users").setEmoji("👤")
        let button_role = new MessageButton().setStyle('SUCCESS').setCustomId('ticket_role').setLabel("Manage Roles").setEmoji("📌") 
        let buttonRow1 = new MessageActionRow().addComponents([button_close, button_delete, button_transcript, button_user, button_role])
        const allbuttons = [buttonRow1]
        message.reply({embeds: [new MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["administration"]["close"]["variable5"]))
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setDescription(`> 🔒 **== Close** the Ticket
            
>  🗑 **== Delete** the Ticket

> 📑 **== Create a Log** of the Ticket

> 👤 **==** Manage **User** Access (Add/Remove)

> 📌 **==** Manage **Role** Access (Add/Remove)`).setFooter(client.getFooter(es))
          ], components: allbuttons})
          return; 
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["administration"]["close"]["variable6"]))
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["close"]["variable7"]))
      ]});
    }
  }
}


