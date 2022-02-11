const { Permissions } = require("discord.js")
const { dbEnsure, dbKeys, dbRemove, delay } = require("./functions")
module.exports = async (client, options) => {
  module.exports.messageCreate = (client, message, guild_settings) => {
    Counter(client, message, guild_settings);
  }
  async function Counter(client, message, guild_settings) {
    if (!message.guild || message.guild.available === false || message.author?.bot) return;
    if (!guild_settings.counter) {
      await dbEnsure(client.settings, message.guild.id, {
        counter: "no",
        counternum: 0,
        counterauthor: ""
      })
      guild_settings.counter = "no";
      guild_settings.counternum = 0;
      guild_settings.counterauthor = "";
    }
    let Settings = guild_settings;
    if (message.channel.id == Settings.counter) {
      let ls = Settings.language
      let count = Settings.counternum;
      let counterauthor = Settings.counterauthor;
      if (isNaN(count)) {
        await client.settings.set(message.guild.id + `.counternum`, 0)
        count = 0
      };
      if (!message.author?.bot && message.author?.id === counterauthor) {
        if (message.channel.permissionsFor(message.channel.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)) {
          message.delete().catch(() => { })
        } else {
          message.reply(":x: **I am missing the MANAGE_MESSAGES Permission!**").then(m => {
            setTimeout(() => { m.delete().catch(() => { }) }, 3500)
          })
        }
        message.reply(eval(client.la[ls]["handlers"]["counterjs"]["counter"]["variable1"])).then(m => setTimeout(() => { m.delete() }, 3000));
        return;
      }
      if (!message.author?.bot && isNaN(message.content)) {
        if (message.channel.permissionsFor(message.channel.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)) {
          message.delete().catch(() => { })
        } else {
          message.reply(":x: **I am missing the MANAGE_MESSAGES Permission!**").then(m => {
            setTimeout(() => { m.delete().catch(() => { }) }, 3500)
          })
        }
        message.reply(eval(client.la[ls]["handlers"]["counterjs"]["counter"]["variable2"])).then(m => setTimeout(() => { m.delete() }, 3000));
        return;
      }
      if (!message.author?.bot && parseInt(message.content) !== count + 1) {
        if (message.channel.permissionsFor(message.channel.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)) {
          message.delete().catch(() => { })
        } else {
          message.reply(":x: **I am missing the MANAGE_MESSAGES Permission!**").then(m => {
            setTimeout(() => { m.delete().catch(() => { }) }, 3500)
          })
        }
        message.reply(eval(client.la[ls]["handlers"]["counterjs"]["counter"]["variable3"])).then(m => setTimeout(() => { m.delete() }, 3000));
        return;
      }
      await client.settings.add(message.guild.id + `.counternum`, 1);
      await client.settings.set(message.guild.id + `.counterauthor`, message.author?.id);
    }
  }
}
