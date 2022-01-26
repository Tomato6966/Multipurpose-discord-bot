const config = require(`${process.cwd()}/botconfig/config.json`);
const ms = require(`ms`);
var ee = require(`${process.cwd()}/botconfig/embed.json`)
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  MessageEmbed,
  Permissions, MessageSelectMenu, MessageButton, MessageActionRow
} = require(`discord.js`)
const {
  databasing, GetUser
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: `manageinvites`,
  category: `🚫 Administration`,
  cooldown: 4,
  usage: `manageinvites @USER --> Follow the Steps`,
  description: `Manages the Invites of a User`,
  memberpermissions: ["ADMINISTRATOR"],
  type: "member",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      var user;
      if(args[0]){
        try{
          user = await GetUser(message, args);
        }catch (e){
          if(!e) return message.reply({content : client.la[ls].common.usernotfound})
          return message.reply({content : e})
        }
      }else{
        user = message.author;
      }
      if(!user || user == null || user.id == null || !user.id) return message.reply({content : client.la[ls].common.usernotfound})
      
      let menuoptions = [
        {
          value: "Add Joins",
          description: "Add a specific Number of Joins to: " + user.username,
          replymsg: "Please Send the Number of Invites (Joins) you want to add to him/her!",
          emoji: "866356465299488809" //optional
        },
        {
          value: "Remove Joins",
          description: "Remove a specific Number of Joins to: " + user.username,
          replymsg: "Please Send the Number of Invites (Joins) you want to remove to him/her!",
          emoji: "866356465299488809" //optional
        },
        {
          value: "Add Fakes",
          description: "Add a specific Number of Fakes to: " + user.username,
          replymsg: "Please Send the Number of Fake-Invites you want to add to him/her!",
          emoji: "833101993668771842" //optional
        },
        {
          value: "Remove Fakes",
          description: "Remove a specific Number of Fakes to: " + user.username,
          replymsg: "Please Send the Number of Fake-Invites you want to remove to him/her!",
          emoji: "833101993668771842" //optional
        },
        {
          value: "Add Leaves",
          description: "Add a specific Number of Leaves to: " + user.username,
          replymsg: "Please Send the Number of Leaves you want to add to him/her!",
          emoji: "866356598356049930" //optional
        },
        {
          value: "Remove Leaves",
          description: "Remove a specific Number of Leaves to: " + user.username,
          replymsg: "Please Send the Number of Leaves you want to remove to him/her!",
          emoji: "866356598356049930" //optional
        },
        {
          value: "Cancel",
          description: `Cancel and stop the Ticket-Setup!`,
          emoji: "862306766338523166"
        }
      ]
      //define the selection
      let Selection = new MessageSelectMenu()
        .setCustomId('MenuSelection') 
        .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
        .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
        .setPlaceholder(client.la[ls].cmds.info.botfaq.placeholder)  //message in the content placeholder
        .addOptions(
          menuoptions.map(option => {
            let Obj = {
              label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
              value: option.value.substring(0, 50),
              description: option.description.substring(0, 50),
            }
          if(option.emoji) Obj.emoji = option.emoji;
          return Obj;
         }))
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
      let memberData = client.invitesdb?.get(message.guild.id + user.id)
      let {
        invites,
        fake,
        leaves
      } = memberData;
      let realinvites = invites - fake - leaves;
      //define the embed
      let MenuEmbed = new MessageEmbed()
      .setColor(es.color)
      .setAuthor(eval(client.la[ls]["cmds"]["administration"]["manageinvites"]["variable1"]))
      .setDescription(eval(client.la[ls]["cmds"]["administration"]["manageinvites"]["variable2"]))
      .addField("**CURRENT INVITES:**", `<:Like:857334024087011378> ${user} _**has invited __${realinvites} Member${realinvites != 1 ? "s": ""}__**_!`)
      .addField(eval(client.la[ls]["cmds"]["administration"]["manageinvites"]["variablex_3"]), eval(client.la[ls]["cmds"]["administration"]["manageinvites"]["variable3"]))
      //send the menu msg
      let menumsg = await message.reply({embeds : [MenuEmbed], components : [new MessageActionRow().addComponents(Selection)]})
      //function to handle the menuselection
      async function menuselection(menu) {
        let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0]);
        let index = menuoptions.findIndex(v=>v.value == menu?.values[0]);
        if(menu?.values[0] == "Cancel") return menu?.reply({content : eval(client.la[ls]["cmds"]["administration"]["manageinvites"]["variable4"])})
        await menu?.reply({embeds : [new MessageEmbed()
          .setColor(es.color)
          .setAuthor(client.la[ls].cmds.info.botfaq.menuembed.title, client.user.displayAvatarURL(), "https://discord.gg/milrato")
          .setDescription(menuoptiondata.replymsg)]})
          await message.channel.awaitMessages({filter: m=>m.author.id == cmduser.id, max: 1, time: 60e3, errors: ["time"]}).then(collected=>{
          let AddNumber = collected.first().content;
          if(isNaN(AddNumber)){
            return message.reply({content : eval(client.la[ls]["cmds"]["administration"]["manageinvites"]["variable5"])});
          }
          if(AddNumber < 0) AddNumber *= 1;
          switch(index){
            //add joins
            case 0:{
              client.invitesdb?.math(message.guild.id + user.id, "+", Number(AddNumber), "invites")
            }break;
            //remove joins
            case 1:{ 
              client.invitesdb?.math(message.guild.id + user.id, "-", Number(AddNumber), "invites")
            }break;
            //add fakes
            case 2:{
              client.invitesdb?.math(message.guild.id + user.id, "+", Number(AddNumber), "fake")
            }break;
            //remove fakes
            case 3:{
              client.invitesdb?.math(message.guild.id + user.id, "-", Number(AddNumber), "fake")
            }break;
            //add leaves
            case 4:{
              client.invitesdb?.math(message.guild.id + user.id, "+", Number(AddNumber), "leaves")
            }break;
            //remove leaves
            case 5:{
              client.invitesdb?.math(message.guild.id + user.id, "-", Number(AddNumber), "leaves")
            }break;
          }
          memberData = client.invitesdb?.get(message.guild.id + user.id)
          let {
            invites,
            fake,
            leaves
          } = memberData;
          realinvites = invites - fake - leaves;
          message.reply({embeds : [new MessageEmbed()
            .setAuthor(`New Invites of: ${user.tag}`, user.displayAvatarURL({dynamic: true}), "https://discord.gg/milrato")
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .addField("\u200b", `<:Like:857334024087011378> ${user} _**has invited __${realinvites} Member${realinvites != 1 ? "s": ""}__**_!`)
            .addField(eval(client.la[ls]["cmds"]["administration"]["manageinvites"]["variablex_6"]),eval(client.la[ls]["cmds"]["administration"]["manageinvites"]["variable6"]))
            .setFooter(client.getFooter(es))
          ]});
        })
      }
      //Event
      client.on('interactionCreate',  (menu) => {
        if (menu?.message.id === menumsg.id) {
          if (menu?.user.id === cmduser.id) menuselection(menu);
          else menu?.reply({content : handlemsg(client.la[ls].cmds.info.botfaq.notallowed, {cmduserid: cmduser.id}), ephemeral : true});
        }
      });




      if (client.settings.get(message.guild.id, `adminlog`) != "no") {
        try {
          var channel = message.guild.channels.cache.get(client.settings.get(message.guild.id, `adminlog`))
          if (!channel) return client.settings.set(message.guild.id, "no", `adminlog`);
          channel.send({embeds: [new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
            .setAuthor(`${require("path").parse(__filename).name} | ${message.author.tag}`, message.author.displayAvatarURL({
              dynamic: true
            }))
            .setDescription(eval(client.la[ls]["cmds"]["administration"]["manageinvites"]["variable7"]))
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
        .setDescription(eval(client.la[ls]["cmds"]["administration"]["manageinvites"]["variable10"]))
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