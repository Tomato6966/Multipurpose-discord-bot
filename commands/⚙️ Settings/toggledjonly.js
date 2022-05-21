/*const { MessageEmbed } = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require("../../botconfig/emojis.json");
module.exports = {
    name: "toggledjonly",
    aliases: ["adddjonly", "djonly", "setdjonly", ""],
    category: "⚙️ Settings",
    description: "Set's a Command to the DJ ONLY State, by typing it again, it gets to not DJ ONLY aka its a toggle",
    usage: "adddj @role",
    memberpermissions: ["ADMINISTRATOR"],
    run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
      
    try{
      
      //get the role of the mention
      let cmd = args[0]
      //if no pinged role return error
      if (!cmd)
        return message.reply({embeds :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable2"]))
        ]});

      let musiccmds = [];
      const commands = (category) => {
          return client.commands.filter((cmd) => cmd.category.toLowerCase().includes("music")).map((cmd) => `${cmd.name}`);
      };
      for (let i = 0; i < client.categories.length; i += 1) {
          if (client.categories[i].toLowerCase().includes("music")) {
              musiccmds = commands(client.categories[i]);
          }
      }
      if(musiccmds.join(" ").toLowerCase().split(" ").includes(args[0].toLowerCase())){
          //if its in then its dj only so remove it
          if(client.settings.get(message.guild.id, `djonlycmds`).join(" ").toLowerCase().split(" ").includes(args[0].toLowerCase())){
            try{
              client.settings.remove(message.guild.id, args[0], `djonlycmds`);
              return message.reply({embeds :[new MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable3"]))
                .setDescription(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable4"]))
              ]});
            }catch (e){
              console.error(e);
              return message.reply({embeds :[new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable5"]))
                .setDescription(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable6"]))
              ]});
            }
          }
          else {
            try{
              client.settings.push(message.guild.id, args[0], `djonlycmds`);
              return message.reply({embeds :[new MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable7"]))
                .setDescription(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable8"]))
              ]});
            }catch (e){
              console.error(e);
              return message.reply({embeds : [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(client.getFooter(es))
                .setTitle(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable9"]))
                .setDescription(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable10"]))
              ]});
            }
          }
      }else{
        return message.reply({embeds  :[new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable11"]))
        ]});
      }
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
						.setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.erroroccur)
            .setDescription(eval(client.la[ls]["cmds"]["settings"]["toggledjonly"]["variable12"]))
        ]});
    }
  }
};
*/

