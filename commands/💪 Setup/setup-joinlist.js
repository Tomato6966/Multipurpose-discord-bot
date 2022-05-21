const {
  MessageEmbed, UserFlags
} = require("discord.js");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
var {
  dbEnsure, dbRemove, dbKeys
} = require(`../../handlers/functions`);
module.exports = {
  name: "setup-joinlist",
  category: "💪 Setup",
  aliases: ["joinlist", "setupjoinlist", "joinlist-setup", "joinlistsetup"],
  cooldown: 4,
  usage: "setup-joinlist help / setup-joinlist <type> <action> <data>",
  description: "Manages the Joinlist",
  type: "security",
  run: async (client, message, args, user, text, prefix, player) => {
    
    const { duration } = require(`../../handlers/functions`);
    try {
      // client.settings.get(message.guild.id, "joinlist")
      const validtypes = [`username_contain`, `username_equal`, `userid`, `server_in_common`, `server_not_in_common`, `noavatar`];
      const validactions = [`kick`, `ban`, `timeout`, `setnickname`];

      const type = args[0] ? args[0].toLowerCase() : null;
      const action = args[1] ? args[1].toLowerCase() : null;
      const data = args[2] ? args[2].toLowerCase() : null;

      if(type === "help") {
        return message.reply({ 
          embeds: [
            new MessageEmbed().setColor(es.color)
              .setTitle("Help for joinlist")
              .setDescription(`The Joinlist Command allows you to setup specific Rules for users to succeed, when they join!\n> **The Usage is**: \`${prefix}joinlist <type> <action> <data>\``)
              .addField("Valid Types:", `> ${validtypes.map(d => `\`${d}\``).join(", ")}`)
              .addField("Valid Actions:", `> ${validactions.map(d => `\`${d}\``).join(", ")}`),
            new MessageEmbed().setColor(es.color)
              .setTitle("`username_contain` is used when the joined user's name contains something\n**Examples for the Type: `username_contain`**")
              .setDescription(`> \`${prefix}joinlist username_contain kick <Word_to_contain>\``
              + `\n> \`${prefix}joinlist username_contain ban <Word_to_contain>\``
              + `\n> \`${prefix}joinlist username_contain timeout <Word_to_contain> <Mute_Time>\``
              + `\n> \`${prefix}joinlist username_contain setnickname <Word_to_contain> <New_NICKNAME/{random}>\``
              + `\n**ONE EXAMPLE:**\n> \`${prefix}joinlist username_contain kick bitch\``
              + `\n**ONE EXAMPLE:**\n> \`${prefix}joinlist username_contain timeout bitch 1day+6hours\``
              ),
            new MessageEmbed().setColor(es.color)
              .setTitle("`username_equal` is used when the joined user has the exact same name\n**Examples for the Type: `username_equal`**")
              .setDescription(`> \`${prefix}joinlist username_equal kick <Name_to_be_equal>\``
              + `\n> \`${prefix}joinlist username_equal ban <Name_to_be_equal>\``
              + `\n> \`${prefix}joinlist username_equal timeout <Name_to_be_equal> <Mute_Time>\``
              + `\n> \`${prefix}joinlist username_equal setnickname <Name_to_be_equal> <New_NICKNAME/{random}>\``
              + `\n**ONE EXAMPLE:**\n> \`${prefix}joinlist username_equal ban Raider420\``
              + `\n**ONE EXAMPLE:**\n> \`${prefix}joinlist username_equal timeout Raider420 1day+6hours\``
              ),
            new MessageEmbed().setColor(es.color)
              .setTitle("`userid` is used when the joined user has the exact same id\n**Examples for the Type: `userid`**")
              .setDescription(`> \`${prefix}joinlist userid kick <User_ID>\``
              + `\n> \`${prefix}joinlist userid ban <User_ID>\``
              + `\n> \`${prefix}joinlist userid timeout <User_ID> <Mute_Time>\``
              + `\n> \`${prefix}joinlist userid setnickname <User_ID> <New_NICKNAME/{random}>\``
              + `\n**ONE EXAMPLE:**\n> \`${prefix}joinlist userid kick 310463389736632340\``
              + `\n**ONE EXAMPLE:**\n> \`${prefix}joinlist userid timeout 310463389736632340 1day+6hours\``
              ),
            new MessageEmbed().setColor(es.color)
              .setTitle("`server_in_common` is used when the joined user is on a specific server\n**Examples for the Type: `server_in_common`**")
              .setDescription(`> \`${prefix}joinlist server_in_common kick <Server_ID>\``
              + `\n> \`${prefix}joinlist server_in_common ban <Server_ID>\``
              + `\n> \`${prefix}joinlist server_in_common timeout <Server_ID> <Mute_Time>\``
              + `\n> \`${prefix}joinlist server_in_common setnickname <Server_ID> <New_NICKNAME/{random}>\``
              + `\n**ONE EXAMPLE:**\n> \`${prefix}joinlist userid ban 859482075575746610\``
              + `\n**ONE EXAMPLE:**\n> \`${prefix}joinlist userid timeout 859482075575746610 1day+6hours\``
              ),
            new MessageEmbed().setColor(es.color)
              .setTitle("`server_not_in_common` is used when the joined user is not on a specific server\n**Examples for the Type: `server_not_in_common`**")
              .setDescription(`> \`${prefix}joinlist server_not_in_common kick <Server_ID>\``
              + `\n> \`${prefix}joinlist server_not_in_common ban <Server_ID>\``
              + `\n> \`${prefix}joinlist server_not_in_common timeout <Server_ID> <Mute_Time>\``
              + `\n> \`${prefix}joinlist server_not_in_common setnickname <Server_ID> <New_NICKNAME/{random}>\``
              + `\n**ONE EXAMPLE:**\n> \`${prefix}joinlist userid kick 859482075575746610\``
              + `\n**ONE EXAMPLE:**\n> \`${prefix}joinlist userid timeout 859482075575746610 1day+6hours\``
              ),
            new MessageEmbed().setColor(es.color)
              .setTitle("`noavatar` is used when the joined user is not having an avatar (default discord avatar)\n**Examples for the Type: `noavatar`**")
              .setDescription(`> \`${prefix}joinlist noavatar kick <enable/disable>\``
              + `\n> \`${prefix}joinlist noavatar ban <enable/disable>\``
              + `\n> \`${prefix}joinlist noavatar timeout <enable/disable> <Mute_Time>\``
              + `\n> \`${prefix}joinlist noavatar setnickname <enable/disable> <New_NICKNAME/{random}>\``
              + `\n**ONE EXAMPLE:**\n> \`${prefix}joinlist userid ban enable\``
              + `\n**ONE EXAMPLE:**\n> \`${prefix}joinlist userid timeout enable 1day+6hours\``
              ),
          ]
        })
      }
      if(!type) return message.reply(`:x: **Please provide the joinlist type!**\n> **Get Help:** \`${prefix}joinlist help\`\n> Usage: \`${prefix}joinlist <type> <action> <data>\`\nValid Types: ${validtypes.map(d => `\`${d}\``).join(", ")}\nValid Actions: ${validactions.map(d => `\`${d}\``).join(", ")}`);
      if(!action) return message.reply(`:x: **Please provide the joinlist action!**\n> **Get Help:** \`${prefix}joinlist help\`\n> Usage: \`${prefix}joinlist <type> <action> <data>\`\nValid Types: ${validtypes.map(d => `\`${d}\``).join(", ")}\nValid Actions: ${validactions.map(d => `\`${d}\``).join(", ")}`);
      if(!data) return message.reply(`:x: **Please provide the joinlist data!**\n> **Get Help:** \`${prefix}joinlist help\`\n> Usage: \`${prefix}joinlist <type> <action> <data>\`\nValid Types: ${validtypes.map(d => `\`${d}\``).join(", ")}\nValid Actions: ${validactions.map(d => `\`${d}\``).join(", ")}`);

      if(!validtypes.includes(type)) return message.reply(`:x: **Please a VALID joinlist type!**\n> **Get Help:** \`${prefix}joinlist help\`\n> Usage: \`${prefix}joinlist <type> <action> <data>\`\nValid Types: ${validtypes.map(d => `\`${d}\``).join(", ")}\nValid Actions: ${validactions.map(d => `\`${d}\``).join(", ")}`);
      if(!validactions.includes(action)) return message.reply(`:x: **Please a VALID joinlist action!**\n> **Get Help:** \`${prefix}joinlist help\`\n> Usage: \`${prefix}joinlist <type> <action> <data>\`\nValid Types: ${validtypes.map(d => `\`${d}\``).join(", ")}\nValid Actions: ${validactions.map(d => `\`${d}\``).join(", ")}`);

      await dbEnsure(client.settings, message.guild.id, {
        joinlist: {
          username_contain: [/*
            {
              data: "",
              action: ""
            } 
          */],
          username_equal: [],
          userid: [],
          server_in_common: [],
          server_not_in_common: [],
          noavatar: []
        }
      });

      const joinlist = await client.settings.get(message.guild.id, "joinlist");
      //remove
      if(joinlist[type].filter((d) => d.action == action).map(d => d.data).includes(data)) {
        var index = joinlist[type].findIndex(d => d.action == action && d.data == data);
        if(index > -1){
          joinlist[type].splice(index, 1);
          await client.settings.set(message.guild.id+".joinlist", joinlist);
          message.reply(`Successfully removed \`${data}\` from the action \`${action}\` from the \`${type}\``);
        } else {
          message.reply("Could not find it in the db");
        }
      } 
      //add
      else {
        switch(validtypes.indexOf(type)) {
          case 0: { //username_contain
            //  joinlist username_contain setnickname GUILD_ID <new_nickname/{random}>
            if(action == "setnickname") {
              const nickname = args[3] ? args.slice(3).join(" ") : null;
              if(!nickname || nickname.length > 32) return message.reply("For the action `setnickname` a Nickname must be provided at the very end (after the data), which is less than 32 Characters, insert `{random}`, so that the nickname will randomly be choosen!");
              joinlist[type].push({data, action, nickname});
              await client.settings.set(message.guild.id+".joinlist", joinlist);
              message.reply(`If a User's name contains \`${data}\` then his nickname will be changed to ${nickname} (\`${type}\`)`);
            } else if(action == "timeout"){
              const dur = args[3] ? args.slice(3).join("") : null;
              let time = 0;
              const ms = require("ms");
              try {
                if(dur.includes("+")){
                  for await (const d of dur.split("+")){
                    try {
                      time += ms(d.trim());
                    } catch {
                      time = "NAN"
                    }
                  }
                } else {
                  time = ms(dur);
                }
              } catch {
                time = "NAN"
              }
              if(!time || time < 10 || time == "NAN") return message.reply("For the action `timeout` a timeout duration must be provided at the very end (after the data), For example: 1day, if you want multiple timeouts than do: 1day+10min");
              joinlist[type].push({data, action, time});
              await client.settings.set(message.guild.id+".joinlist", joinlist);
              message.reply(`If a User's name contains \`${data}\` then he will be \`${action}ed\` for ${duration(time).map(d => `\`${d}\``).join(", ")} (\`${type}\`)`);
            } else {
              const days = args[3] && !isNaN(args[3]) ? Number(args[3]) : 0;
              joinlist[type].push({data, action, days});
              await client.settings.set(message.guild.id+".joinlist", joinlist);
              message.reply(`If a User's name contains \`${data}\` then he will be \`${action}ed\` ${action == "ban" ? `for ${days !== 0 ? `${days} Days` : `ever! (Optional: add days afterwards)`}` : ``} (\`${type}\`)`);
            }
          } break;
          case 1: { //username_equal
            //  joinlist username_equal setnickname GUILD_ID <new_nickname/{random}>
            if(action == "setnickname") {
              const nickname = args[3] ? args.slice(3).join(" ") : null;
              if(!nickname || nickname.length > 32) return message.reply("For the action `setnickname` a Nickname must be provided at the very end (after the data), which is less than 32 Characters, insert `{random}`, so that the nickname will randomly be choosen!");
              joinlist[type].push({data, action, nickname});
              await client.settings.set(message.guild.id+".joinlist", joinlist);
              message.reply(`If a User has the name \`${data}\` then his nickname will be changed to ${nickname} (\`${type}\`)`);
            } else if(action == "timeout"){
              const dur = args[3] ? args.slice(3).join("") : null;
              let time = 0;
              const ms = require("ms");
              try {
                if(dur.includes("+")){
                  for await (const d of dur.split("+")){
                    try {
                      time += ms(d.trim());
                    } catch {
                      time = "NAN"
                    }
                  }
                } else {
                  time = ms(dur);
                }
              } catch {
                time = "NAN"
              }
              if(!time || time < 10 || time == "NAN") return message.reply("For the action `timeout` a timeout duration must be provided at the very end (after the data), For example: 1day, if you want multiple timeouts than do: 1day+10min");
              joinlist[type].push({data, action, time});
              await client.settings.set(message.guild.id+".joinlist", joinlist);
              message.reply(`If a User has the name \`${data}\` then he will be \`${action}ed\` for ${duration(time).map(d => `\`${d}\``).join(", ")} (\`${type}\`)`);
            } else {
              const days = args[3] && !isNaN(args[3]) ? Number(args[3]) : 0;
              joinlist[type].push({data, action, days});
              await client.settings.set(message.guild.id+".joinlist", joinlist);
              message.reply(`If a User has the name \`${data}\` then he will be \`${action}ed\` ${action == "ban" ? `for ${days !== 0 ? `${days} Days` : `ever! (Optional: add days afterwards)`}` : ``} (\`${type}\`)`);
            }
          } break;
          case 2: { //userid
            if(data.length > 19 || data.length < 17) {
              return message.reply(`Valid Datas for \`${action}\` are \`USER_IDS\`\nA User ID is between 17 and 19 characters long!`);
            }
            //  joinlist userid setnickname GUILD_ID <new_nickname/{random}>
            if(action == "setnickname") {
              const nickname = args[3] ? args.slice(3).join(" ") : null;
              if(!nickname || nickname.length > 32) return message.reply("For the action `setnickname` a Nickname must be provided at the very end (after the data), which is less than 32 Characters, insert `{random}`, so that the nickname will randomly be choosen!");
              joinlist[type].push({data, action, nickname});
              await client.settings.set(message.guild.id+".joinlist", joinlist);
              message.reply(`If a User has the id \`${data}\` then his nickname will be changed to ${nickname} (\`${type}\`)`);
            } else if(action == "timeout"){
              const dur = args[3] ? args.slice(3).join("") : null;
              let time = 0;
              const ms = require("ms");
              try {
                if(dur.includes("+")){
                  for await (const d of dur.split("+")){
                    try {
                      time += ms(d.trim());
                    } catch {
                      time = "NAN"
                    }
                  }
                } else {
                  time = ms(dur);
                }
              } catch {
                time = "NAN"
              }
              if(!time || time < 10 || time == "NAN") return message.reply("For the action `timeout` a timeout duration must be provided at the very end (after the data), For example: 1day, if you want multiple timeouts than do: 1day+10min");
              joinlist[type].push({data, action, time});
              await client.settings.set(message.guild.id+".joinlist", joinlist);
              message.reply(`If a User has the id \`${data}\` then he will be \`${action}ed\` for ${duration(time).map(d => `\`${d}\``).join(", ")} (\`${type}\`)`);
            } else {
              const days = args[3] && !isNaN(args[3]) ? Number(args[3]) : 0;
              joinlist[type].push({data, action, days});
              await client.settings.set(message.guild.id+".joinlist", joinlist);
              message.reply(`If a User has the id \`${data}\` then he will be \`${action}ed\` ${action == "ban" ? `for ${days !== 0 ? `${days} Days` : `ever! (Optional: add days afterwards)`}` : ``} (\`${type}\`)`);
            }
          } break;
          case 3: { //server_in_common
            if(data.length > 19 || data.length < 17) {
              return message.reply(`Valid Datas for \`${action}\` are \`GUILD_IDS\`\nThe Users are not allowed to be in the provided Guild ID!\nA Guildid is between 17 and 19 characters long!`);
            }
            if(!client.guilds.cache.has(data)) {
              return message.reply(`I must be on that Guild!`);
            }
            //  joinlist server_in_common setnickname GUILD_ID <new_nickname/{random}>
            if(action == "setnickname") {
              const nickname = args[3] ? args.slice(3).join(" ") : null;
              if(!nickname || nickname.length > 32) return message.reply("For the action `setnickname` a Nickname must be provided at the very end (after the data), which is less than 32 Characters, insert `{random}`, so that the nickname will randomly be choosen!");
              joinlist[type].push({data, action, nickname});
              await client.settings.set(message.guild.id+".joinlist", joinlist);
              message.reply(`If a User is in the Guild \`${client.guilds.cache.get(data) ? client.guilds.cache.get(data).name : data}\` then his nickname will be changed to ${nickname} (\`${type}\`)`);
            } else if(action == "timeout"){
              const dur = args[3] ? args.slice(3).join("") : null;
              let time = 0;
              const ms = require("ms");
              try {
                if(dur.includes("+")){
                  for await (const d of dur.split("+")){
                    try {
                      time += ms(d.trim());
                    } catch {
                      time = "NAN"
                    }
                  }
                } else {
                  time = ms(dur);
                }
              } catch {
                time = "NAN"
              }
              if(!time || time < 10 || time == "NAN") return message.reply("For the action `timeout` a timeout duration must be provided at the very end (after the data), For example: 1day, if you want multiple timeouts than do: 1day+10min");
              joinlist[type].push({data, action, time});
              await client.settings.set(message.guild.id+".joinlist", joinlist);
              message.reply(`If a User is in the Guild \`${client.guilds.cache.get(data) ? client.guilds.cache.get(data).name : data}\` then he will be \`${action}ed\` for ${duration(time).map(d => `\`${d}\``).join(", ")} (\`${type}\`)`);
            } else {
              const days = args[3] && !isNaN(args[3]) ? Number(args[3]) : 0;
              joinlist[type].push({data, action, days});
              await client.settings.set(message.guild.id+".joinlist", joinlist);
              message.reply(`If a User is in the Guild \`${client.guilds.cache.get(data) ? client.guilds.cache.get(data).name : data}\` then he will be \`${action}ed\` ${action == "ban" ? `for ${days !== 0 ? `${days} Days` : `ever! (Optional: add days afterwards)`}` : ``} (\`${type}\`)`);
            }
          } break;
          case 4: { //server_not_in_common
            if(data.length > 19 || data.length < 17) {
              return message.reply(`Valid Datas for \`${action}\` are \`GUILD_IDS\`\nThe Users are not allowed to be in the provided Guild ID!\nA Guildid is between 17 and 19 characters long!`);
            }
            if(!client.guilds.cache.has(data)) {
              return message.reply(`I must be on that Guild!`);
            }
            //  joinlist server_not_in_common setnickname GUILD_ID <new_nickname/{random}>
            if(action == "setnickname") {
              const nickname = args[3] ? args.slice(3).join(" ") : null;
              if(!nickname || nickname.length > 32) return message.reply("For the action `setnickname` a Nickname must be provided at the very end (after the data), which is less than 32 Characters, insert `{random}`, so that the nickname will randomly be choosen!");
              joinlist[type].push({data, action, nickname});
              await client.settings.set(message.guild.id+".joinlist", joinlist);
              message.reply(`If a User is not in the Guild \`${client.guilds.cache.get(data) ? client.guilds.cache.get(data).name : data}\` then his nickname will be changed to ${nickname} (\`${type}\`)`);
            } else if(action == "timeout"){
              const dur = args[3] ? args.slice(3).join("") : null;
              let time = 0;
              const ms = require("ms");
              try {
                if(dur.includes("+")){
                  for await (const d of dur.split("+")){
                    try {
                      time += ms(d.trim());
                    } catch {
                      time = "NAN"
                    }
                  }
                } else {
                  time = ms(dur);
                }
              } catch {
                time = "NAN"
              }
              if(!time || time < 10 || time == "NAN") return message.reply("For the action `timeout` a timeout duration must be provided at the very end (after the data), For example: 1day, if you want multiple timeouts than do: 1day+10min");
              joinlist[type].push({data, action, time});
              message.reply(`If a User is not in the Guild \`${client.guilds.cache.get(data) ? client.guilds.cache.get(data).name : data}\` then he will be \`${action}ed\` for ${duration(time).map(d => `\`${d}\``).join(", ")} (\`${type}\`)`);
            } else {
              const days = args[3] && !isNaN(args[3]) ? Number(args[3]) : 0;
              joinlist[type].push({data, action, days});
              await client.settings.set(message.guild.id+".joinlist", joinlist);
              message.reply(`If a User is not in the Guild \`${client.guilds.cache.get(data) ? client.guilds.cache.get(data).name : data}\` then he will be \`${action}ed\` ${action == "ban" ? `for ${days !== 0 ? `${days} Days` : `ever! (Optional: add days afterwards)`}` : ``} (\`${type}\`)`);
            }
          } break;
          case 5: { //noavatar
            const validdatas = ["enable", "disable"];
            if(!validdatas.includes(data)) {
              return message.reply(`Valid Datas for \`${action}\` are ${validdatas.map(d => `\`${d}\``).join(", ")}`)
            }

            if(action == "setnickname") {
              const nickname = args[3] ? args.slice(3).join(" ") : null;
              if(!nickname || nickname.length > 32) return message.reply("For the action `setnickname` a Nickname must be provided at the very end (after the data), which is less than 32 Characters, insert `{random}`, so that the nickname will randomly be choosen!");
              joinlist[type].push({data, action, nickname});
              await client.settings.set(message.guild.id+".joinlist", joinlist);
              message.reply(`If a User has no Avatar then his Nickname will be ${data == "enable" ? "" : "__not__ (disable)"} changed to: ${nickname} (\`${type}\`)`);
            } else if(action == "timeout"){
              const dur = args[3] ? args.slice(3).join("") : null;
              let time = 0;
              const ms = require("ms");
              try {
                if(dur.includes("+")){
                  for await (const d of dur.split("+")){
                    try {
                      time += ms(d.trim());
                    } catch {
                      time = "NAN"
                    }
                  }
                } else {
                  time = ms(dur);
                }
              } catch {
                time = "NAN"
              }
              if(!time || time < 10 || time == "NAN") return message.reply("For the action `timeout` a timeout duration must be provided at the very end (after the data), For example: 1day, if you want multiple timeouts than do: 1day+10min");
              joinlist[type].push({data, action, time});
              await client.settings.set(message.guild.id+".joinlist", joinlist);
              message.reply(`If a User has no Avatar then he will be \`${action}ed\` for ${duration(time).map(d => `\`${d}\``).join(", ")} (\`${type}\`)`);
            } else {
              const days = args[3] && !isNaN(args[3]) ? Number(args[3]) : 0;
              joinlist[type].push({data, action, days});
              await client.settings.set(message.guild.id+".joinlist", joinlist);
              message.reply(`If a User has no Avatar then he will be \`${action}ed\` ${action == "ban" ? `for ${days !== 0 ? `${days} Days` : `ever! (Optional: add days afterwards)`}` : ``} (\`${type}\`)`);
            }


          } break;
        }
        message.channel.send(`**GENERAL MESSAGE:** Successfully added \`${data}\` to the action \`${action}\` & to the Type: \`${type}\``);
      }

    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setFooter(client.getFooter(es)).setColor(es.wrongcolor)
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["afk"]["variable3"]))
      ]});
    }
  }
}

