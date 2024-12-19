const { Permissions } = require("discord.js")
module.exports = function (client, options) {
    client.on("messageCreate", message => {
        if(!message.guild || message.guild.available === false || message.author.bot) return;
        client.settings.ensure(message.guild.id, {
          counter: "no",
          counternum: 0,
          counterauthor: ""
        })
        if(message.channel.id == client.settings.get(message.guild.id, `counter`)){
        if(!client.settings.has(message.guild.id, "language")) client.settings.ensure(message.guild.id, { language: "en" });
        let ls = client.settings.get(message.guild.id, "language")
        let count = client.settings.get(message.guild.id, `counternum`);
        let counterauthor = client.settings.get(message.guild.id, `counterauthor`);
        if(isNaN(count)) {
          client.settings.set(message.guild.id, 0, `counternum`)
          count = 0
        };
        if (!message.author.bot && message.author.id === counterauthor) {
          if(message.channel.permissionsFor(message.channel.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)){
            message.delete().catch(() => {})
          } else {
            message.reply(":x: **I am missing the MANAGE_MESSAGES Permission!**").then(m => {
                setTimeout(()=>{m.delete().catch(()=>{})}, 3500)
            })
          }
          message.reply(eval(client.la[ls]["handlers"]["counterjs"]["counter"]["variable1"])).then(m =>  setTimeout(()=>{m.delete()},3000));
          return;
        }
        if (!message.author.bot && isNaN(message.content)) {
          if(message.channel.permissionsFor(message.channel.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)){
            message.delete().catch(() => {})
          } else {
            message.reply(":x: **I am missing the MANAGE_MESSAGES Permission!**").then(m => {
                setTimeout(()=>{m.delete().catch(()=>{})}, 3500)
            })
          }
          message.reply(eval(client.la[ls]["handlers"]["counterjs"]["counter"]["variable2"])).then(m =>  setTimeout(()=>{m.delete()},3000));
          return;
        }
        if (!message.author.bot && parseInt(message.content) !== count + 1) {
          if(message.channel.permissionsFor(message.channel.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)){
            message.delete().catch(() => {})
          } else {
            message.reply(":x: **I am missing the MANAGE_MESSAGES Permission!**").then(m => {
                setTimeout(()=>{m.delete().catch(()=>{})}, 3500)
            })
          }
          message.reply(eval(client.la[ls]["handlers"]["counterjs"]["counter"]["variable3"])).then(m => setTimeout(()=>{m.delete()},3000));
          return;
        }
        client.settings.inc(message.guild.id, `counternum`);
        client.settings.set(message.guild.id, message.author.id, `counterauthor`);
      }
  })
}
