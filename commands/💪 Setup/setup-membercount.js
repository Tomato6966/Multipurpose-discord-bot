var {
  MessageEmbed, MessageSelectMenu, MessageActionRow
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: "setup-membercount",
  category: "💪 Setup",
  aliases: ["setupmembercount", "membercount-setup", "membercountsetup", "setup-membercounter", "setupmembercounter"],
  cooldown: 5,
  usage: "setup-membercount  -->  Follow the Steps",
  description: "This Setup allows you to specify a Channel which Name should be renamed every 10 Minutes to a Member Counter of Bots, Users, or Members",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    //ensure the database
    let ensureobject = { }
    for(let i = 1; i <= 25; i++){
      ensureobject[`channel${i}`] = "no";
      ensureobject[`message${i}`] = "🗣 Members: {member}";
    }
    client.setups.ensure(message.guild.id,ensureobject,"membercount");
    try {

      let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      first_layer()
      async function first_layer(){
        
        let menuoptions = [ ]
        for(let i = 1; i <= 25; i++){
          menuoptions.push({
            value: `${i} Member Counter`,
            description: `Manage/Edit the ${i}. Member Counter`,
            emoji: NumberEmojiIds[i]
          })
        }
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Member Counter!') 
          .addOptions(
          menuoptions.map(option => {
            let Obj = {
              label: option.label ? option.label.substr(0, 50) : option.value.substr(0, 50),
              value: option.value.substr(0, 50),
              description: option.description.substr(0, 50),
            }
          if(option.emoji) Obj.emoji = option.emoji;
          return Obj;
         }))
        
        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
        .setColor(es.color)
        .setAuthor('Member Counter Setup', 'https://cdn.discordapp.com/emojis/891040423605321778.png?size=96', 'https://discord.gg/milrato')
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        let used1 = false;
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
        //function to handle the menuselection
        function menuselection(menu) {
          let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
          if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
          menu?.deferUpdate();
          let SetupNumber = menu?.values[0].split(" ")[0]
          used1 = true;
          second_layer(SetupNumber, menuoptiondata)
        }
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({ 
          filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
            if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menuselection(menu)
          }
          else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
        });
      }
      async function second_layer(SetupNumber, menuoptiondata){
        
        var tempmsg = await message.reply ({embeds: [new Discord.MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable6"]))
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable7"])).setFooter(client.getFooter(es))]
          })
          await tempmsg.channel.awaitMessages({filter: m => m.author.id == cmduser.id, 
            max: 1,
            time: 90000,
            errors: ["time"]
          })
          .then(async collected => {
            var message = collected.first();
            if(!message) return message.reply( "NO MESSAGE SENT")
            let channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content);
            if(channel){
              var settts = client.setups.get(message.guild.id, `membercount`);
              let name = client.setups.get(message.guild.id, channel.id, `membercount.message${SetupNumber}`)
              let curmessage = name || channel.name;
              client.setups.set(message.guild.id, channel.id, `membercount.channel${SetupNumber}`)
              let temptype = SetupNumber;
              message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable8"]))
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setDescription(`Current Name: \`${curmessage}\``.substr(0, 2048))
                .setFooter(client.getFooter(es))
              ]});
              
  
              tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable9"]))
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setDescription(`Current Name: \`${curmessage}\`

*Send the Name NOW!, mind that the Name must be shorter then 32 Characters!!!*`)
.addField(`**USER KEYWORDS** (USERS __including__ Bots):`, `> \`{user}\` / \`{users}\` will be replaced with the amount of all users, no matter if bot or not

> \`{online}\` will be replaced with the amount of **ONLINE** USERS  
> \`{idle}\` will be replaced with the amount of **IDLE** USERS  
> \`{dnd}\` will be replaced with the amount of **DND** USERS 
> \`{offline}\` will be replaced with the amount of **OFFLINE** USERS 
> \`{allonline}\` will be replaced with the amount of **ONLINE**+**IDLE**+**DND** USERS  `)
.addField(`**MEMBER KEYWORDS** (Members __without__ Bots):`, `> \`{member}\` / \`{members}\` will be replaced with the amount of all Members (Humans)

> \`{onlinemember}\` will be replaced with the amount of **ONLINE** MEMBERS  
> \`{idlemember}\` will be replaced with the amount of **IDLE** MEMBERS  
> \`{dndmember}\` will be replaced with the amount of **DND** MEMBERS 
> \`{offlinemember}\` will be replaced with the amount of **OFFLINE** MEMBERS 
> \`{allonlinemember}\` will be replaced with the amount of **ONLINE**+**IDLE**+**DND** MEMBERS (no Bots)  `)
.addField(`**OTHER KEYWORDS:**`, `> \`{bot}\` / \`{bots}\` will be replaced with the amount of all bots
> \`{channel}\` / \`{channels}\` will be replaced with the amount of all Channels
> \`{text}\` / \`{texts}\` will be replaced with the amount of Text Channels
> \`{voice}\` / \`{voices}\` will be replaced with the amount of Voice Channels
> \`{stage}\` / \`{stages}\` will be replaced with the amount of Stage Channels
> \`{thread}\` / \`{threads}\` will be replaced with the amount of Threads
> \`{news}\` will be replaced with the amount of News Channels
> \`{category}\` / \`{parent}\` will be replaced with the amount of Categories / Parents
> \`{openthread}\` / \`{openthreads}\` will be replaced with the amount of open Threads
> \`{archivedthread}\` / \`{archivedthreads}\` will be replaced with the amount of archived Threads

> \`{role}\` / \`{roles}\` will be replaced with the amount of Roles`)
.addField(`**Examples:**`, `> \`🗣 Members: {members}\`
> \`🗣 Roles: {roles}\`
> \`🗣 Channels: {channels}\`
> \`🗣 Bots: {bots} \`
> \`🗣 All Users: {users}\``)
.setFooter(client.getFooter(es))]
                })
                await tempmsg.channel.awaitMessages({filter: m => m.author.id == cmduser.id, 
                  max: 1,
                  time: 90000,
                  errors: ["time"]
                })
                .then(async collected => {
                  var message = collected.first();
                  if(!message) throw "NO MESSAGE SENT";
                  let name = message.content;
                  if(name && name.length <= 32){
                    let guild = message.guild;
                    client.setups.set(message.guild.id, name, `membercount.message${SetupNumber}`)
                    channel.setName(String(name)
            
                    .replace(/{user}/i, guild.memberCount)
                    .replace(/{users}/i,  guild.memberCount)
          
                    .replace(/{member}/i, guild.members.cache.filter(member => !member.user.bot).size)
                    .replace(/{members}/i, guild.members.cache.filter(member => !member.user.bot).size)
          
                    .replace(/{bots}/i, guild.members.cache.filter(member => member.user.bot).size)
                    .replace(/{bot}/i, guild.members.cache.filter(member => member.user.bot).size)
          
                    .replace(/{online}/i, guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence.status == "online").size)
                    .replace(/{offline}/i, guild.members.cache.filter(member => !!member.user.bot && member.presence).size)
                    .replace(/{idle}/i, guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence.status == "idle").size)
                    .replace(/{dnd}/i, guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence.status == "dnd").size)
                    .replace(/{allonline}/i, guild.members.cache.filter(member => !member.user.bot && member.presence).size)
          
                    .replace(/{onlinemember}/i, guild.members.cache.filter(member => member.user.bot && member.presence && member.presence.status == "online").size)
                    .replace(/{offlinemember}/i, guild.members.cache.filter(member => !member.presence).size)
                    .replace(/{idlemember}/i, guild.members.cache.filter(member => member.presence && member.presence.status == "idle").size)
                    .replace(/{dndmember}/i, guild.members.cache.filter(member => member.presence && member.presence.status == "dnd").size)
                    .replace(/{allonlinemember}/i, guild.members.cache.filter(member => member.presence).size)
          
                    .replace(/{role}/i, guild.roles.cache.size)
                    .replace(/{roles}/i, guild.roles.cache.size)
          
                    .replace(/{channel}/i, guild.channels.cache.size)
                    .replace(/{channels}/i, guild.channels.cache.size)
          
                    .replace(/{text}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_TEXT").size)
                    .replace(/{voice}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_VOICE").size)
                    .replace(/{stage}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_STAGE_VOICE").size)
                    .replace(/{thread}/i, guild.channels.cache.filter(ch=>ch.type == "THREAD").size)
                    .replace(/{news}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_NEWS").size)
                    .replace(/{category}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_CATEGORY").size)
                    .replace(/{openthread}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && !ch.archived).size)
                    .replace(/{archivedthread}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && ch.archived).size)
          
                    .replace(/{texts}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_TEXT").size)
                    .replace(/{voices}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_VOICE").size)
                    .replace(/{stages}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_STAGE_VOICE").size)
                    .replace(/{threads}/i, guild.channels.cache.filter(ch=>ch.type == "THREAD").size)
                    .replace(/{parent}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_CATEGORY").size)
                    .replace(/{openthreads}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && !ch.archived).size)
                    .replace(/{archivedthreads}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && ch.archived).size)
                    )
                    return message.reply({embeds: [new Discord.MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable10"]))
                      .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                      .setDescription(`Example: \`${String(name)
            
                        .replace(/{user}/i, guild.memberCount)
                        .replace(/{users}/i,  guild.memberCount)
              
                        .replace(/{member}/i, guild.members.cache.filter(member => !member.user.bot).size)
                        .replace(/{members}/i, guild.members.cache.filter(member => !member.user.bot).size)
              
                        .replace(/{bots}/i, guild.members.cache.filter(member => member.user.bot).size)
                        .replace(/{bot}/i, guild.members.cache.filter(member => member.user.bot).size)
              
                        .replace(/{online}/i, guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence.status == "online").size)
                        .replace(/{offline}/i, guild.members.cache.filter(member => !!member.user.bot && member.presence).size)
                        .replace(/{idle}/i, guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence.status == "idle").size)
                        .replace(/{dnd}/i, guild.members.cache.filter(member => !member.user.bot && member.presence && member.presence.status == "dnd").size)
                        .replace(/{allonline}/i, guild.members.cache.filter(member => !member.user.bot && member.presence).size)
              
                        .replace(/{onlinemember}/i, guild.members.cache.filter(member => member.user.bot && member.presence && member.presence.status == "online").size)
                        .replace(/{offlinemember}/i, guild.members.cache.filter(member => !member.presence).size)
                        .replace(/{idlemember}/i, guild.members.cache.filter(member => member.presence && member.presence.status == "idle").size)
                        .replace(/{dndmember}/i, guild.members.cache.filter(member => member.presence && member.presence.status == "dnd").size)
                        .replace(/{allonlinemember}/i, guild.members.cache.filter(member => member.presence).size)
              
                        .replace(/{role}/i, guild.roles.cache.size)
                        .replace(/{roles}/i, guild.roles.cache.size)
              
                        .replace(/{channel}/i, guild.channels.cache.size)
                        .replace(/{channels}/i, guild.channels.cache.size)
              
                        .replace(/{text}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_TEXT").size)
                        .replace(/{voice}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_VOICE").size)
                        .replace(/{stage}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_STAGE_VOICE").size)
                        .replace(/{thread}/i, guild.channels.cache.filter(ch=>ch.type == "THREAD").size)
                        .replace(/{news}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_NEWS").size)
                        .replace(/{category}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_CATEGORY").size)
                        .replace(/{openthread}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && !ch.archived).size)
                        .replace(/{archivedthread}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && ch.archived).size)
              
                        .replace(/{texts}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_TEXT").size)
                        .replace(/{voices}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_VOICE").size)
                        .replace(/{stages}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_STAGE_VOICE").size)
                        .replace(/{threads}/i, guild.channels.cache.filter(ch=>ch.type == "THREAD").size)
                        .replace(/{parent}/i, guild.channels.cache.filter(ch=>ch.type == "GUILD_CATEGORY").size)
                        .replace(/{openthreads}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && !ch.archived).size)
                        .replace(/{archivedthreads}/i, guild.channels.cache.filter(ch=>ch.isThread() && !ch.deleted && ch.archived).size)}\`
                        
**Checking all Channels every 60 Minutes:**
> **Delay between each channel:** \`5.1 Minutes\` (Only if a Change is needed)
> **Optimal Member-Count Channels:** \`6 or less\``.substr(0, 2048))
                      .setFooter(client.getFooter(es))
                    ]});
                  }
                  else{
                    message.reply( "No Name added, or the Name is too long!")
                  }
                })
                .catch(e => {
                  console.log(String(e).grey)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable11"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                    .setFooter(client.getFooter(es))
                  ]});
                })
            }
            else{
              message.reply("NO CHANNEL PINGED / NO ID ADDED");
            }
          })
          .catch(e => {
            console.log(e.stack ? String(e.stack).grey : String(e).grey)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable12"]))
              .setColor(es.wrongcolor)
              .setDescription(`Cancelled the Operation!`.substr(0, 2000))
              .setFooter(client.getFooter(es))
            ]});
          })
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-membercount"]["variable15"]))
        .setDescription(`\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\``)
      ]});
    }
  },
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github?.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
function getNumberEmojis() {
  return [
    "<:Number_0:843943149915078696>",
    "<:Number_1:843943149902626846>",
    "<:Number_2:843943149868023808>",
    "<:Number_3:843943149914554388>",
    "<:Number_4:843943149919535154>",
    "<:Number_5:843943149759889439>",
    "<:Number_6:843943150468857876>",
    "<:Number_7:843943150179713024>",
    "<:Number_8:843943150360068137>",
    "<:Number_9:843943150443036672>",
    "<:Number_10:843943150594031626>",
    "<:Number_11:893173642022748230>",
    "<:Number_12:893173642165383218>",
    "<:Number_13:893173642274410496>",
    "<:Number_14:893173642198921296>",
    "<:Number_15:893173642182139914>",
    "<:Number_16:893173642530271342>",
    "<:Number_17:893173642538647612>",
    "<:Number_18:893173642307977258>",
    "<:Number_19:893173642588991488>",
    "<:Number_20:893173642307977266>",
    "<:Number_21:893173642274430977>",
    "<:Number_22:893173642702250045>",
    "<:Number_23:893173642454773782>",
    "<:Number_24:893173642744201226>",
    "<:Number_25:893173642727424020>"
  ]
}