const {
  MessageEmbed, Collection, MessageAttachment, Permissions
} = require("discord.js");
const Discord = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const moment = require("moment")
const fs = require('fs')
const {
  databasing, delay, create_transcript, GetUser, GetRole
} = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow } = require('discord.js')
module.exports = {
  name: "ticket",
  category: "🚫 Administration",
  aliases: ["close", "manageticket"],
  cooldown: 2,
  usage: "ticket",
  description: "Manages the Ticket, closes, deletes, createlog, etc. etc.",
  type: "channel",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      let adminroles = client.settings.get(message.guild.id, "adminroles")
      let cmdroles = client.settings.get(message.guild.id, "cmdadminroles.ticket")
      let cmdroles2 = client.settings.get(message.guild.id, "cmdadminroles.close")
      try{for (const r of cmdroles2) cmdrole.push(r)}catch{}
     
      if( !client.setups.get("TICKETS", "tickets")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets1")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets2")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets3")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets4")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets5")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets6")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets7")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets8")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets9")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets10")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets11")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets12")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets13")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets14")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets15")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets16")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets17")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets18")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets19")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets20")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets21")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets22")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets23")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets24")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "tickets25")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets1")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets2")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets3")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets4")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets5")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets6")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets7")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets8")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets9")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets10")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets11")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets12")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets13")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets14")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets15")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets16")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets17")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets18")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets19")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets20")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets21")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets22")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets23")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets24")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "menutickets25")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets1")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets2")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets3")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets4")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets5")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets6")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets7")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets8")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets9")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets10")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets11")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets12")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets13")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets14")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets15")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets16")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets17")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets18")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets19")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets20")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets21")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets22")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets23")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets24")?.includes(message.channel.id) &&
          !client.setups.get("TICKETS", "applytickets25")?.includes(message.channel.id) 
        ) return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["close"]["variable2"])})
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
              try{ client.settings.remove(message.guild.id, r, `cmdadminroles.ticket`) }catch{ }
              try{ client.settings.remove(message.guild.id, r, `cmdadminroles.close`) }catch{ }
            }
          }
        }
      let Ticketdata = client.setups.get(message.channel.id, "ticketdata");
      let ticketSystemNumber = String(Ticketdata.type).split("-");
      ticketSystemNumber = ticketSystemNumber[ticketSystemNumber.length - 1];
      let ticket = client.setups.get(message.guild.id, `${String(Ticketdata.type).includes("menu") ? "menu": ""}ticketsystem${ticketSystemNumber}`)
      
      if (([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => cmdroles.includes(r.id))) && !cmdroles.includes(message.author.id) && ([...message.member.roles.cache.values()] && !message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) && !Array(message.guild.ownerId, config.ownerid).includes(message.author.id) && !message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) && !message.member.roles.cache.some(r => ticket.adminroles.includes(r ? r.id : r)))
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

/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github?.com/Tomato6966/Discord-Js-Handler-Template
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
