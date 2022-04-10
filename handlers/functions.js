const Discord = require("discord.js");
const {
  Client,
  Collection,
  MessageEmbed,
  MessageAttachment, Permissions, MessageButton, MessageActionRow, MessageSelectMenu
} = require("discord.js");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const radios = require("../botconfig/radiostations.json");
const ms = require("ms")
const moment = require("moment")
const fs = require('fs')


module.exports = {
  create_transcript_buffer,
  handlemsg,
  ensure_economy_user,
  nFormatter,
  create_transcript,
  databasing,
  simple_databasing,
  reset_DB,
  change_status,
  check_voice_channels,
  check_created_voice_channels,
  create_join_to_create_Channel,
  getMember,
  shuffle,
  formatDate,
  delay,
  getRandomInt,
  duration,
  getRandomNum,
  createBar,
  format,
  stations,
  swap_pages,
  swap_pages2,
  swap_pages2_interaction,
  escapeRegex,
  autoplay,
  arrayMove,
  edit_Roster_msg,
  send_roster_msg,
  isValidURL,
  GetUser,
  GetRole,
  GetGlobalUser,
  parseMilliseconds,
  isEqual,
  check_if_dj,
  dbEnsure
}
function check_if_dj(client, member, song) {
  //if no message added return
  if(!client) return false;
  var roleid = client.settings.get(member.guild.id, `djroles`)
  if (String(roleid) == "") return false;
  var isdj = false;
  for(const djRole of roleid){
    if (!member.guild.roles.cache.get(djRole)) {
      client.settings.remove(member.guild.id, djRole, `djroles`)
      continue;
    }
    if (member.roles.cache.has(djRole)) isdj = true;
  }
  if (!isdj && !member.permissions.has("ADMINISTRATOR") && song?.requester?.id != member.id)
      return roleid.map(i=>`<@&${i}>`).join(", ");
  else
      return false;
}

function handlemsg(txt, options) {
  let text = String(txt);
  for(const option in options){ 
    var toreplace = new RegExp(`{${option.toLowerCase()}}`,"ig");
    text = text.replace(toreplace, options[option]);
  }
  return text;
}
function isEqual(value, other){
  const type = Object.prototype.toString.call(value);
  if (type !== Object.prototype.toString.call(other)) return false;
  if (["[object Array]", "[object Object]"].indexOf(type) < 0) return false;
  const valueLen = type === "[object Array]" ? value.length : Object.keys(value).length;
  const otherLen = type === "[object Array]" ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;
  const compare = (item1, item2) => {
      const itemType = Object.prototype.toString.call(item1);
      if (["[object Array]", "[object Object]"].indexOf(itemType) >= 0) {
          if (!isEqual(item1, item2)) return false;
      }
      else {
          if (itemType !== Object.prototype.toString.call(item2)) return false;
          if (itemType === "[object Function]") {
              if (item1.toString() !== item2.toString()) return false;
          } else {
              if (item1 !== item2) return false;
          }
      }
  };
  if (type === "[object Array]") {
      for (var i = 0; i < valueLen; i++) {
          if (compare(value[i], other[i]) === false) return false;
      }
  } else {
      for (var key in value) {
          if (Object.prototype.hasOwnProperty.call(value, key)) {
              if (compare(value[key], other[key]) === false) return false;
          }
      }
  }
  return true;
}
function parseMilliseconds(milliseconds) {
	if (typeof milliseconds !== 'number') {
		throw new TypeError('Expected a number');
	}

	return {
		days: Math.trunc(milliseconds / 86400000),
		hours: Math.trunc(milliseconds / 3600000) % 24,
		minutes: Math.trunc(milliseconds / 60000) % 60,
		seconds: Math.trunc(milliseconds / 1000) % 60,
		milliseconds: Math.trunc(milliseconds) % 1000,
		microseconds: Math.trunc(milliseconds * 1000) % 1000,
		nanoseconds: Math.trunc(milliseconds * 1e6) % 1000
	};
}

function isValidURL(string) {
  const args = string.split(" ");
  let url;
  for(const arg of args){
    try {
      url = new URL(arg);
      url = url.protocol === "http:" || url.protocol === "https:";
      break;
    } catch (_) {
      url = false;
    }
  }
  return url;
};
function GetUser(message, arg){
  var errormessage = "<:no:833101993668771842> I failed finding that User...";
  return new Promise(async (resolve, reject) => {
    var args = arg, client = message.client;
    if(!client || !message) return reject("CLIENT IS NOT DEFINED")
    if(!args || args == null || args == undefined) args = message.content.trim().split(/ +/).slice(1);
    let user = message.mentions.users.first();
    if(!user && args[0] && args[0].length == 18) {
      user = await client.users.fetch(args[0]).catch((e)=>{
        return reject(errormessage);
      })
      if(!user) return reject(errormessage)
      return resolve(user);
    }
    /**
     * @INFO
     * Bot Coded by Tomato#6966 | https://discord.gg/milrato
     * @INFO
     * Work for Milrato Development | https://milrato.eu
     * @INFO
     * Please mention him / Milrato Development, when using this Code!
     * @INFO
     */
    
    else if(!user && args[0]){
      let alluser = message.guild.members.cache.map(member=> String(member.user.tag).toLowerCase())
      user = alluser.find(user => user.startsWith(args.join(" ").toLowerCase()))
      user = message.guild.members.cache.find(me => String(me.user.tag).toLowerCase() == user)
      if(!user || user == null || !user.id) {
        alluser = message.guild.members.cache.map(member => String(member.displayName + "#" + member.user.discriminator).toLowerCase())
        user = alluser.find(user => user.startsWith(args.join(" ").toLowerCase()))
        user = message.guild.members.cache.find(me => String(me.displayName + "#" + me.user.discriminator).toLowerCase() == user)
        if(!user || user == null || !user.id) return reject(errormessage)
      }
      user = await client.users.fetch(user.user.id).catch(() => {})
      if(!user) return reject(errormessage)
      return resolve(user);
    }
    else {
      user = message.mentions.users.first() || message.author;
      return resolve(user);
    }
  })
}
function GetRole(message, arg){
  var errormessage = "<:no:833101993668771842> I failed finding that Role...";
  return new Promise(async (resolve, reject) => {
    var args = arg, client = message.client;
    if(!client || !message) return reject("CLIENT IS NOT DEFINED")
    if(!args || args == null || args == undefined) args = message.content.trim().split(/ +/).slice(1);
    let user = message.mentions.roles.filter(role=>role.guild.id==message.guild.id).first();
    if(!user && args[0] && args[0].length == 18) {
      user = message.guild.roles.cache.get(args[0])
      if(!user) return reject(errormessage)
      return resolve(user);
    }
    else if(!user && args[0]){
      let alluser = message.guild.roles.cache.map(role => String(role.name).toLowerCase())
      user = alluser.find(r => r.split(" ").join("").includes(args.join("").toLowerCase()))
      user = message.guild.roles.cache.find(role => String(role.name).toLowerCase() === user)
      if(!user) return reject(errormessage)
      return resolve(user);
    }
    else {
      user = message.mentions.roles.filter(role=>role.guild.id==message.guild.id).first();
      if(!user) return reject(errormessage)
      return resolve(user);
    }
  })
}
function GetGlobalUser(message, arg){
  var errormessage = "<:no:833101993668771842> I failed finding that User...";
  return new Promise(async (resolve, reject) => {
    var args = arg, client = message.client;
    if(!client || !message) return reject("CLIENT IS NOT DEFINED")
    if(!args || args == null || args == undefined) args = message.content.trim().split(/ +/).slice(1);
    let user = message.mentions.users.first();
    if(!user && args[0] && args[0].length == 18) {
      user = await client.users.fetch(args[0]).catch(() => {})
      if(!user) return reject(errormessage)
      return resolve(user);
    }
    else if(!user && args[0]){
      let alluser = [], allmembers = [];
      var guilds = [...client.guilds.cache.values()];
      for(const g of guilds){
        var members = g.members.cache.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966);
        for(const m of members) { alluser.push(m.user.tag); allmembers.push(m); }
      }
      user = alluser.find(user => user.startsWith(args.join(" ").toLowerCase()))
      user = allmembers.find(me => String(me.user.tag).toLowerCase() == user)
      if(!user || user == null || !user.id) {
        user = alluser.find(user => user.startsWith(args.join(" ").toLowerCase()))
        user = allmembers.find(me => String(me.displayName + "#" + me.user.discriminator).toLowerCase() == user)
        if(!user || user == null || !user.id) return reject(errormessage)
      }
      user = await client.users.fetch(user.user.id).catch(() => {})
      if(!user) return reject(errormessage)
      return resolve(user);
    }
    else {
      user = message.mentions.users.first() || message.author;
      return resolve(user);
    }
  })
}


/**
 * function edit_Roster_msg
 * @param {*} client | The Discord Bot Client
 * @param {*} guild | The Guild to edit the Message at
 * @param {*} the_roster_db | the Database of the Roster
 * @returns true / false + edits the message
 */
async function edit_Roster_msg(client, guild, the_roster_db, pre) {
  try{
    //fetch all guild members
    await guild.members.fetch().catch(() => {});
    //get the roster data
    var data = the_roster_db?.get(guild.id, pre)
    //get the EMBED SETTINGS
    let es = client.settings.get(guild.id, "embed")
    let ls = client.settings.get(guild.id, "language")
    //if the rosterchannel is not valid, then send error + return
    if (data.rosterchannel == "notvalid")
      return //console.log("Roster Channel not valid | :: | " + data.rosterchannel);
    //get the channel from the guild
    let channel = guild.channels.cache.get(data.rosterchannel)
    //get the channel from the client if not found from the guild
    if (!channel) 
      channel = client.channels.cache.get(data.rosterchannel);
    //if the rosterchannel is not found, then send error + return
    if (!channel) 
      return //console.log("Roster Channel not found | :: | " + data.rosterchannel);
    //if the defined message length is less then 2 try return error (not setupped)
    if(data.rostermessage.length < 5) 
      return //console.log("Roster Message not valid | :: | " + data.rostermessage);
    //fetch the message from the channel
    let message = channel.messages.cache.get(data.rostermessage) || await channel.messages.fetch(data.rostermessage).catch(() => {}) || false;
    //if the message is undefined, then send the message ;)
    if (!message || message == null || !message.id || message.id == null) return send_roster(client, guild);
    //define a variable for the total break of the loop later
    let totalbreak = false;
    //define the embed
    let rosterembed = new Discord.MessageEmbed()
      .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es))
      .setTitle(String(data.rostertitle).substring(0, 256))
    //get rosterole and loop through every single role
    let rosterroles = data.rosterroles;
    //if there are no roles added add this to the embed
    if (rosterroles.length === 0) 
      rosterembed.addField(eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variablex_2"]), eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variable2"]))
    //loop through every single role
    for (let j = 0; j < rosterroles.length; j++) {  
      //get the role
      let role = await guild.roles.fetch(rosterroles[j]).catch(() => {})
      //if no valid role skip
      if(!role || role == undefined || !role.members || role.members == undefined) continue;  
      //if the embed is too big break
      if (rosterembed.length > 5900) break;
      //get the maximum field value length on an variabel
      let leftnum = 1024;
      //if the length is bigger then the maximum length - the leftnumber
      if (rosterembed.length > 6000 - leftnum) {
        //set the left number to the maximumlength - the leftnumber
        leftnum = rosterembed.length - leftnum - 100;
      }
      
      //try to send the roster with the right style..
      if (data.rosterstyle == "1") {
        //define the memberarray
        let memberarray = role.members.map(member => `${the_roster_db?.get(guild.id, pre+".rosteremoji")} <@${member.user.id}> | \`${member.user.tag}\``)
        //loopthrough the array for 20 members / page
        for (let i = 0; i < memberarray.length; i += 20) {
          var thearray = memberarray;
          if (rosterembed.length > 5000) break;
          if (!the_roster_db?.get(guild.id, pre+".showallroles") || memberarray.length < 20)
            try { 
              rosterembed.addField(`**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length}]__**`, role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024) + `${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length - 20 > 0 ? `\n${the_roster_db?.get(guild.id, pre+".rosteremoji")} ***\`${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length - 20}\` other Members have this Role ...***`: ""}`.substring(0, 1024), the_roster_db?.get(guild.id, pre+".inline"))
              break;
            } catch (e) {
              console.error(e)
            }
          else
            try {
              rosterembed.addField(i < 20 ? `**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length}]__**` : `\u200b`, role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024), the_roster_db?.get(guild.id, pre+".inline"))
            } catch (e) {
              console.error(e)
            }
        }
        //if there are no members who have this role, do this
        if(memberarray.length === 0){
          try {
            rosterembed.addField(`**__${role.name.toUpperCase()} [0]__**`, "> ***No one has this Role***".substring(0, 1024), the_roster_db?.get(guild.id, pre+".inline"))
          } catch (e) {
            console.error(e)
          }
        }
      } else if (data.rosterstyle == "2") {
        //define the memberarray
        let memberarray = role.members.map(member => `${the_roster_db?.get(guild.id, pre+".rosteremoji")} <@${member.user.id}>`)
        //loopthrough the array for 20 members / page
        for (let i = 0; i < memberarray.length; i += 20) {
          var thearray = memberarray;
          if (rosterembed.length > 5000) break;
          if (!the_roster_db?.get(guild.id, pre+".showallroles") || memberarray.length < 20)
            try {
              rosterembed.addField(`**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length}]__**`, role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024)+ `${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length - 20 > 0 ? `\n${the_roster_db?.get(guild.id, pre+".rosteremoji")} ***\`${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length - 20}\` other Members have this Role ...***`: ""}`.substring(0, 1024), the_roster_db?.get(guild.id, pre+".inline"))
              break;
            } catch (e) {
              console.error(e)
            }
          else
            try {
              rosterembed.addField(i < 20 ? `**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length}]__**` : `\u200b`, role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024), the_roster_db?.get(guild.id, pre+".inline"))
            } catch (e) {
              console.error(e)
            }
        }
        //if there are no members who have this role, do this
        if(memberarray.length === 0){
          try {
            rosterembed.addField(`**__${role.name.toUpperCase()} [0]__**`, "> ***No one has this Role***".substring(0, 1024), the_roster_db?.get(guild.id, pre+".inline"))
          } catch (e) {
            console.error(e)
          }
        }
      } else if (data.rosterstyle == "3") {
        //define the memberarray
        let memberarray = role.members.map(member => `${the_roster_db?.get(guild.id, pre+".rosteremoji")} **${member.user.tag}**`)
        //loopthrough the array for 20 members / page
        for (let i = 0; i < memberarray.length; i += 20) {
          var thearray = memberarray;
          if (rosterembed.length > 5000) break;
          if (!the_roster_db?.get(guild.id, pre+".showallroles") || memberarray.length < 20)
            try {
              rosterembed.addField(`**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length}]__**`, role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024)+ `${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length - 20 > 0 ? `\n${the_roster_db?.get(guild.id, pre+".rosteremoji")} ***\`${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length - 20}\` other Members have this Role ...***`: ""}`.substring(0, 1024), the_roster_db?.get(guild.id, pre+".inline"))
              break;
            } catch (e) {
              console.error(e)
            }
          else
            try {
              rosterembed.addField(i < 20 ? `**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length}]__**` : `\u200b`, role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024), the_roster_db?.get(guild.id, pre+".inline"))
            } catch (e) {
              console.error(e)
            }
        }     
        //if there are no members who have this role, do this   
        if(memberarray.length === 0){
          try {
            rosterembed.addField(`**__${role.name.toUpperCase()} [0]__**`, "> ***No one has this Role***".substring(0, 1024), the_roster_db?.get(guild.id, pre+".inline"))
          } catch (e) {
            console.error(e)
          }
        }
        /**
         * @INFO
         * Bot Coded by Tomato#6966 | https://discord.gg/milrato
         * @INFO
         * Work for Milrato Development | https://milrato.eu
         * @INFO
         * Please mention him / Milrato Development, when using this Code!
         * @INFO
         */
        
      } else if (data.rosterstyle == "4") {
        //define the memberarray
        let memberarray = role.members.map(member => `${the_roster_db?.get(guild.id, pre+".rosteremoji")} **${member.user.username}**`)
        //loopthrough the array for 20 members / page
        for (let i = 0; i < memberarray.length; i += 20) {
          var thearray = memberarray;
          if (rosterembed.length > 5000) break;
          if (!the_roster_db?.get(guild.id, pre+".showallroles") || memberarray.length < 20)
            try {
              rosterembed.addField(`**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length}]__**`, role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024)+ `${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length - 20 > 0 ? `\n${the_roster_db?.get(guild.id, pre+".rosteremoji")} ***\`${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length - 20}\` other Members have this Role ...***`: ""}`.substring(0, 1024), the_roster_db?.get(guild.id, pre+".inline"))
              break;
            } catch (e) {
              console.error(e)
            }
          else
            try {
              rosterembed.addField(i < 20 ? `**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length}]__**` : `\u200b`, role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024), the_roster_db?.get(guild.id, pre+".inline"))
            } catch (e) {
              console.error(e)
            }
        }
        //if there are no members who have this role, do this
        if(memberarray.length === 0){
          try {
            rosterembed.addField(`**__${role.name.toUpperCase()} [0]__**`, "> ***No one has this Role***".substring(0, 1024), the_roster_db?.get(guild.id, pre+".inline"))
          } catch (e) {
            console.error(e)
          }
        }
      } else if (data.rosterstyle == "5") {
        //define the memberarray
        let memberarray = role.members.map(member => `${the_roster_db?.get(guild.id, pre+".rosteremoji")} <@${member.user.id}> | \`${member.user.id}\``)
        //loopthrough the array for 20 members / page
        for (let i = 0; i < memberarray.length; i += 20) {
          var thearray = memberarray;
          if (rosterembed.length > 5000) break;
          if (!the_roster_db?.get(guild.id, pre+".showallroles") || memberarray.length < 20)
            try {
              rosterembed.addField(`**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length}]__**`, role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024)+ `${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length - 20 > 0 ? `\n${the_roster_db?.get(guild.id, pre+".rosteremoji")} ***\`${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length - 20}\` other Members have this Role ...***`: ""}`.substring(0, 1024), the_roster_db?.get(guild.id, pre+".inline"))
            } catch (e) {
              console.error(e)
            }
          else
            try {
              rosterembed.addField(i < 20 ? `**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length}]__**` : `\u200b`, role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024), the_roster_db?.get(guild.id, pre+".inline"))
            } catch (e) {
              console.error(e)
            }
        }
        //if there are no members who have this role, do this
        if(memberarray.length === 0){
          try {
            rosterembed.addField(`**__${role.name.toUpperCase()} [0]__**`, "> ***No one has this Role***".substring(0, 1024), the_roster_db?.get(guild.id, pre+".inline"))
            break;
          } catch (e) {
            console.error(e)
          }
        }
      } else if (data.rosterstyle == "6") {
        //define the memberarray
        let memberarray = role.members.map(member => `${the_roster_db?.get(guild.id, pre+".rosteremoji")} <@${member.user.id}> | **${member.user.username}**`)
        //loopthrough the array for 20 members / page
        for (let i = 0; i < memberarray.length; i += 20) {

          var thearray = memberarray;
          if (rosterembed.length > 5000) break;
          if (!thearray) return;
          if (!the_roster_db?.get(guild.id, pre+".showallroles") || memberarray.length < 20)
            try {
              rosterembed.addField(`**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length}]__**`, role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024)+ `${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length - 20 > 0 ? `\n${the_roster_db?.get(guild.id, pre+".rosteremoji")} ***\`${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length - 20}\` other Members have this Role ...***`: ""}`.substring(0, 1024), the_roster_db?.get(guild.id, pre+".inline"))
              break;
            } catch (e) {
              console.error(e)
            }
          else
            try {
              rosterembed.addField(i < 20 ? `**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length}]__**` : `\u200b`, role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024), the_roster_db?.get(guild.id, pre+".inline"))
            } catch (e) {
              console.error(e)
            }
        }
        //if there are no members who have this role, do this
        if(memberarray.length === 0){
          try {
            rosterembed.addField(`**__${role.name.toUpperCase()} [0]__**`, "> ***No one has this Role***".substring(0, 1024), the_roster_db?.get(guild.id, pre+".inline"))
          } catch (e) {
            console.error(e)
          }
        }
      } else if (data.rosterstyle == "7") {
        //define the memberarray
        let memberarray = role.members.map(member => `${the_roster_db?.get(guild.id, pre+".rosteremoji")} <@${member.user.id}> | **${member.user.tag}**`)
        //loopthrough the array for 20 members / page
        for (let i = 0; i < memberarray.length; i += 20) {
          var thearray = memberarray;
          if (rosterembed.length > 5000) break;
          if (!the_roster_db?.get(guild.id, pre+".showallroles") || memberarray.length < 20)
            try {
              rosterembed.addField(`**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length}]__**`, role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024)+ `${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length - 20 > 0 ? `\n${the_roster_db?.get(guild.id, pre+".rosteremoji")} ***\`${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length - 20}\` other Members have this Role ...***`: ""}`.substring(0, 1024), the_roster_db?.get(guild.id, pre+".inline"))
              break;
            } catch (e) {
              console.error(e)
            }
          else
            try {
              rosterembed.addField(i < 20 ? `**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length}]__**` : `\u200b`, role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024), the_roster_db?.get(guild.id, pre+".inline"))
            } catch (e) {
              console.error(e)
            }
        }
        //if there are no members who have this role, do this
        if(memberarray.length === 0){
          try {
            rosterembed.addField(`**__${role.name.toUpperCase()} [0]__**`, "> ***No one has this Role***".substring(0, 1024), the_roster_db?.get(guild.id, pre+".inline"))

          } catch (e) {
            console.error(e)
          }
        }
      } else {
        //define the memberarray
        let memberarray = role.members.map(member => `${the_roster_db?.get(guild.id, pre+".rosteremoji")} <@${member.user.id}> | \`${member.user.tag}\``)
        //loopthrough the array for 20 members / page
        for (let i = 0; i < memberarray.length; i += 20) {
          var thearray = memberarray;
          if (rosterembed.length > 5000) leftnum = 800;
          if (rosterembed.length > 5500) {
            totalbreak = true;
            break;
          }
          if (!the_roster_db?.get(guild.id, pre+".showallroles") || memberarray.length < 20)
            try {
              rosterembed.addField(`**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length}]__**`, role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024)+ `${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length - 20 > 0 ? `\n${the_roster_db?.get(guild.id, pre+".rosteremoji")} ***\`${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length - 20}\` other Members have this Role ...***`: ""}`.substring(0, 1024), the_roster_db?.get(guild.id, pre+".inline"))
              break;
            } catch (e) {
              console.error(e)
            }
          else
            try {
              rosterembed.addField(i < 20 ? `**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length}]__**` : `\u200b`, role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024), the_roster_db?.get(guild.id, pre+".inline"))
            } catch (e) {
              console.error(e)
            }
        }
        //if there are no members who have this role, do this
        if(memberarray.length === 0){
          try {
            rosterembed.addField(`**__${role.name.toUpperCase()} [0]__**`, "> ***No one has this Role***".substring(0, 1024), the_roster_db?.get(guild.id, pre+".inline"))
          } catch (e) {
            console.error(e)
          }
        }
      }

      //if a totalbreak happened, then return + edit the message
      if (totalbreak) return message.edit({embeds: [rosterembed]}).catch(e => console.log("could not edit roster 1"  + e));
    }
    //after the loop, edit the message
    message.edit({embeds: [rosterembed]}).catch(e => console.log("! Could not edit roster 1" + e));
    
  }catch (e){
    console.log("ROSTER_COULD NOT FIND THE MESSAGE".grey, e)
  }
}
async function send_roster_msg(client, guild, the_roster_db, pre) {
  //ensure the database
  const obj = { };
  obj[pre] = {
    rosterchannel: "notvalid", showallroles: false, rostermessage: "", rostertitle: "Roster",
    rosteremoji: "➤", rosterstyle: "1", rosterroles: [], inline: false,
  }
  dbEnsure(the_roster_db, guild.id, obj)
  let es = client.settings.get(guild.id, "embed")
  let ls = client.settings.get(guild.id, "language")
  if (the_roster_db?.get(guild.id, pre+".rosterchannel") == "notvalid") return;
  let channel = await client.channels.fetch(the_roster_db?.get(guild.id, pre+".rosterchannel")).catch(() => {});
  //define the embed
  let rosterembed = new Discord.MessageEmbed()
    .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
    .setTitle(String(the_roster_db?.get(guild.id, pre+".rostertitle")).substring(0, 256))
    .setFooter(client.getFooter(es))
  //get rosterole and loop through every single role
  let rosterroles = the_roster_db?.get(guild.id, pre+".rosterroles");
  if (!rosterroles || rosterroles.length === 0) try {
    rosterembed.addField(eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variablex_2"]), eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variable2"]))
  } catch (e) {
    console.error(e)
  }
  for (let i = 0; i < rosterroles.length; i++) {
    //get the role
    let role = await guild.roles.fetch(rosterroles[i]).catch(() => {})
    //if no valid role skip
    if(!role || role == undefined || !role.members || role.members == undefined) continue;  
    //if the embed is too big break
    if (rosterembed.length > 5900) break;
    //get the maximum field value length on an variabel
    let leftnum = 1024;
    //if the length is bigger then the maximum length - the leftnumber
    if (rosterembed.length > 6000 - leftnum) {
      //set the left number to the maximumlength - the leftnumber
      leftnum = rosterembed.length - leftnum - 100;
    }
    //define the memberarray
    let memberarray = role.members.map(member => `${the_roster_db?.get(guild.id, pre+".rosteremoji")} <@${member.user.id}> | \`${member.user.tag}\``)
    //loopthrough the array for 20 members / page
    for (let i = 0; i < memberarray.length; i += 20) {
      var thearray = memberarray;
      if (rosterembed.length > 5000) leftnum = 800;
      if (rosterembed.length > 5500) {
        totalbreak = true;
        break;
      }
      if (!the_roster_db?.get(guild.id, pre+".showallroles") || memberarray.length < 20)
        try {
          rosterembed.addField(`**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length}]__**`, role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024)+ `${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length - 20 > 0 ? `\n${the_roster_db?.get(guild.id, pre+".rosteremoji")} ***\`${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length - 20}\` other Members have this Role ...***`: ""}`.substring(0, 1024), the_roster_db?.get(guild.id, pre+".inline"))
          break;
        } catch (e) {
          console.error(e)
        }
      else
        try {
          rosterembed.addField(i < 20 ? `**__${role.name.toUpperCase()} [${role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length}]__**` : `\u200b`, role.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).length == 0 ? "> No one has this Role" : thearray.slice(i, i + 20).join("\n").substring(0, leftnum <= 1024 ? leftnum : 1024), the_roster_db?.get(guild.id, pre+".inline"))
        } catch (e) {
          console.error(e)
        }
    }
    //if there are no members who have this role, do this
    if(memberarray.length === 0){
      try {
        rosterembed.addField(`**__${role.name.toUpperCase()} [0]__**`, "> ***No one has this Role***".substring(0, 1024), the_roster_db?.get(guild.id, pre+".inline"))
      } catch (e) {
        console.error(e)
      }
    }
  }
  channel.send({embeds: [rosterembed]}).then(msg => {
    the_roster_db?.set(guild.id, msg.id, pre+".rostermessage");
    setTimeout(() => {
      edit_Roster_msg(client, guild, the_roster_db, pre)
    }, 500)
  }).catch(e => console.log("Couldn't send a message, give the Bot permissions or smt!"))
}

async function create_transcript_buffer(Messages, Channel, Guild){
    return new Promise(async (resolve, reject) => {
      try{
        let baseHTML = `<!DOCTYPE html>` + 
        `<html lang="en">` + 
        `<head>` + 
        `<title>${Channel.name}</title>` + 
        `<meta charset="utf-8" />` + 
        `<meta name="viewport" content="width=device-width" />` + 
        `<style>mark{background-color: #202225;color:#F3F3F3;}@font-face{font-family:Whitney;src:url(https://cdn.jsdelivr.net/gh/mahtoid/DiscordUtils@master/whitney-300.woff);font-weight:300}@font-face{font-family:Whitney;src:url(https://cdn.jsdelivr.net/gh/mahtoid/DiscordUtils@master/whitney-400.woff);font-weight:400}@font-face{font-family:Whitney;src:url(https://cdn.jsdelivr.net/gh/mahtoid/DiscordUtils@master/whitney-500.woff);font-weight:500}@font-face{font-family:Whitney;src:url(https://cdn.jsdelivr.net/gh/mahtoid/DiscordUtils@master/whitney-600.woff);font-weight:600}@font-face{font-family:Whitney;src:url(https://cdn.jsdelivr.net/gh/mahtoid/DiscordUtils@master/whitney-700.woff);font-weight:700}body{font-family:Whitney,"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:17px}a{text-decoration:none}a:hover{text-decoration:underline}img{object-fit:contain}.markdown{max-width:100%;line-height:1.3;overflow-wrap:break-word}.preserve-whitespace{white-space:pre-wrap}.spoiler{display:inline-block}.spoiler--hidden{cursor:pointer}.spoiler-text{border-radius:3px}.spoiler--hidden .spoiler-text{color:transparent}.spoiler--hidden .spoiler-text::selection{color:transparent}.spoiler-image{position:relative;overflow:hidden;border-radius:3px}.spoiler--hidden .spoiler-image{box-shadow:0 0 1px 1px rgba(0,0,0,.1)}.spoiler--hidden .spoiler-image *{filter:blur(44px)}.spoiler--hidden .spoiler-image:after{content:"SPOILER";color:#dcddde;background-color:rgba(0,0,0,.6);position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-weight:600;padding:100%;border-radius:20px;letter-spacing:.05em;font-size:.9em}.spoiler--hidden:hover .spoiler-image:after{color:#fff;background-color:rgba(0,0,0,.9)}blockquote{margin:.1em 0;padding-left:.6em;border-left:4px solid;border-radius:3px}.pre{font-family:Consolas,"Courier New",Courier,monospace}.pre--multiline{margin-top:.25em;padding:.5em;border:2px solid;border-radius:5px}.pre--inline{padding:2px;border-radius:3px;font-size:.85em}.mention{border-radius:3px;padding:0 2px;color:#dee0fc;background:rgba(88,101,242,.3);font-weight:500}.mention:hover{background:rgba(88,101,242,.6)}.emoji{width:1.25em;height:1.25em;margin:0 .06em;vertical-align:-.4em}.emoji--small{width:1em;height:1em}.emoji--large{width:2.8em;height:2.8em}.chatlog{max-width:100%}.message-group{display:grid;margin:0 .6em;padding:.9em 0;border-top:1px solid;grid-template-columns:auto 1fr}.reference-symbol{grid-column:1;border-style:solid;border-width:2px 0 0 2px;border-radius:8px 0 0 0;margin-left:16px;margin-top:8px}.attachment-icon{float:left;height:100%;margin-right:10px}.reference{display:flex;grid-column:2;margin-left:1.2em;margin-bottom:.25em;font-size:.875em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;align-items:center}.reference-av{border-radius:50%;height:16px;width:16px;margin-right:.25em}.reference-name{margin-right:.25em;font-weight:600}.reference-link{flex-grow:1;overflow:hidden;text-overflow:ellipsis}.reference-link:hover{text-decoration:none}.reference-content>*{display:inline}.reference-edited-tst{margin-left:.25em;font-size:.8em}.ath-av-container{grid-column:1;width:40px;height:40px}.ath-av{border-radius:50%;height:40px;width:40px}.messages{grid-column:2;margin-left:1.2em;min-width:50%}.messages .bot-tag{top:-.2em}.ath-name{font-weight:500}.tst{margin-left:.3em;font-size:.75em}.message{padding:.1em .3em;margin:0 -.3em;background-color:transparent;transition:background-color 1s ease}.content{font-size:.95em;word-wrap:break-word}.edited-tst{margin-left:.15em;font-size:.8em}.attachment{margin-top:.3em}.attachment-thumbnail{vertical-align:top;max-width:45vw;max-height:225px;border-radius:3px}.attachment-container{height:40px;width:100%;max-width:520px;padding:10px;border:1px solid;border-radius:3px;overflow:hidden;background-color:#2f3136;border-color:#292b2f}.attachment-icon{float:left;height:100%;margin-right:10px}.attachment-filesize{color:#72767d;font-size:12px}.attachment-filename{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.embed{display:flex;margin-top:.3em;max-width:520px}.embed-color-pill{flex-shrink:0;width:.25em;border-top-left-radius:3px;border-bottom-left-radius:3px}.embed-content-container{display:flex;flex-direction:column;padding:.5em .6em;border:1px solid;border-top-right-radius:3px;border-bottom-right-radius:3px}.embed-content{display:flex;width:100%}.embed-text{flex:1}.embed-ath{display:flex;margin-bottom:.3em;align-items:center}.embed-ath-icon{margin-right:.5em;width:20px;height:20px;border-radius:50%}.embed-ath-name{font-size:.875em;font-weight:600}.embed-title{margin-bottom:.2em;font-size:.875em;font-weight:600}.embed-description{font-weight:500;font-size:.85em}.embed-fields{display:flex;flex-wrap:wrap}.embed-field{flex:0;min-width:100%;max-width:506px;padding-top:.6em;font-size:.875em}.embed-field--inline{flex:1;flex-basis:auto;min-width:150px}.embed-field-name{margin-bottom:.2em;font-weight:600}.embed-field-value{font-weight:500}.embed-thumbnail{flex:0;margin-left:1.2em;max-width:80px;max-height:80px;border-radius:3px}.embed-image-container{margin-top:.6em}.embed-image{max-width:500px;max-height:400px;border-radius:3px}.embed-footer{margin-top:.6em}.embed-footer-icon{margin-right:.2em;width:20px;height:20px;border-radius:50%;vertical-align:middle}.embed-footer-text{display:inline;font-size:.75em;font-weight:500}.reactions{display:flex}.reaction{display:flex;align-items:center;margin:.35em .1em .1em .1em;padding:.2em .35em;border-radius:8px}.reaction-count{min-width:9px;margin-left:.35em;font-size:.875em}.bot-tag{position:relative;margin-left:.3em;margin-right:.3em;padding:.05em .3em;border-radius:3px;vertical-align:middle;line-height:1.3;background:#7289da;color:#fff;font-size:.625em;font-weight:500}.postamble{margin:1.4em .3em .6em .3em;padding:1em;border-top:1px solid}body{background-color:#36393e;color:#dcddde}a{color:#0096cf}.spoiler-text{background-color:rgba(255,255,255,.1)}.spoiler--hidden .spoiler-text{background-color:#202225}.spoiler--hidden:hover .spoiler-text{background-color:rgba(32,34,37,.8)}.quote{border-color:#4f545c}.pre{background-color:#2f3136!important}.pre--multiline{border-color:#282b30!important;color:#b9bbbe!important}.preamble__entry{color:#fff}.message-group{border-color:rgba(255,255,255,.1)}.reference-symbol{border-color:#4f545c}.reference-icon{width:20px;display:inline-block;vertical-align:bottom}.reference{color:#b5b6b8}.reference-link{color:#b5b6b8}.reference-link:hover{color:#fff}.reference-edited-tst{color:rgba(255,255,255,.2)}.ath-name{color:#fff}.tst{color:rgba(255,255,255,.2)}.message--highlighted{background-color:rgba(114,137,218,.2)!important}.message--pinned{background-color:rgba(249,168,37,.05)}.edited-tst{color:rgba(255,255,255,.2)}.embed-color-pill--default{background-color:#4f545c}.embed-content-container{background-color:rgba(46,48,54,.3);border-color:rgba(46,48,54,.6)}.embed-ath-name{color:#fff}.embed-ath-name-link{color:#fff}.embed-title{color:#fff}.embed-description{color:rgba(255,255,255,.6)}.embed-field-name{color:#fff}.embed-field-value{color:rgba(255,255,255,.6)}.embed-footer{color:rgba(255,255,255,.6)}.reaction{background-color:rgba(255,255,255,.05)}.reaction-count{color:rgba(255,255,255,.3)}.info{display:flex;max-width:100%;margin:0 5px 10px 5px}.guild-icon-container{flex:0}.guild-icon{max-width:88px;max-height:88px}.metadata{flex:1;margin-left:10px}.guild-name{font-size:1.2em}.channel-name{font-size:1em}.channel-topic{margin-top:2px}.channel-message-count{margin-top:2px}.channel-timezone{margin-top:2px;font-size:.9em}.channel-date-range{margin-top:2px}</style>` +
        `<script>function scrollToMessage(e,t){var o=document.getElementById("message-"+t);null!=o&&(e.preventDefault(),o.classList.add("message--highlighted"),window.scrollTo({top:o.getBoundingClientRect().top-document.body.getBoundingClientRect().top-window.innerHeight/2,behavior:"smooth"}),window.setTimeout(function(){o.classList.remove("message--highlighted")},2e3))}function scrollToMessage(e,t){var o=document.getElementById("message-"+t);o&&(e.preventDefault(),o.classList.add("message--highlighted"),window.scrollTo({top:o.getBoundingClientRect().top-document.body.getBoundingClientRect().top-window.innerHeight/2,behavior:"smooth"}),window.setTimeout(function(){o.classList.remove("message--highlighted")},2e3))}function showSpoiler(e,t){t&&t.classList.contains("spoiler--hidden")&&(e.preventDefault(),t.classList.remove("spoiler--hidden"))}</script>` + 
        `<script>document.addEventListener('DOMContentLoaded', () => {document.querySelectorAll('.pre--multiline').forEach((block) => {hljs.highlightBlock(block);});});</script>` + 
        `</head>`;
        let messagesArray = []
        let messagescount = Messages.length;
        let msgs = Messages.reverse(); //reverse the array to have it listed like the discord chat
        //now for every message in the array make a new paragraph!
        await msgs.forEach(async msg => {
            //Aug 02, 2021 12:20 AM
            if(msg.type == "DEFAULT"){
              let time = moment(msg.createdTimestamp).format("MMM DD, YYYY HH:mm:ss")
              let subcontent = `<div class="message-group">` + 
              `<div class="ath-av-container"><img class="ath-av"src="${msg.author.displayAvatarURL({dynamic: true})}" /></div>` + 
              `<div class="messages">` + 
              `<span class="ath-name" title="${msg.author.username}" style="color: ${msg.member.roles.highest.hexColor};">${msg.author.tag}</span>`;
              if(msg.author.bot) subcontent += `<span class="bot-tag">BOT</span>`;
              subcontent += `<span class="tst">ID: ${msg.author.id} | </span>` + 
              `<span class="tst">${time} ${msg.editedTimestamp ? `(edited)` : msg.editedAt ? `(edited)` : ""}</span>` + 
              `<div class="message">`;
              if (msg.content) {
                subcontent += `<div class="content"><div class="markdown"><span class="preserve-whitespace">${markdowntohtml(String(msg.cleanContent ? msg.cleanContent : msg.content).replace(/\n/ig, "<br/>"))}</div></div>` 
              } 
              if (msg.embeds[0]){
                  subcontent += `<div class="embed"><div class=embed-color-pill style=background-color:"${msg.embeds[0].color ? msg.embeds[0].color : "transparent"}"></div><div class=embed-content-container><div class=embed-content><div class=embed-text>` 
                  
                  if(msg.embeds[0].author){
                    subcontent += `<div class="embed-ath">`;
                    if(msg.embeds[0].author.iconURL){
                      subcontent += `<img class="embed-ath-icon" src="${msg.embeds[0].author.iconURL}">`
                    }
                    if(msg.embeds[0].author.name){
                      subcontent += `<div class="embed-ath-name"><span class="markdown">${markdowntohtml(String(msg.embeds[0].author.name).replace(/\n/ig, "<br/>"))}</span></div>`
                    }
                    subcontent += `</div>`
                  }if(msg.embeds[0].title){
                    subcontent += `<div class="embed-title"><span class="markdown">${markdowntohtml(String(msg.embeds[0].title).replace(/\n/ig, "<br/>"))}</span></div>`;
                  }
                  if(msg.embeds[0].description){
                    subcontent += `<div class="embed-description preserve-whitespace"><span class="markdown" style="color: rgba(255,255,255,.6) !important;">${markdowntohtml(String(msg.embeds[0].description).replace(/\n/ig, "<br/>"))}</span></div>`;
                  }
                  if(msg.embeds[0].image){
                    subcontent += `<div class="embed-image-container"><img class="embed-footer-image" src="${msg.embeds[0].image.url}"></div>`
                  }
                  if(msg.embeds[0].fields && msg.embeds[0].fields.length > 0){
                    subcontent += `<div class="embed-fields">`
                    for(let i = 0; i < msg.embeds[0].fields.length; i++){
                        subcontent += `<div class="embed-field ${msg.embeds[0].fields[i].inline ? `embed-field--inline` : ``}">`
                        const field = msg.embeds[0].fields[i]
                        if(field.key){
                          subcontent += `<div class="embed-field-name">${markdowntohtml(String(field.key).replace(/\n/ig, "<br/>"))}</div>`;
                        }
                        if(field.value){
                          subcontent += `<div class="embed-field-value">${markdowntohtml(String(field.value).replace(/\n/ig, "<br/>"))}</div>`;
                        }
                        subcontent += `</div>`
                    }
                    subcontent += `</div>`;
                  }
                  if(msg.embeds[0].footer){
                    subcontent += `<div class="embed-footer">`;
                    if(msg.embeds[0].footer.iconURL){
                      subcontent += `<img class="embed-footer-icon" src="${msg.embeds[0].footer.iconURL}">`
                    }
                    if(msg.embeds[0].footer.text){
                      subcontent += `<div class="embed-footer-text"><span class="markdown">${markdowntohtml(String(msg.embeds[0].footer.text).replace(/\n/ig, "<br/>"))}</span></div>`
                    }
                    subcontent += `</div>`
                  }
                  subcontent += `</div>`;
                  if(msg.embeds[0].thumbnail && msg.embeds[0].thumbnail.url){
                    subcontent += `<img class="embed-thumbnail" src="${msg.embeds[0].thumbnail.url}">`;
                  }
                  subcontent += `</div></div></div>`;
              }
              if (msg.reactions && msg.reactions.cache.size > 0){
                subcontent += `<div class="reactions">`
                for(const reaction of msg.reactions.cache.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966)){                      
                  subcontent += `<div class=reaction>${reaction.emoji?.url ? `<img class="emoji emoji--small" src="${reaction.emoji?.url}" alt="${"<" + reaction.emoji?.animated ? "a" : "" + ":" + reaction.emoji?.name + ":" + reaction.emoji?.id + ">"}">` : reaction.emoji?.name.toString()}<span class="reaction-count">${reaction.count}</span></div>`
                }
                subcontent += `</div>`
              }
              subcontent += `</div></div></div>`
              messagesArray.push(subcontent);
            }
            if(msg.type == "PINS_ADD"){
              let time = moment(msg.createdTimestamp).format("MMM DD, YYYY HH:mm:ss")
              let subcontent = `<div class="message-group">` + 
              `<div class="ath-av-container"><img class="ath-av"src="https://cdn-0.emojis.wiki/emoji-pics/twitter/pushpin-twitter.png" style="background-color: #000;filter: alpha(opacity=40);opacity: 0.4;" /></div>` + 
              `<div class="messages">` + 
              `<span class="ath-name" title="${msg.author.username}" style="color: ${msg.member.roles.highest.hexColor};">${msg.author.tag}</span>`;
              if(msg.author.bot) subcontent += `<span class="bot-tag">BOT</span>`;
              subcontent += `<span class="tst" style="font-weight:500;color:#848484;font-size: 14px;">pinned a message to this channel.</span><span class="tst">${time}</span></div></div></div>`;
            messagesArray.push(subcontent);
            }
        });
        baseHTML += `<body><div class="info"><div class="guild-icon-container"> <img class="guild-icon" src="${Guild.iconURL({dynamic:true})}" />` +
          `</div><div class="metadata">` +
          `<div class="guild-name"><strong>Guild:</strong> ${Guild.name} (<mark>${Guild.id})</mark></div>` +
          `<div class="channel-name"><strong>Channel:</strong> ${Channel.name} (<mark>${Channel.id})</mark></div>` +
          `<div class="channel-message-count"><mark>${messagescount} Messages</mark></div>` +
          `<div class="channel-timezone"><strong>Timezone-Log-Created:</strong> <mark>${moment(Date.now()).format("MMM DD, YYYY HH:mm")}</mark> | <em>[MEZ] Europe/London</em></div>` +
          `</div></div>` +
          `<div class="chatlog">`;
          baseHTML += messagesArray.join("\n");
          baseHTML += `<div class="message-group"><div class="ath-av-container"><img class="ath-av"src="https://logosmarken.com/wp-content/uploads/2020/12/Discord-Logo.png" /></div><div class="messages"><span class="ath-name" style="color: #ff5151;">TICKET LOG INFORMATION</span><span class="bot-tag">✓ SYSTEM</span><span class="timestamp">Mind this Information</span><div class="message " ><div class="content"><div class="markdown"><span class="preserve-whitespace"><i><blockquote>If there are Files, Attachments, Videos or Images, they won't always be displayed cause they will be unknown and we don't want to spam an API like IMGUR!</blockquote></i></span></div></div></div></div></div></div></body></html>`;
        fs.writeFileSync(`${process.cwd()}/${Channel.name}.html`, baseHTML); //write everything in the docx file
        resolve(`${process.cwd()}/${Channel.name}.html`);
        return;
        function markdowntohtml(tomarkdown){
          mentionReplace(tomarkdown.split(" "));
          function mentionReplace(splitted){
            for(arg of splitted){
              const memberatches = arg.match(/<@!?(\d+)>/);
              const rolematches = arg.match(/<@&(\d+)>/);
              const channelmatches = arg.match(/<#(\d+)>/);
              if (rolematches) {
                let role = Guild.roles.cache.get(rolematches[1])
                if(role){
                  let torpleace = new RegExp(rolematches[0], "g")
                  tomarkdown = tomarkdown.replace(torpleace, `<span title="${role.id}" style="color: ${role.hexColor};">@${role.name}</span>`);
                }
              }
              if(memberatches){
                let member = Guild.members.cache.get(memberatches[1])
                if(member){
                  let torpleace = new RegExp(memberatches[0], "g")
                  tomarkdown = tomarkdown.replace(torpleace, `<span class="mention" title="${member.id}">@${member.user.username}</span>`);
                }
              }
              if(channelmatches){
                let channel = Guild.channels.cache.get(channelmatches[1])
                if(channel){
                  let torpleace = new RegExp(channelmatches[0], "g")
                  tomarkdown = tomarkdown.replace(torpleace, `<span class="mention" title="${channel.id}">@${channel.name}</span>`);
                }
              }
            }
          }
          var output = "";
          var BLOCK = "block";
          var INLINE = "inline";
          var parseMap = [
            {
              // <p>
              pattern: /\n(?!<\/?\w+>|\s?\*|\s?[0-9]+|>|\&gt;|-{5,})([^\n]+)/g,
              replace: "$1<br/>",
              type: BLOCK,
            },
            {
              // <blockquote>
              pattern: /\n(?:&gt;|\>)\W*(.*)/g,
              replace: "<blockquote><p>$1</p></blockquote>",
              type: BLOCK,
            },
            {
              // <ul>
              pattern: /\n\s?\*\s*(.*)/g,
              replace: "<ul>\n\t<li>$1</li>\n</ul>",
              type: BLOCK,
            },
            {
              // <ol>
              pattern: /\n\s?[0-9]+\.\s*(.*)/g,
              replace: "<ol>\n\t<li>$1</li>\n</ol>",
              type: BLOCK,
            },
            {
              // <strong>
              pattern: /(\*\*|__)(.*?)\1/g,
              replace: "<strong>$2</strong>",
              type: INLINE,
            },
            {
              // <em>
              pattern: /(\*)(.*?)\1/g,
              replace: "<em>$2</em>",
              type: INLINE,
            },
            {
              // <a>
              pattern: /([^!])\[([^\[]+)\]\(([^\)]+)\)/g,
              replace: "$1<a href=\"$3\">$2</a>",
              type: INLINE,
            },
            {
              // <img>
              pattern: /!\[([^\[]+)\]\(([^\)]+)\)/g,
              replace: "<img src=\"$2\" alt=\"$1\" />",
              type: INLINE,
            },
            {
              // <code>
              pattern: /`(.*?)`/g,
              replace: "<mark>$1</mark>",
              type: INLINE,
            },
          ];
          function parse(string) {
            output = "\n" + string + "\n";
            parseMap.forEach(function(p) {
              output = output.replace(p.pattern, function() {
                return replace.call(this, arguments, p.replace, p.type);
              });
            });
            output = clean(output);
            output = output.trim();
            output = output.replace(/[\n]{1,}/g, "\n");
            return output;
          }
          function replace(matchList, replacement, type) {
            var i, $$;
            for(i in matchList) {
              if(!matchList.hasOwnProperty(i)) {
                continue;
              }
              replacement = replacement.split("$" + i).join(matchList[i]);
              replacement = replacement.split("$L" + i).join(matchList[i].length);
            }
            if(type === BLOCK) {
              replacement = replacement.trim() + "\n";
            }
            return replacement;
          }
          function clean(string) {
            var cleaningRuleArray = [
              {
                match: /<\/([uo]l)>\s*<\1>/g,
                replacement: "",
              },
              {
                match: /(<\/\w+>)<\/(blockquote)>\s*<\2>/g,
                replacement: "$1",
              },
            ];
            cleaningRuleArray.forEach(function(rule) {
              string = string.replace(rule.match, rule.replacement);
            });
            return string;
          }
          
          let output__ = parse(tomarkdown);
          return output__;
        }
      }catch (e){
        reject(e);
        return;
      }
    })          
}


function getMember(message, toFind = "") {
    toFind = toFind.toLowerCase();
    let target = message.guild.members.cache.get(toFind);
    if (!target && message.mentions.members) target = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first();
    if (!target && toFind) {
      target = message.guild.members.cache.find((member) => {
        return member.displayName.toLowerCase().includes(toFind) || member.user.tag.toLowerCase().includes(toFind);
      });
    }
    if (!target) target = message.member;
    return target;
}

function shuffle(a) {
  try {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}

function formatDate(date) {
  try {
    return new Intl.DateTimeFormat("en-US").format(date);
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}




function duration(duration, useMilli = false) {
    let remain = duration;
    let days = Math.floor(remain / (1000 * 60 * 60 * 24));
    remain = remain % (1000 * 60 * 60 * 24);
    let hours = Math.floor(remain / (1000 * 60 * 60));
    remain = remain % (1000 * 60 * 60);
    let minutes = Math.floor(remain / (1000 * 60));
    remain = remain % (1000 * 60);
    let seconds = Math.floor(remain / (1000));
    remain = remain % (1000);
    let milliseconds = remain;
    let time = {
      days,
      hours,
      minutes,
      seconds,
      milliseconds
    };
    let parts = []
    if (time.days) {
      let ret = time.days + ' Day'
      if (time.days !== 1) {
        ret += 's'
      }
      parts.push(ret)
    }
    if (time.hours) {
      let ret = time.hours + ' Hr'
      if (time.hours !== 1) {
        ret += 's'
      }
      parts.push(ret)
    }
    if (time.minutes) {
      let ret = time.minutes + ' Min'
      if (time.minutes !== 1) {
        ret += 's'
      }
      parts.push(ret)
  
    }
    if (time.seconds) {
      let ret = time.seconds + ' Sec'
      if (time.seconds !== 1) {
        ret += 's'
      }
      parts.push(ret)
    }
    if (useMilli && time.milliseconds) {
      let ret = time.milliseconds + ' ms'
      parts.push(ret)
    }
    if (parts.length === 0) {
      return ['instantly']
    } else {
      return parts
    }
}


async function promptMessage(message, author, time, validReactions) {
  try {
    time *= 1000;
    for (const reaction of validReactions) await message.react(reaction);
    const filter = (reaction, user) => validReactions.includes(reaction.emoji?.name) && user.id === author.id;
    return message.awaitReactions({filter, 
      max: 1,
      time: time
    }).then((collected) => collected.first() && collected.first().emoji?.name);
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}

function delay(delayInms) {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}

function getRandomInt(max) {
  try {
    return Math.floor(Math.random() * Math.floor(max));
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}

function getRandomNum(min, max) {
  try {
    return Math.floor(Math.random() * Math.floor((max - min) + min));
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}

function createBar(player) {
  try {
    let size = 25;
    let line = "▬";
    //player.queue.current.duration == 0 ? player.position : player.queue.current.duration, player.position, 25, "▬", "🔷")
    if (!player.queue.current) return `**[${"🔷"}${line.repeat(size - 1)}]**\n**00:00:00 / 00:00:00**`;
    let current = player.queue.current.duration !== 0 ? player.position : player.queue.current.duration;
    let total = player.queue.current.duration;

    let slider = "🔷";
    let bar = current > total ? [line.repeat(size / 2 * 2), (current / total) * 100] : [line.repeat(Math.round(size / 2 * (current / total))).replace(/.$/, slider) + line.repeat(size - Math.round(size * (current / total)) + 1), current / total];
    if (!String(bar).includes("🔷")) return `**[${"🔷"}${line.repeat(size - 1)}]**\n**00:00:00 / 00:00:00**`;
    return `**[${bar[0]}]**\n**${new Date(player.position).toISOString().substring(11, 8)+" / "+(player.queue.current.duration==0?" ◉ LIVE":new Date(player.queue.current.duration).toISOString().substring(11, 8))}**`;
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}

function format(millis) {
  try {
    var s = Math.floor((millis / 1000) % 60);
    var m = Math.floor((millis / (1000 * 60)) % 60);
    var h = Math.floor((millis / (1000 * 60* 60)) % 24); 
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    return h + ":" + m + ":" + s + " | " +  Math.floor((millis / 1000)) + " Seconds"
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}

function stations(client, prefix, message) {
  let es = client.settings.get(message.guild.id, "embed");
  let ls = client.settings.get(message.guild.id, "language");
  

  try {
    const reyfm_iloveradio_embed = new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es)).setTitle("Pick your Station, by typing in the right `INDEX` Number!").setDescription(`Example: \`${prefix}radio 11\``);
    const stationsembed = new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es)).setTitle("Pick your Station, by typing in the right `INDEX` Number!").setDescription(`Example: \`${prefix}radio 44\``);
    const stationsembed2 = new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es)).setTitle("Pick your Station, by typing in the right `INDEX` Number!").setDescription(`Example: \`${prefix}radio 69\``);
    const stationsembed3 = new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es)).setTitle("Pick your Station, by typing in the right `INDEX` Number!").setDescription(`Example: \`${prefix}radio 120\``);
    const stationsembed4 = new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es)).setTitle("CUSTOM REQUESTS | Pick your Station, by typing in the right `INDEX` Number!");
    
    let beforeindex = 1;
    let REYFM = "";
    for (let i = 0; i < radios.REYFM.length; i++) {
      REYFM += `**${i + beforeindex}** [${radios.REYFM[i].split(" ")[0].replace("-", " ").substring(0, 16)}](${radios.REYFM[i].split(" ")[1]})\n`;
    }
    beforeindex+=radios.REYFM.length;
    let ILOVERADIO = "";
    for (let i = 0; i < radios.ILOVERADIO.length; i++) {
      ILOVERADIO += `**${i + beforeindex}** [${radios.ILOVERADIO[i].split(" ")[0].replace("-", " ").substring(0, 16)}](${radios.ILOVERADIO[i].split(" ")[1]})\n`;
    }
    beforeindex+=radios.ILOVERADIO.length;
    reyfm_iloveradio_embed.addField("**REYFM-STATIONS:**", `${REYFM}`.substring(0, 1024), true)
    reyfm_iloveradio_embed.addField("**ILOVEMUSIC-STATIONS:**", `${ILOVERADIO}`.substring(0, 1024), true)
    reyfm_iloveradio_embed.addField("**INFORMATIONS:**", "> *On the next pages, are country specific Radiostations*\n> *Some of those might not work, because they might be offline, this is because of either ping, timezone or because that they are not maintained!*")

    let United_Kingdom = "";
    for (let i = 0; i < radios.EU.United_Kingdom.length; i++) {
      United_Kingdom += `**${i + beforeindex}** [${radios.EU.United_Kingdom[i].split(" ")[0].replace("-", " ").substring(0, 16)}](${radios.EU.United_Kingdom[i].split(" ")[1]})\n`;
    }
    beforeindex+=radios.EU.United_Kingdom.length;
    stationsembed.addField("🇬🇧 United Kingdom", `>>> ${United_Kingdom}`, true);

    let austria = "";
    for (let i = 0; i < radios.EU.Austria.length; i++) {
      austria += `**${i + beforeindex}** [${radios.EU.Austria[i].split(" ")[0].replace("-", " ").substring(0, 16)}](${radios.EU.Austria[i].split(" ")[1]})\n`;
    }
    beforeindex+=radios.EU.Austria.length;
    stationsembed.addField("🇦🇹 Austria", `>>> ${austria}`, true);
    
    let Belgium = "";
    for (let i = 0; i < radios.EU.Belgium.length; i++) {
      Belgium += `**${i + beforeindex}** [${radios.EU.Belgium[i].split(" ")[0].replace("-", " ").substring(0, 16)}](${radios.EU.Belgium[i].split(" ")[1]})\n`;
    }
    beforeindex+=radios.EU.Belgium.length;
    stationsembed.addField("🇧🇪 Belgium", `>>> ${Belgium}`, true);
    
    let Bosnia = "";
    for (let i = 0; i < radios.EU.Bosnia.length; i++) {
      Bosnia += `**${i + beforeindex}** [${radios.EU.Bosnia[i].split(" ")[0].replace("-", " ").substring(0, 16)}](${radios.EU.Bosnia[i].split(" ")[1]})\n`;
    }
    beforeindex+=radios.EU.Bosnia.length;
    stationsembed.addField("🇧🇦 Bosnia", `>>> ${Bosnia}`, true);
    
    let Czech = "";
    for (let i = 0; i < radios.EU.Czech.length; i++) {
      Czech += `**${i + beforeindex}** [${radios.EU.Czech[i].split(" ")[0].replace("-", " ").substring(0, 16)}](${radios.EU.Czech[i].split(" ")[1]})\n`;
    }
    beforeindex+=radios.EU.Czech.length;
    stationsembed.addField("🇨🇿 Czech", `>>> ${Czech}`, true);
    
    let Denmark = "";
    for (let i = 0; i < radios.EU.Denmark.length; i++) {
      Denmark += `**${i + beforeindex}** [${radios.EU.Denmark[i].split(" ")[0].replace("-", " ").substring(0, 16)}](${radios.EU.Denmark[i].split(" ")[1]})\n`;
    }
    beforeindex+=radios.EU.Denmark.length;
    stationsembed.addField("🇩🇰 Denmark", `>>> ${Denmark}`, true);
    
    let germany = "";
    for (let i = 0; i < radios.EU.Germany.length; i++) {
      germany += `**${i + beforeindex}** [${radios.EU.Germany[i].split(" ")[0].replace("-", " ").substring(0, 16)}](${radios.EU.Germany[i].split(" ")[1]})\n`;
    }
    beforeindex+=radios.EU.Germany.length;
    stationsembed2.addField("🇩🇪 Germany", `>>> ${germany}`, true);
    
    let Hungary = "";
    for (let i = 0; i < radios.EU.Hungary.length; i++) {
      Hungary += `**${i + beforeindex}** [${radios.EU.Hungary[i].split(" ")[0].replace("-", " ").substring(0, 16)}](${radios.EU.Hungary[i].split(" ")[1]})\n`;
    }
    beforeindex+=radios.EU.Hungary.length;
    stationsembed2.addField("🇭🇺 Hungary", `>>> ${Hungary}`, true);
    
    let Ireland = "";
    for (let i = 0; i < radios.EU.Ireland.length; i++) {
      Ireland += `**${i + beforeindex}** [${radios.EU.Ireland[i].split(" ")[0].replace("-", " ").substring(0, 16)}](${radios.EU.Ireland[i].split(" ")[1]})\n`;
    }
    beforeindex+=radios.EU.Ireland.length;
    stationsembed2.addField("🇮🇪 Ireland", `>>> ${Ireland}`, true);
    
    let Italy = "";
    for (let i = 0; i < radios.EU.Italy.length; i++) {
      Italy += `**${i + beforeindex}** [${radios.EU.Italy[i].split(" ")[0].replace("-", " ").substring(0, 16)}](${radios.EU.Italy[i].split(" ")[1]})\n`;
    }
    beforeindex+=radios.EU.Italy.length;
    stationsembed2.addField("🇮🇹 Italy", `>>> ${Italy}`, true);
    
    let Luxembourg = "";
    for (let i = 0; i < radios.EU.Luxembourg.length; i++) {
      Luxembourg += `**${i + beforeindex}** [${radios.EU.Luxembourg[i].split(" ")[0].replace("-", " ").substring(0, 16)}](${radios.EU.Luxembourg[i].split(" ")[1]})\n`;
    }
    beforeindex+=radios.EU.Luxembourg.length;
    stationsembed2.addField("🇱🇺 Luxembourg", `>>> ${Luxembourg}`, true);
    
    let Romania = "";
    for (let i = 0; i < radios.EU.Romania.length; i++) {
      Romania += `**${i + beforeindex}** [${radios.EU.Romania[i].split(" ")[0].replace("-", " ").substring(0, 16)}](${radios.EU.Romania[i].split(" ")[1]})\n`;
    }
    beforeindex+=radios.EU.Romania.length;
    stationsembed2.addField("🇷🇴 Romania", `>>> ${Romania}`, true);
    
    let Serbia = "";
    for (let i = 0; i < radios.EU.Serbia.length; i++) {
      Serbia += `**${i + beforeindex}** [${radios.EU.Serbia[i].split(" ")[0].replace("-", " ").substring(0, 16)}](${radios.EU.Serbia[i].split(" ")[1]})\n`;
    }
    beforeindex+=radios.EU.Serbia.length;
    stationsembed3.addField("🇷🇸 Serbia", `>>> ${Serbia}`, true);
    
    let Spain = "";
    for (let i = 0; i < radios.EU.Spain.length; i++) {
      Spain += `**${i + beforeindex}** [${radios.EU.Spain[i].split(" ")[0].replace("-", " ").substring(0, 16)}](${radios.EU.Spain[i].split(" ")[1]})\n`;
    }
    beforeindex+=radios.EU.Spain.length;
    stationsembed3.addField("🇪🇸 Spain", `>>> ${Spain}`, true);
    
    let Sweden = "";
    for (let i = 0; i < radios.EU.Sweden.length; i++) {
      Sweden += `**${i + beforeindex}** [${radios.EU.Sweden[i].split(" ")[0].replace("-", " ").substring(0, 16)}](${radios.EU.Sweden[i].split(" ")[1]})\n`;
    }
    beforeindex+=radios.EU.Sweden.length;
    stationsembed3.addField("🇸🇪 Sweden", `>>> ${Sweden}`, true);
    
    let TURKEY = "";
    for (let i = 0; i < radios.EU.TURKEY.length; i++) {
      TURKEY += `**${i + beforeindex}** [${radios.EU.TURKEY[i].split(" ")[0].replace("-", " ").substring(0, 16)}](${radios.EU.TURKEY[i].split(" ")[1]})\n`;
    }
    beforeindex+=radios.EU.TURKEY.length;
    stationsembed3.addField("🇹🇷 TURKEY", `>>> ${TURKEY}`, true);
    let Ukraine = "";
    for (let i = 0; i < radios.EU.Ukraine.length; i++) {
      Ukraine += `**${i + beforeindex}** [${radios.EU.Ukraine[i].split(" ")[0].replace("-", " ").substring(0, 16)}](${radios.EU.Ukraine[i].split(" ")[1]})\n`;
    }
    beforeindex+=radios.EU.Ukraine.length;
    stationsembed3.addField("🇺🇦 Ukraine", `>>> ${Ukraine}`, true);

    let embeds = []
    embeds.push(reyfm_iloveradio_embed)
    embeds.push(stationsembed)
    embeds.push(stationsembed2)
    embeds.push(stationsembed3)
    let requests = "";
    for (let i = 0; i < radios.OTHERS.request.length; i++) {
      requests += `**${i + beforeindex}** [${radios.OTHERS.request[i].split(" ")[0].replace("-", " ").substring(0, 20)}](${radios.OTHERS.request[i].split(" ")[1]})\n`;
      if(requests.length > 1900){
        embeds.push(new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null).setFooter(client.getFooter(es)).setTitle("CUSTOM REQUESTS | Pick your Station, by typing in the right `INDEX` Number!").setDescription(`${requests}`))
        requests = "";
      }
    }
    beforeindex+=radios.OTHERS.request.length;
    stationsembed4.setDescription(`${requests}`);
    embeds.push(stationsembed4)
    require("./functions").swap_pages2(client, message, embeds);
    let amount = 0;
    

  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}

function escapeRegex(str) {
  try {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}

async function autoplay(client, player, type) {
  let es = client.settings.get(player.guild, "embed") 
  if(!client.settings.has(player.guild, "language")) dbEnsure(client.settings, player.guild, { language: "en" });
  let ls = client.settings.get(player.guild, "language")
  try {
    if (player.queue.length > 0) return;
    const previoustrack = player.get("previoustrack") || player.queue.current;
    if (!previoustrack) return;

    const mixURL = `https://www.youtube.com/watch?v=${previoustrack.identifier}&list=RD${previoustrack.identifier}`;
    const response = await client.manager.search(mixURL, previoustrack.requester);
    //if nothing is found, send error message, plus if there  is a delay for the empty QUEUE send error message TOO
    if (!response || response.loadType === 'LOAD_FAILED' || response.loadType !== 'PLAYLIST_LOADED') {
      let embed = new MessageEmbed()
        .setTitle(eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variable7"]))
        .setDescription(config.settings.LeaveOnEmpty_Queue.enabled && type != "skip" ? `I'll leave the Channel: \`${client.channels.cache.get(player.voiceChannel).name}\` in: \`${ms(config.settings.LeaveOnEmpty_Queue.time_delay, { long: true })}\`, If the Queue stays Empty! ` : eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variable9"]))
        .setColor(es.wrongcolor).setFooter(client.getFooter(es));
      client.channels.cache.get(player.textChannel).send({embeds: [embed]}).catch(e => console.log("THIS IS TO PREVENT A CRASH"))
      if (config.settings.LeaveOnEmpty_Queue.enabled && type != "skip") {
        return setTimeout(() => {
          try {
            player = client.manager.players.get(player.guild);
            if (player.queue.size === 0) {
              let embed = new MessageEmbed()
              try {
                embed.setTitle(eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variable8"]))
              } catch {}
              try {
                embed.setDescription(eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variable1"]))
              } catch {}
              try {
                embed.setColor(es.wrongcolor)
              } catch {}
              try {
                embed.setFooter(client.getFooter(es));
              } catch {}
              client.channels.cache
                .get(player.textChannel)
                .send({embeds: [embed]}).catch(e => console.log("THIS IS TO PREVENT A CRASH"))
              try {
                client.channels.cache
                  .get(player.textChannel)
                  .messages.fetch(player.get("playermessage")).then(async msg => {
                    try {
                      await delay(7500)
                      msg.delete().catch(() => {});
                    } catch {
                      /* */
                    }
                  }).catch(() => {});
              } catch (e) {
                console.log(String(e.stack).grey.yellow);
              }
              player.destroy();
            }
          } catch (e) {
            console.log(String(e.stack).grey.yellow);
          }
        }, config.settings.LeaveOnEmpty_Queue.time_delay);
      } else {
        player.destroy();
      }
    }
    player.queue.add(response.tracks[Math.floor(Math.random() * Math.floor(response.tracks.length))]);
    return player.play();
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}

function arrayMove(array, from, to) {
  try {
    array = [...array];
    const startIndex = from < 0 ? array.length + from : from;
    if (startIndex >= 0 && startIndex < array.length) {
      const endIndex = to < 0 ? array.length + to : to;
      const [item] = array.splice(from, 1);
      array.splice(endIndex, 0, item);
    }
    return array;
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}
function nFormatter(num, digits = 2) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup.slice().reverse().find(function(item) {
    return num >= item.value;
  });
  return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

async function swap_pages(client, message, description, TITLE) {
  const settings = client.settings.get(message.guild.id)
  let es = settings.embed;
  let prefix = settings.prefix
  let ls = settings.language;
  let cmduser = message.author;
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */

  let currentPage = 0;
  //GET ALL EMBEDS
  let embeds = [];
  //if input is an array
  if (Array.isArray(description)) {
    try {
      let k = 20;
      for (let i = 0; i < description.length; i += 20) {
        const current = description.slice(i, k);
        k += 20;
        const embed = new MessageEmbed()
          .setDescription(current.join("\n"))
          .setTitle(TITLE)
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(es))
        embeds.push(embed);
      }
      embeds;
    } catch (e){console.error(e)}
  } else {
    try {
      let k = 1000;
      for (let i = 0; i < description.length; i += 1000) {
        const current = description.slice(i, k);
        k += 1000;
        const embed = new MessageEmbed()
          .setDescription(current)
          .setTitle(TITLE)
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(es))
        embeds.push(embed);
      }
      embeds;
    } catch (e){console.error(e)}
  }
  if (embeds.length === 0) return message.channel.send({embeds: [new MessageEmbed()
  .setTitle(`${emoji?.msg.ERROR} No Content added to the SWAP PAGES Function`)
  .setColor(es.wrongcolor).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
  .setFooter(client.getFooter(es))]}).catch(e => console.log("THIS IS TO PREVENT A CRASH"))
  if (embeds.length === 1) return message.channel.send({embeds: [embeds[0]]}).catch(e => console.log("THIS IS TO PREVENT A CRASH"))

  let button_back = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji("833802907509719130").setLabel("Back")
  let button_home = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji("🏠").setLabel("Home")
  let button_forward = new MessageButton().setStyle('SUCCESS').setCustomId('3').setEmoji('832598861813776394').setLabel("Forward")
  let button_blank = new MessageButton().setStyle('SECONDARY').setCustomId('button_blank').setLabel("\u200b").setDisabled();
  let button_stop = new MessageButton().setStyle('DANGER').setCustomId('stop').setEmoji("🛑").setLabel("Stop")
  const allbuttons = [new MessageActionRow().addComponents([button_back, button_home, button_forward, button_blank, button_stop])]
  //Send message with buttons
  let swapmsg = await message.channel.send({   
      content: `***Click on the __Buttons__ to swap the Pages***`,
      embeds: [embeds[0]], 
      components: allbuttons
  });
  //create a collector for the thinggy
  const collector = swapmsg.createMessageComponentCollector({filter: (i) => i?.isButton() && i?.user && i?.user.id == cmduser.id && i?.message.author.id == client.user.id, time: 180e3 }); //collector for 5 seconds
  //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
  collector.on('collect', async b => {
      if(b?.user.id !== message.author.id)
        return b?.reply({content: `<:no:833101993668771842> **Only the one who typed ${prefix}help is allowed to react!**`, ephemeral: true})
        //page forward
        if(b?.customId == "1") {
          collector.resetTimer();
          //b?.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
            if (currentPage !== 0) {
              currentPage -= 1
              await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
              await b?.deferUpdate();
            } else {
                currentPage = embeds.length - 1
                await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
                await b?.deferUpdate();
            }
        }
        //go home
        else if(b?.customId == "2"){
          collector.resetTimer();
          //b?.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
            currentPage = 0;
            await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
            await b?.deferUpdate();
        } 
        //go forward
        else if(b?.customId == "3"){
          collector.resetTimer();
          //b?.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
            if (currentPage < embeds.length - 1) {
                currentPage++;
                await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
                await b?.deferUpdate();
            } else {
                currentPage = 0
                await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
                await b?.deferUpdate();
            }
        
        } 
        //go forward
        else if(b?.customId == "stop"){
            await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents(swapmsg.components)}).catch(() => {});
            await b?.deferUpdate();
            collector.stop("stopped");
        }
  });
  collector.on("end", (reason) => {
    if(reason != "stopped"){
      swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents(swapmsg.components)}).catch(() => {});
    }
  })


}
async function swap_pages2(client, message, embeds) {
  let currentPage = 0;
  let cmduser = message.author;
  if (embeds.length === 1) return message.channel.send({embeds: [embeds[0]]}).catch(e => console.log("THIS IS TO PREVENT A CRASH"))
  let button_back = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji("833802907509719130").setLabel("Back")
  let button_home = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji("🏠").setLabel("Home")
  let button_forward = new MessageButton().setStyle('SUCCESS').setCustomId('3').setEmoji('832598861813776394').setLabel("Forward")
  let button_blank = new MessageButton().setStyle('SECONDARY').setCustomId('button_blank').setLabel("\u200b").setDisabled();
  let button_stop = new MessageButton().setStyle('DANGER').setCustomId('stop').setEmoji("🛑").setLabel("Stop")
  const allbuttons = [new MessageActionRow().addComponents([button_back, button_home, button_forward, button_blank, button_stop])]
  let prefix = client.settings.get(message.guild.id, "prefix");
  //Send message with buttons
  let swapmsg = await message.channel.send({   
      content: `***Click on the __Buttons__ to swap the Pages***`,
      embeds: [embeds[0]], 
      components: allbuttons
  });
  //create a collector for the thinggy
  const collector = swapmsg.createMessageComponentCollector({filter: (i) => i?.isButton() && i?.user && i?.user.id == cmduser.id && i?.message.author.id == client.user.id, time: 180e3 }); //collector for 5 seconds
  //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
  collector.on('collect', async b => {
      if(b?.user.id !== message.author.id)
        return b?.reply({content: `<:no:833101993668771842> **Only the one who typed ${prefix}help is allowed to react!**`, ephemeral: true})
        //page forward
        if(b?.customId == "1") {
          collector.resetTimer();
          //b?.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
            if (currentPage !== 0) {
              currentPage -= 1
              await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
              await b?.deferUpdate();
            } else {
                currentPage = embeds.length - 1
                await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
                await b?.deferUpdate();
            }
        }
        //go home
        else if(b?.customId == "2"){
          collector.resetTimer();
          //b?.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
            currentPage = 0;
            await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
            await b?.deferUpdate();
        } 
        //go forward
        else if(b?.customId == "3"){
          collector.resetTimer();
          //b?.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
            if (currentPage < embeds.length - 1) {
                currentPage++;
                await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
                await b?.deferUpdate();
            } else {
                currentPage = 0
                await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
                await b?.deferUpdate();
            }
        
        } 
        //go forward
        else if(b?.customId == "stop"){
            await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents(swapmsg.components)}).catch(() => {});
            await b?.deferUpdate();
            collector.stop("stopped");
        }
  });
  collector.on("end", (reason) => {
    if(reason != "stopped"){
      swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents(swapmsg.components)}).catch(() => {});
    }
  })

}
function getDisabledComponents (MessageComponents) {
  if(!MessageComponents) return []; // Returning so it doesn't crash
  return MessageComponents.map(({components}) => {
      return new MessageActionRow()
          .addComponents(components.map(c => c.setDisabled(true)))
  });
}
async function swap_pages2_interaction(client, interaction, embeds) {
  let currentPage = 0;
  let cmduser = interaction?.member.user;
  if (embeds.length === 1) return interaction?.reply({ephemeral: true, embeds: [embeds[0]]}).catch(e => console.log("THIS IS TO PREVENT A CRASH"))
  let button_back = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji("833802907509719130").setLabel("Back")
  let button_home = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji("🏠").setLabel("Home")
  let button_forward = new MessageButton().setStyle('SUCCESS').setCustomId('3').setEmoji('832598861813776394').setLabel("Forward")
  let button_blank = new MessageButton().setStyle('SECONDARY').setCustomId('button_blank').setLabel("\u200b").setDisabled();
  let button_stop = new MessageButton().setStyle('DANGER').setCustomId('stop').setEmoji("🛑").setLabel("Stop")
  const allbuttons = [new MessageActionRow().addComponents([button_back, button_home, button_forward, button_blank, button_stop])]
  let prefix = client.settings.get(interaction?.member.guild.id, "prefix");
  //Send message with buttons
  let swapmsg = await interaction?.reply({   
      content: `***Click on the __Buttons__ to swap the Pages***`,
      embeds: [embeds[0]], 
      components: allbuttons,
      ephemeral: true
  });
  //create a collector for the thinggy
  const collector = swapmsg.createMessageComponentCollector({filter: (i) => i?.isButton() && i?.user && i?.user.id == cmduser.id && i?.message.author.id == client.user.id, time: 180e3 }); //collector for 5 seconds
  //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
  collector.on('collect', async b => {
      if(b?.user.id !== cmduser.id)
        return b?.reply({content: `<:no:833101993668771842> **Only the one who typed ${prefix}help is allowed to react!**`, ephemeral: true})
        //page forward
        if(b?.customId == "1") {
          collector.resetTimer();
          //b?.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
            if (currentPage !== 0) {
              currentPage -= 1
              await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
              await b?.deferUpdate();
            } else {
                currentPage = embeds.length - 1
                await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
                await b?.deferUpdate();
            }
        }
        //go home
        else if(b?.customId == "2"){
          collector.resetTimer();
          //b?.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
            currentPage = 0;
            await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
            await b?.deferUpdate();
        } 
        //go forward
        else if(b?.customId == "3"){
          collector.resetTimer();
          //b?.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
            if (currentPage < embeds.length - 1) {
                currentPage++;
                await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
                await b?.deferUpdate();
            } else {
                currentPage = 0
                await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents[swapmsg.components]}).catch(() => {});
                await b?.deferUpdate();
            }
        
        } 
        //go forward
        else if(b?.customId == "stop"){
            await swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents(swapmsg.components)}).catch(() => {});
            await b?.deferUpdate();
            collector.stop("stopped");
        }
  });
  collector.on("end", (reason) => {
    if(reason != "stopped"){
      swapmsg.edit({embeds: [embeds[currentPage]], components: getDisabledComponents(swapmsg.components)}).catch(() => {});
    }
  })

}
function databasing(client, guildid, userid) {
  if(!client || client == undefined || !client.user || client.user == undefined) return;
  try {
    if (guildid) {
      dbEnsure(client.customcommands, guildid, {
        commands: []
      })
      dbEnsure(client.keyword, guildid, {
        commands: []
      })
      /**
       * @INFO
       * Bot Coded by Tomato#6966 | https://discord.gg/milrato
       * @INFO
       * Work for Milrato Development | https://milrato.eu
       * @INFO
       * Please mention him / Milrato Development, when using this Code!
       * @INFO
       */
       dbEnsure(client.social_log, guildid, {
        tiktok: {
          channels: [],
          dc_channel: ""
        },
        youtube: {
          channels: [],
          dc_channel: ""
        },
        twitter: {
          TWITTER_USER_ID: "",
          TWITTER_USER_NAME_ONLY_THOSE: "",
          DISCORD_CHANNEL_ID: "",
          latesttweet: "",
          REETWET: false,
          infomsg: "**{Twittername}** posted a new Tweet:\n\n{url}"
        },
        secondtwitter: {
          TWITTER_USER_ID: "",
          TWITTER_USER_NAME_ONLY_THOSE: "",
          DISCORD_CHANNEL_ID: "",
          latesttweet: "",
          REETWET: false,
          infomsg: "**{Twittername}** posted a new Tweet:\n\n{url}"
        },
        twitch: {
          DiscordServerId: guildid,
          channelId: "",
          roleID_PING: "",
          roleID_GIVE: "",
          channels: [],
        }
      })
      for (let i = 0; i <= 25; i++) {
          let index = i + 1;
          dbEnsure(client[`roster${index != 1 ? index : ""}`], guildid, {
            rosterchannel: "notvalid",
            rosteremoji: "➤",
            rostermessage: "",
            rostertitle: "Roster",
            rosterstyle: "1",
            rosterroles: [],
            inline: false,
          })
      }
      dbEnsure(client.stats, guildid, {
        commands: 0,
        songs: 0
      });
      dbEnsure(client.premium, guildid, {
        enabled: false,
      })
      const ensureData = {
        textchannel: "0",
        voicechannel: "0",
        category: "0",
        message_cmd_info: "0",
        message_queue_info: "0",
        message_track_info: "0",
        blacklist: {
          whitelistedroles: [],
          words: [],
          enabled: true
        }
      }
      for(let i = 0; i<=100;i++){
        ensureData[`ticketsystem${i}`] = {
          enabled: false,
          guildid: guildid,
          defaultname: "🎫・{count}・{member}",
          messageid: "",
          channelid: "",
          parentid: "",
          claim: {
            enabled: false,
            messageOpen: "Dear {user}!\n> *Please wait until a Staff Member, claimed your Ticket!*",
            messageClaim: "{claimer} **has claimed the Ticket!**\n> He will now give {user} support!"
          },
          message: "Hey {user}, thanks for opening an ticket! Someone will help you soon!",
          adminroles: []
        }
      }
      dbEnsure(client.setups, guildid, ensureData);
      dbEnsure(client.blacklist, guildid, {
        words: [],
        mute_amount: 5,
        whitelistedchannels: [],
      });
      dbEnsure(client.settings, guildid, {
        prefix: config.prefix,
        pruning: true,
        requestonly: true,
        autobackup: false,
        defaultvolume: 30,
        channel: "773836425678422046",
        adminlog: "no",
        dailyfact: "no",
        reportlog: "no",
        autoembeds: [],
        volume: "69",
        adminroles: [],
        language: "en",

        mute: {
          style: "timeout",
          roleId: "",
          defaultTime: 60000,  
        },

        warnsettings: {
          ban: false,
          kick: false,
          roles: [
            /*
            { warncount: 0, roleid: "1212031723081723"}
            */
          ]
        },

/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */

        showdisabled: true,

        MUSIC: true,
        FUN: true,
        ANIME: true,
        MINIGAMES: true,
        ECONOMY: true,
        SCHOOL: true,
        NSFW: false,
        VOICE: true,
        RANKING: true,
        PROGRAMMING: true,
        CUSTOMQUEUE: true,
        FILTER: true,
        SOUNDBOARD: true,
        antispam: {
          enabled: true,
          whitelistedchannels: [],
          limit: 7,
          mute_amount: 2,
        },
        antimention: {
          enabled: true,
          whitelistedchannels: [],
          limit: 5,
          mute_amount: 2,
        },
        antiemoji: {
          enabled: true,
          whitelistedchannels: [],
          limit: 10,
          mute_amount: 2,
        },
        anticaps: {
          enabled: true,
          whitelistedchannels: [],
          percent: 75,
          mute_amount: 2,
        },
        cmdadminroles: {
          removetimeout: [],
          timeout: [],
          idban: [],
          snipe: [],
          listbackups: [],
          loadbackup: [],
          createbackup: [],
          embed: [],
          editembed: [],
          editimgembed: [],
          imgembed: [],
          useridban: [],
          addrole: [],
          addroletoeveryone: [],
          ban: [],
          channellock: [],
          channelunlock: [],
          clear: [],
          clearbotmessages: [],
          close: [],
          copymessage: [],
          deleterole: [],
          detailwarn: [],
          dm: [],
          editembeds: [],
          editimgembeds: [],
          embeds: [],
          embedbuilder: [],
          esay: [],
          giveaway: [],
          image: [],
          imgembeds: [],
          kick: [],
          mute: [],
          nickname: [],
          unlockthread: [],
          unarchivethread: [],
          lockthread: [],
          archivethread: [],
          leavethread: [],
          lockchannel: [],
          unlockchannel: [],
          jointhread: [],
          jointhreads: [],
          setautoarchiveduration: [],
          tempmute: [],
          permamute: [],
          poll: [],
          react: [],
          removeallwarns: [],
          removerole: [],
          report: [],
          say: [],
          slowmode: [],
          suggest: [],
          ticket: [],
          unmute: [],
          unwarn: [],
          updatemessage: [],
          warn: [],
          warnings: [],
        },
        antilink: {
          enabled: false,
          whitelistedchannels: [],
          mute_amount: 2,
        },
        antidiscord: {
          enabled: false,
          whitelistedchannels: [],
          mute_amount: 2,
        },
        embed: {
          "color": ee.color,
          "thumb": true,
          "wrongcolor": ee.wrongcolor,
          "footertext": client.guilds.cache.get(guildid) ? client.guilds.cache.get(guildid).name : ee.footertext,
          "footericon": client.guilds.cache.get(guildid) ? client.guilds.cache.get(guildid).iconURL({
            dynamic: true
          }) : ee.footericon,
        },
        logger: {
          "channel": "no",
          "webhook_id": "",
          "webhook_token": ""
        },
        welcome: {
          captcha: false,
          roles: [],
          channel: "nochannel",

          secondchannel: "nochannel",
          secondmsg: ":wave: {user} **Welcome to our Server!** :v:",


          image: true,
          custom: "no",
          background: "transparent",
          frame: true,
          framecolor: "white",
          pb: true,
          invite: true,
          discriminator: true,
          membercount: true,
          servername: true,
          msg: "{user} Welcome to this Server",


          dm: false,
          imagedm: false,
          customdm: "no",
          backgrounddm: "transparent",
          framedm: true,
          framecolordm: "white",
          pbdm: true,
          invitedm: true,
          discriminatordm: true,
          membercountdm: true,
          servernamedm: true,
          dm_msg: "{user} Welcome to this Server"
        },
        leave: {
          channel: "nochannel",

          image: true,
          custom: "no",
          background: "transparent",
          frame: true,
          framecolor: "white",
          pb: true,
          invite: true,
          discriminator: true,
          membercount: true,
          servername: true,
          msg: "{user} left this Server",


          dm: true,

          imagedm: true,
          customdm: "no",
          backgrounddm: "transparent",
          framedm: true,
          framecolordm: "white",
          pbdm: true,
          invitedm: true,
          discriminatordm: true,
          membercountdm: true,
          servernamedm: true,
          dm_msg: "{user} left this Server"
        },
        song: "https://streams.ilovemusic.de/iloveradio14.mp3",
        djroles: [],
        djonlycmds: ["autoplay", "clearqueue", "forward", "loop", "jump", "loopqueue", "loopsong", "move", "pause", "resume", "removetrack", "removedupe", "restart", "rewind", "seek", "shuffle", "skip", "stop", "volume"],
        botchannel: [],
      });
      dbEnsure(client.jtcsettings, guildid, {
        prefix: ".",
        channel: "",
        channelname: "{user}' Room",
        guild: guildid,
      });
      dbEnsure(client.jtcsettings2, guildid, {
        channel: "",
        channelname: "{user}' Channel",
        guild: guildid,
      });
      dbEnsure(client.jtcsettings3, guildid, {
        channel: "",
        channelname: "{user}' Lounge",
        guild: guildid,
      });
    }
    if (userid) {
      dbEnsure(client.premium, userid, {
        enabled: false,
      })
      dbEnsure(client.queuesaves, userid, {
        "TEMPLATEQUEUEINFORMATION": ["queue", "sadasd"]
      });
      dbEnsure(client.settings, userid, {
        dm: true,
      })
      dbEnsure(client.stats, guildid + userid, {
        ban: [],
        kick: [],
        mute: [],
        ticket: [],
        says: [],
        warn: [],
      })
    }
    if (userid && guildid) {
      dbEnsure(client.stats, guildid + userid, {
        ban: [],
        kick: [],
        mute: [],
        ticket: [],
        says: [],
        warn: [],
      })
      dbEnsure(client.userProfiles, userid, {
        id: userid,
        guild: guildid,
        totalActions: 0,
        warnings: [],
        kicks: []
      });
    }
    return;
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}

function reset_DB(guildid, client) {
  client.settings.set(guildid, {
    prefix: ".",
    channel: "",
    channelname: "{user}' Room",
    guild: guildid,
  });
  client.settings2.set(guildid, {
    channel: "",
    channelname: "{user}' Channel",
    guild: guildid,
  });
  client.settings3.set(guildid, {
    channel: "",
    channelname: "{user}' Lounge",
    guild: guildid,
  });
}

function change_status(client) {
  try {
    client.user.setActivity(`${config.prefix}help | ${config.prefix}setup | ${totalGuilds} Guilds | ${Math.ceil(totalMembers/1000)}k Members`, {
      type: "WATCHING",
      shardID: shard
    });
  } catch (e) {
    client.user.setActivity(`${config.prefix}help | ${config.prefix}setup | ${client.guilds.cache.size} Guilds | ${Math.ceil(client.users.cache.size/1000)}k Members`, {
      type: "WATCHING",
      shardID: 0
    });
  }
}

async function check_voice_channels(client) {
  let guilds = client.guilds.cache.map(guild => guild.id);
  for (let i = 0; i < guilds.length; i++) {
      try {
          let guild = await client.guilds.cache.get(guilds[i]);
          const obj = {}
          for(let i = 1; i<=100; i++) {
            obj[`jtcsettings${i}`] = {
              channel: "",
              channelname: "{user}' Room",
              guild: guild.id,
            }
          }
          dbEnsure(client.jtcsettings, guild.id, obj);
          let jointocreate = []; //get the data from the database onto one variables
          for(let i = 1; i<=100; i++) {
            jointocreate.push(client.jtcsettings.get(guild.id, `jtcsettings${i}.channel`));
          }
          await guild.channels.cache.filter(ch => ch.type == "GUILD_VOICE" && jointocreate.includes(ch.id)).each(async (channel, j) => {
              try{
                  let members = channel.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966);
                  if (members && members.length != 0){
                      for (let k = 0; k < members.length; k++) {
                          let themember = await guild.members.fetch(members[k]).catch(() => {});
                          create_join_to_create_Channel(client, themember.voice, j + 1);
                      }
                  }else {
                      //console.log("NO MEMBERS")
                  }
              }catch (e){
                  console.error(e)
              }

          });
      } catch (e) {
          console.error(e)
      }
  }
  return;
}

async function check_created_voice_channels(client) {
  let guilds = client.guilds.cache.map(guild => guild.id);
  for (let i = 0; i < guilds.length; i++) {
      try {
          let guild = client.guilds.cache.get(guilds[i]);      
          if(guild) {
            guild.channels.cache.filter(ch => ch.type == "GUILD_VOICE").each(async vc => {
              try{
                  if(client.jointocreatemap.get(`tempvoicechannel_${vc.guild.id}_${vc.id}`) == vc.id){
                      let members = vc.members.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966);
                      if(!members || members == undefined || members.length == undefined || members.length == 0){
                          client.jointocreatemap.delete(`tempvoicechannel_${vc.guild.id}_${vc.id}`);
                          client.jointocreatemap.delete(`owner_${vc.guild.id}_${vc.id}`);
                          //move user
                          if(vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                            vc.delete().catch(e => console.error(e) )
                            console.log(`Deleted the Channel: ${vc.name} in: ${vc.guild ? vc.guild.name : "undefined"} DUE TO EMPTYNESS`.strikethrough.brightRed)
                          } else {
                            console.log(`I couldn't delete the Channel: ${vc.name} in: ${vc.guild ? vc.guild.name : "undefined"} DUE TO EMPTYNESS`.strikethrough.brightRed)
                         }                          
                      }
                  }
              }catch (e){
                 // console.log("Not in db")
              }
            });
          }
      } catch (e) {
          console.error(e)
      }
  }
  return;
}

function create_join_to_create_Channel(client, voiceState, type) {
  let ls = client.settings.get(voiceState.member.guild.id, "language")
  let chname =  client.jtcsettings.get(voiceState.member.guild.id, `jtcsettings${type}.channelname`) || "{user}'s Room";
  
  //CREATE THE CHANNEL
  if (!voiceState.guild.me.permissions.has("MANAGE_CHANNELS")) {
    try {
      voiceState.member.user.send(eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variable10"]))
    } catch {
      try {
        let channel = guild.channels.cache.find(
          channel =>
          channel.type === "GUILD_TEXT" &&
          channel.permissionsFor(guild.me).has("SEND_MESSAGES")
        );
        channel.send(eval(client.la[ls]["handlers"]["functionsjs"]["functions"]["variable11"])).catch(e => console.log("THIS IS TO PREVENT A CRASH"))
      } catch {}
    }
    return;
  }
    const createOptions = {
      type: 'GUILD_VOICE',
      permissionOverwrites: [ {
        //the role "EVERYONE" is just able to VIEW_CHANNEL and CONNECT
        id: voiceState.guild.id,
        allow: ['VIEW_CHANNEL', "CONNECT"],
      } ],
      userLimit: voiceState.channel.userLimit,
      bitrate: voiceState.channel.bitrate,
    };
    //if there is a parent with enough size
    if(voiceState.channel.parent && voiceState.channel.parent.children.size < 50) {
      createOptions.parent = voiceState.channel.parentId;
      createOptions.permissionOverwrites = [
        {
          //the role "EVERYONE" is just able to VIEW_CHANNEL and CONNECT
          id: voiceState.guild.id,
          allow: ['VIEW_CHANNEL', "CONNECT"],
        },
        ... voiceState.channel.parent.permissionOverwrites.cache.values()
      ];
    }
    //add the user
    createOptions.permissionOverwrites.push({
      id: voiceState.id, //the user is allowed to change everything
      allow: ['MANAGE_CHANNELS', "VIEW_CHANNEL", "MANAGE_ROLES", "CONNECT"],
    });
    //remove permissionOverwrites, if needed
    while(createOptions.permissionOverwrites > 100) {
      createOptions.permissionOverwrites.shift();
    }
    const DateNow = Date.now();
    //Create the channel
    voiceState.guild.channels.create(String(chname.replace("{user}", voiceState.member.user.username)).substring(0, 32), createOptions).then(async vc => {
      console.log(`Created the Channel: ${String(chname.replace("{user}", voiceState.member.user.username)).substring(0, 32)} in: ${voiceState.guild ? voiceState.guild.name : "undefined"} after: ${Date.now() - DateNow}ms`.brightGreen)
      //add to the DB
      client.jointocreatemap.set(`owner_${vc.guild.id}_${vc.id}`, voiceState.id);
      client.jointocreatemap.set(`tempvoicechannel_${vc.guild.id}_${vc.id}`, vc.id);
      //move user
      if(vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MOVE_MEMBERS) && voiceState.channel.permissionsFor(voiceState.guild.me).has(Permissions.FLAGS.MOVE_MEMBERS)){
        await voiceState.setChannel(vc);
      }
      /*//move to parent
      if(vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
        await vc.setParent(voiceState.channel.parent)
      }*/
      //add permissions
      if(vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
        await vc.permissionOverwrites.edit(voiceState.id, {
          MANAGE_CHANNELS: true,
          VIEW_CHANNEL: true,
          MANAGE_ROLES: true,
          CONNECT: true,
        }).catch(() => {});
      }
    })
  
}

//OLD VERSION
async function create_transcript(message, client, msglimit) {
  
  let messageCollection = new Collection(); //make a new collection
  let channelMessages = await message.channel.messages.fetch({ //fetch the last 100 messages
    limit: 100
  }).catch(() => {}); //catch any error
  messageCollection = messageCollection.concat(channelMessages); //add them to the Collection
  let tomanymsgs = 1; //some calculation for the messagelimit
  if (Number(msglimit) === 0) msglimit = 100; //if its 0 set it to 100
  let messagelimit = Number(msglimit) / 100; //devide it by 100 to get a counter
  if (messagelimit < 1) messagelimit = 1; //set the counter to 1 if its under 1
  while (channelMessages.size === 100) { //make a loop if there are more then 100 messages in this channel to fetch
    if (tomanymsgs === messagelimit) break; //if the counter equals to the limit stop the loop
    tomanymsgs += 1; //add 1 to the counter
    let lastMessageId = channelMessages.lastKey(); //get key of the already fetched messages above
    channelMessages = await message.channel.messages.fetch({
      limit: 100,
      before: lastMessageId
    }).catch(() => {}); //Fetch again, 100 messages above the already fetched messages
    if (channelMessages) //if its true
      messageCollection = messageCollection.concat(channelMessages); //add them to the collection
  }
  let msgs = messageCollection.map(this_Code_is_by_Tomato_6966 => this_Code_is_by_Tomato_6966).reverse(); //reverse the array to have it listed like the discord chat
  message.channel.send({files: [await create_transcript_buffer(msgs, message.channel, message.guild)]}).catch(()=>{});
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */

 function dbEnsure(db, key, data) {
  if(!db?.has(key)) {
     db?.ensure(key, data);
  } else {
    for(const [Okey, value] of Object.entries(data)) {
      if(!db?.has(key, Okey)) {
        db?.ensure(key, value, Okey);
      } else {
      }
    }
  }
}

function simple_databasing(client, guildid, userid) {
  if(!client || client == undefined || !client.user || client.user == undefined) return;
  try {
    if(guildid && userid){
      dbEnsure(client.stats, guildid+userid, {
        ban: [],
        kick: [],
        mute: [],
        ticket: [],
        says: [],
        warn: [],
      })
    }
    if(userid){
      dbEnsure(client.settings, userid, {
        dm: true,
      })
    }
    if (guildid) { 
      
      dbEnsure(client.musicsettings, guildid, {"channel": "","message": ""});
      dbEnsure(client.customcommands, guildid, {commands: []});
      dbEnsure(client.stats, guildid, {commands: 0,songs: 0});
      dbEnsure(client.settings, guildid, {
        prefix: config.prefix,
        pruning: true,
        requestonly: true,
        autobackup: false,
        unkowncmdmessage: false,
        defaultvolume: 30,
        channel: "773836425678422046",
        language: "en",
        warnsettings: {
          ban: false,
          kick: false,
          roles: [
            /*
            { warncount: 0, roleid: "1212031723081723"}
            */
          ]
        },
        mute: {
          style: "timeout",
          roleId: "",
          defaultTime: 60000,  
        },
        embed: {
          "color": ee.color,
          "thumb": true,
          "wrongcolor": ee.wrongcolor,
          "footertext": client.guilds.cache.has(guildid) ? client.guilds.cache.get(guildid).name : ee.footertext,
          "footericon": client.guilds.cache.has(guildid) ? client.guilds.cache.get(guildid).iconURL({
            dynamic: true
          }) : ee.footericon,
        },
        adminlog: "no",
        reportlog: "no",
        autonsfw: "no",
        dailyfact: "no",
        autoembeds: [],
        adminroles: [],

        volume: "69",
        
        showdisabled: true,

        MUSIC: true,
        FUN: true,
        ANIME: true,
        MINIGAMES: true,
        ECONOMY: true,
        SCHOOL: true,
        NSFW: false,
        VOICE: true,
        RANKING: true,
        PROGRAMMING: true,
        CUSTOMQUEUE: true,
        FILTER: true,
        SOUNDBOARD: true,

        cmdadminroles: {
          removetimeout: [],
          timeout: [],
          idban: [],
          snipe: [],
          addroletorole: [],
          addroletobots: [],
          addroletohumans: [],
          removerolefromrole: [],
          removerolefrombots: [],
          removerolefromhumans: [],
          removerolefromeveryone: [],
          listbackups: [],
          loadbackup: [],
          createbackup: [],
          embed: [],
          editembed: [],
          editimgembed: [],
          imgembed: [],
          useridban: [],
          addrole: [],
          addroletoeveryone: [],
          ban: [],
          channellock: [],
          channelunlock: [],
          clear: [],
          clearbotmessages: [],
          close: [],
          copymessage: [],
          deleterole: [],
          detailwarn: [],
          dm: [],
          editembeds: [],
          editimgembeds: [],
          embeds: [],
          embedbuilder: [],
          esay: [],
          giveaway: [],
          image: [],
          imgembeds: [],
          kick: [],
          mute: [],
          nickname: [],
          unlockthread: [],
          unarchivethread: [],
          lockthread: [],
          archivethread: [],
          leavethread: [],
          lockchannel: [],
          unlockchannel: [],
          jointhread: [],
          jointhreads: [],
          setautoarchiveduration: [],
          tempmute: [],
          permamute: [],
          poll: [],
          react: [],
          removeallwarns: [],
          removerole: [],
          report: [],
          say: [],
          slowmode: [],
          suggest: [],
          ticket: [],
          unmute: [],
          unwarn: [],
          updatemessage: [],
          warn: [],
          warnings: [],
        }, 
        djroles: [],
        djonlycmds: ["autoplay", "clearqueue", "forward", "loop", "jump", "loopqueue", "loopsong", "move", "pause", "resume", "removetrack", "removedupe", "restart", "rewind", "seek", "shuffle", "skip", "stop", "volume"],
        botchannel: [],
      });
    }
    return;
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}


function ensure_economy_user(client, guildid, userid){
    dbEnsure(client.economy, `${guildid}-${userid}`, {
      user: userid,
      work: 0,
      balance: 0,
      bank: 0,
      hourly: 0,
      daily: 0,
      weekly: 0,
      monthly: 0,
      beg: 0,
      crime: 0,
      rob: 0,
      items: {
        yacht: 0, lamborghini: 0, car: 0, motorbike: 0,  bicycle: 0,
        nike: 0, tshirt: 0,
        mansion: 0, house: 0, dirthut: 0,
        pensil: 0, pen: 0, condom: 0, bottle: 0,
        fish: 0, hamster: 0, dog: 0, cat: 0,     
      },
      black_market: {
        boost: {
          time: 0,
          multiplier: 1
        }
      }
    })
    let data = client.economy.get(`${guildid}-${userid}`)
    //reset the blackmarket Booster if it's over!
    if(data.black_market.boost.time !== 0 && (86400000 * 2) - (Date.now() - data.black_market.boost.time) <= 0)
    {
      console.log(`Reset Multiplier from Black Market for: ${userid} | TIME: ${(86400000 * 2) - (Date.now() - data.black_market.boost.time)}`)
      client.economy.set(`${guildid}-${userid}`, 1, "black_market.boost.multiplier");
      client.economy.set(`${guildid}-${userid}`, 0, "black_market.boost.time");
    }  
      
}




















const Parser = require("rss-parser");
const parser = new Parser();
//UGLY STUFF:
async function getLatestVideos(ChannelLink) {
  return new Promise(async (res, rej) => {
      try {
          if (!ChannelLink) return rej("A String is required for the ChannelLink");
          if (typeof ChannelLink !== "string") return rej(`Passed in ${typeof ChannelLink} but a String would be required for the ChannelLink`);
          let channel = await channelInfo(ChannelLink);
          if (!channel) return rej("NO CHANNEL INFORMATION FOUND")
          let content = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel.id}`);
          content = content.items.map(v => {
              var OBJ = {}
              OBJ.title = v.title
              OBJ.link = v.link
              OBJ.pubDate = v.pubDate
              OBJ.author = v.author
              OBJ.id = v.link.split("watch?v=")[1] || v.id,
                  OBJ.isoDate = v.isoDate
              return OBJ;
          })
          let tLastVideos = content.sort((a, b) => {
              let aPubDate = new Date(a.pubDate || 0).getTime();
              let bPubDate = new Date(b?.pubDate || 0).getTime();
              return bPubDate - aPubDate;
          });
          if (tLastVideos.length == 0) return rej("No Videos posted yet")
          return res(tLastVideos);
      } catch (error) {
          return rej(error);
      }
  })
}
module.exports.getLatestVideos = getLatestVideos;
"use strict";
const merge2Obj = (one, two) => {
    for (const key in two) {
        if (Object.prototype.hasOwnProperty.call(two, key)) {
            const ele = two[key];
            if (typeof ele === "object")
                one[key] = merge2Obj(one[key], ele);
            else
                one[key] = ele;
        }
    }
    return one;
};
const mergeObj = (res, ...objs) => {
    objs.forEach((obj) => merge2Obj(res, obj));
    return res;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }
    return new(P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {
        "default": mod
    };
};
const axios_1 = __importDefault(require("axios"));
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.channelInfo = void 0;
/**
 * Get full information about a YouTube channel
 */
const channelInfo = (url, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33;
    if (typeof url !== "string")
        throw new Error(`Expected "url" to be "string" but received "${typeof url}".`);
    if (typeof options !== "object")
        throw new Error(`Expected "options" to be "object" but received "${typeof options}".`);
    options = mergeObj({
        requestOptions: {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0",
            },
        },
    }, options);
    if (!url.startsWith("http"))
        url = `https://www.youtube.com/channel/${url}`;
    let res;
    try {
        res = (yield axios_1.default.get(url, Object.assign(Object.assign({}, options.requestOptions), {
            responseType: "GUILD_TEXT"
        }))).data;
    } catch (err) {
        throw new Error(`Failed to fetch site. (${err})`);
    }
    let initialData;
    try {
        initialData = JSON.parse((_a = res.split("var ytInitialData = ")[1]) === null || _a === void 0 ? void 0 : _a.split(";</script>")[0]);
    } catch (err) {
        throw new Error(`Failed to parse data from script tag. (${err})`);
    }
    /**
     * @INFO
     * Bot Coded by Tomato#6966 | https://discord.gg/milrato
     * @INFO
     * Work for Milrato Development | https://milrato.eu
     * @INFO
     * Please mention him / Milrato Development, when using this Code!
     * @INFO
     */
    
    const channel = {
        name: initialData &&
            initialData.metadata &&
            initialData.metadata.channelMetadataRenderer ?
            initialData.metadata.channelMetadataRenderer.title : undefined,
        id: initialData &&
            initialData.metadata &&
            initialData.metadata.channelMetadataRenderer ?
            initialData.metadata.channelMetadataRenderer.externalId : undefined,
        url: initialData &&
            initialData.metadata &&
            initialData.metadata.channelMetadataRenderer ?
            initialData.metadata.channelMetadataRenderer.channelUrl : undefined,
        rssUrl: initialData &&
            initialData.metadata &&
            initialData.metadata.channelMetadataRenderer ?
            initialData.metadata.channelMetadataRenderer.rssUrl : undefined,
        description: initialData &&
            initialData.metadata &&
            initialData.metadata.channelMetadataRenderer ?
            initialData.metadata.channelMetadataRenderer.description : undefined,
        subscribers: initialData &&
            initialData.header &&
            initialData.header.c4TabbedHeaderRenderer &&
            initialData.header.c4TabbedHeaderRenderer.subscriberCountText ?
            initialData.header.c4TabbedHeaderRenderer.subscriberCountText.simpleText : undefined,
        banner: initialData &&
            initialData.header &&
            initialData.header.c4TabbedHeaderRenderer &&
            initialData.header.c4TabbedHeaderRenderer.banner &&
            initialData.header.c4TabbedHeaderRenderer.banner.thumbnails ?
            initialData.header.c4TabbedHeaderRenderer.banner.thumbnails.sort((a, b) => b?.width - a.width) : undefined,
        tvBanner: initialData &&
            initialData.header &&
            initialData.header.c4TabbedHeaderRenderer &&
            initialData.header.c4TabbedHeaderRenderer.tvBanner &&
            initialData.header.c4TabbedHeaderRenderer.tvBanner.thumbnails ?
            initialData.header.c4TabbedHeaderRenderer.tvBanner.thumbnails.sort((a, b) => b?.width - a.width) : undefined,
        mobileBanner: initialData &&
            initialData.header &&
            initialData.header.c4TabbedHeaderRenderer &&
            initialData.header.c4TabbedHeaderRenderer.mobileBanner &&
            initialData.header.c4TabbedHeaderRenderer.mobileBanner.thumbnails ?
            initialData.header.c4TabbedHeaderRenderer.mobileBanner.thumbnails.sort((a, b) => b?.width - a.width) : undefined,
        tags: initialData &&
            initialData.metadata &&
            initialData.metadata.channelMetadataRenderer ?
            initialData.metadata.channelMetadataRenderer.keywords.split(" ") : undefined,
        videos: ["USE THE FUNCTION: YTP.getLatestVideos(youtubeChannel)"],
        unlisted: initialData &&
            initialData.microformat &&
            initialData.microformat.microformatDataRenderer ?
            initialData.microformat.microformatDataRenderer.unlisted : undefined,
        familySafe: initialData &&
            initialData.metadata &&
            initialData.metadata.channelMetadataRenderer ?
            initialData.metadata.channelMetadataRenderer.isFamilySafe : undefined,
    };
    return channel;
});
module.exports.channelInfo = channelInfo;
