const {MessageEmbed} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { parseMilliseconds, duration, GetUser, nFormatter, ensure_economy_user } = require(`../../handlers/functions`)
module.exports = {
  name: "crime",
  category: "💸 Economy",
  description: "Earn your crime cash",
  usage: "crime @USER",
  type: "game",
  run: async (client, message, args, cmduser, text, prefix, player, es, ls, GuildSettings) => {
    
    
        if(GuildSettings.ECONOMY === false){
          return message.reply({embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`../../handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          ]});
        }
    try {
      //command
      var user = message.author;
      //ensure the economy data
      await ensure_economy_user(client, message.guild.id, user.id)
      //get the economy data 
      let data = await client.economy.get(`${message.guild.id}_${user.id}`)
      //get the delays
      let timeout = 86400000;
      //if the user is on COOLDOWN, return
      if(data.crime !== 0 && timeout - (Date.now() - data.crime) > 0){
        let time = duration(timeout - (Date.now() - data.crime));
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["crime"]["variable1"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["crime"]["variable2"]))]
        });
      } 
      //YEA
      else {
        let amountarray = [300*2, 350*2, 400*2, 340*2, 360*2, 350*2, 355*2, 345*2, 365*2, 350*2, 340*2, 360*2, 325*2, 375*2, 312.5*2, 387.5*2];
        let amount = Math.floor(amountarray[Math.floor((Math.random() * amountarray.length))]);
        amount = amount * data.black_market.boost.multiplier
        //get a random Crime Message
        let crimemsgarray = ["You robbed the Local Bank", "You destroyed the neigbour's mailbox", "You stolen a 24k Clock from the Shop", 
            "You robbed Döner from your Abi", "You kidnapped the sister of your stepmom", "You were driving to fast and escaped the police",
            "You cracked Discord Nitro", "You stole Discord Nitros", "You hacked the local Network", "You hacked the electricity of your town",
            "You crashed TikTok", "You stole Corona Tests", "You stole Masks"
        ];
        let thecrimemsg = crimemsgarray[Math.floor((Math.random() * crimemsgarray.length))];
        //add the Money to the User's Balance in this Guild
        await client.economy.add(`${message.guild.id}_${user.id}.balance`, Number(amount)) 
        //set the current time to the db
        await client.economy.set(`${message.guild.id}_${user.id}.crime`, Date.now())
        //get the new data
        data = await client.economy.get(`${message.guild.id}_${user.id}`)
        //return some message!
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(user.tag, user.displayAvatarURL({ dynamic: true })))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["crime"]["variable3"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["crime"]["variable4"]))
        ]});
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["crime"]["variable5"]))
      ]});
    }
  }
};

