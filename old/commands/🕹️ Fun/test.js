const Discord = require("discord.js");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const request = require("request");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
  module.exports = {
    name: "test",
    aliases: [""],
    category: "🕹️ Fun",
    description: "IMAGE CMD",
    usage: "test @User",
    type: "user",
    run: async (client, message, args, cmduser, text, prefix) => {
    
      let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        if(!client.settings.get(message.guild.id, "FUN")){
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          ]});
        }
        //send loading message
        var tempmsg = await message.reply({embeds : [new MessageEmbed()
          .setColor(ee.color)
          .setAuthor( 'Getting Image Data..', 'https://images-ext-1.discordapp.net/external/ANU162U1fDdmQhim_BcbQ3lf4dLaIQl7p0HcqzD5wJA/https/cdn.discordapp.com/emojis/756773010123522058.gif')
        ]});
        //get pinged user, if not then use cmd user
        var user = message.mentions.users.first();
        //if user pinged, shift the args, 
        if(user) args.shift();
        //else not and define the user to be message.author
        else user = message.author;
        //get avatar of the user
        var avatar = user.displayAvatarURL({ format: "png" });
        //get the additional text
        var text = args.join(" ");
        const canvacord = require("canvacord");
        const duration = 2.6 * 60 * 1000;
        const position = ((Math.random() * 2.4 * 60) + 0.2) * 1000;
        var now = Date.now()
        const data = {
            author: user.username,
            title: text ? text : "UNKNOWN SONG",
            start: now -position, 
            end: now + duration,
            image: avatar
        }
        const card = new canvacord.Spotify()
            .setAuthor(data.author)
            .setStartTimestamp(data.start)
            .setEndTimestamp(data.end)
            .setImage(data.image)
            .setTitle(data.title);

        const image = await card.build()
        var attachment = new MessageAttachment(image, "spotify.png");
        //delete old message
        tempmsg.delete();
        //send new Message
        message.reply({embeds :[tempmsg.embeds[0]
        .setAuthor(`Command for: ${message.author.tag}`, message.author.displayAvatarURL({dynamic:true}))
        .setColor(es.color)
        .setImage("attachment://spotify.png")
        ], files : [attachment]}).catch(() => {})
        
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
  