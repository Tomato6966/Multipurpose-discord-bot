const {MessageEmbed, splitMessage} = require("discord.js");
const config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const { parseMilliseconds, duration, GetUser, nFormatter, ensure_economy_user } = require(`../../handlers/functions`)
module.exports = {
  name: "ecolb",
  category: "💸 Economy",
  aliases: ["ecoleaderboard"],
  description: "Shows leaderboard of econmy",
  usage: "ecolb",
  type: "info",
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
        var user = message.author;
        
      //ensure the economy data
      await ensure_economy_user(client, message.guild.id, user.id)
        var users = await client.economy.all().then(d => d.filter(i => String(i.ID).startsWith(message.guild.id)).map(i => i.ID));
        var datas = [];
        for await (const user of users)
          try{
            datas.push(await client.economy.get(user)) 
          }catch{

          }
        var sorted = datas.sort((a, b) => {
          var prizea = 0;
          for (const itemarray in a.items){
            switch(itemarray.toLowerCase()){
              case "yacht": prizea += a.items[`${itemarray}`] *  75000; break;
              case "lamborghini": prizea += a.items[`${itemarray}`] *  50000; break;
              case "car": prizea += a.items[`${itemarray}`] *  6400; break;
              case "motorbike": prizea += a.items[`${itemarray}`] *  1500; break;
              case "bicycle": prizea += a.items[`${itemarray}`] *  500; break;
          
              case "nike": prizea += a.items[`${itemarray}`] *  300; break;
              case "tshirt": prizea += a.items[`${itemarray}`] *  60; break;
          
              case "mansion": prizea += a.items[`${itemarray}`] *  45000; break;
              case "house": prizea += a.items[`${itemarray}`] *  8000; break;
              case "dirthut": prizea += a.items[`${itemarray}`] *  150; break;
          
              case "pensil": prizea += a.items[`${itemarray}`] *  20; break;
              case "pen": prizea += a.items[`${itemarray}`] *  10; break;
              case "condom": prizea += a.items[`${itemarray}`] *  30; break;
              case "bottle": prizea += a.items[`${itemarray}`] *  50; break;
          
              case "fish": prizea += a.items[`${itemarray}`] *  1000; break;
              case "hamster": prizea += a.items[`${itemarray}`] *  1500; break;
              case "dog": prizea += a.items[`${itemarray}`] *  2000; break;
              case "cat": prizea += a.items[`${itemarray}`] *  2000; break;
            }
          }
          var prizeb = 0;
          for (const itemarray in b?.items){
            switch(itemarray.toLowerCase()){
              case "yacht": prizeb += b?.items[`${itemarray}`] * 75000; break;
              case "lamborghini": prizeb += b?.items[`${itemarray}`] *  50000; break;
              case "car": prizeb += b?.items[`${itemarray}`] *  6400; break;
              case "motorbike": prizeb += b?.items[`${itemarray}`] *  1500; break;
              case "bicycle": prizeb += b?.items[`${itemarray}`] *  500; break;
          
              case "nike": prizeb += b?.items[`${itemarray}`] *  300; break;
              case "tshirt": prizeb += b?.items[`${itemarray}`] *  60; break;
          
              case "mansion": prizeb += b?.items[`${itemarray}`] *  45000; break;
              case "house": prizeb += b?.items[`${itemarray}`] *  8000; break;
              case "dirthut": prizeb += b?.items[`${itemarray}`] *  150; break;
          
              case "pensil": prizeb += b?.items[`${itemarray}`] *  20; break;
              case "pen": prizeb += b?.items[`${itemarray}`] *  10; break;
              case "condom": prizeb += b?.items[`${itemarray}`] *  30; break;
              case "bottle": prizeb += b?.items[`${itemarray}`] *  50; break;
          
              case "fish": prizeb += b?.items[`${itemarray}`] *  1000; break;
              case "hamster": prizeb += b?.items[`${itemarray}`] *  1500; break;
              case "dog": prizeb += b?.items[`${itemarray}`] *  2000; break;
              case "cat": prizeb += b?.items[`${itemarray}`] *  2000; break;
            }
          }
          return (b?.balance + b?.bank + prizeb) - (a.balance + a.bank + prizea)
        });
        
        var stringarray = []
        var yourrank = false;
        for (let i = 0; i < sorted.length; i++){
          let index = i;
          const data = sorted[i]
          if(!data.user || data.user == undefined) continue;
          const tuser = await client.users.fetch(data.user).catch(() => null);
          if(!tuser) continue;
          if(user == message.author) {
            if(yourrank && yourrank > index + 1) yourrank = index + 1;
            if(!yourrank) yourrank = index + 1;
          }
          var items = 0;
          var itemsvalue = 0;
          for (const itemarray in data.items){
            items += data.items[`${itemarray}`];
            var prize = 0;
            switch(itemarray.toLowerCase()){
              case "yacht": prize = 75000; break;
              case "lamborghini": prize = 50000; break;
              case "car": prize = 6400; break;
              case "motorbike": prize = 1500; break;
              case "bicycle": prize = 500; break;
          
              case "nike": prize = 300; break;
              case "tshirt": prize = 60; break;
          
              case "mansion": prize = 45000; break;
              case "house": prize = 8000; break;
              case "dirthut": prize = 150; break;
          
              case "pensil": prize = 20; break;
              case "pen": prize = 10; break;
              case "condom": prize = 30; break;
              case "bottle": prize = 50; break;
          
              case "fish": prize = 1000; break;
              case "hamster": prize = 1500; break;
              case "dog": prize = 2000; break;
              case "cat": prize = 2000; break;
            }
            itemsvalue += prize * data.items[`${itemarray}`];
          }
          let theindex = index + 1
          if(theindex == 1) theindex = "🥇"
          if(theindex == 2) theindex = "🥈"
          if(theindex == 3) theindex = "🥉"
          stringarray.push(`**${theindex}. \`${tuser.tag}\`** ・ ${tuser}\`\`\`yml\nPocket: ${nFormatter(Math.floor(data.balance))} 💸 ・ Bank: ${nFormatter(data.bank)} 💸 ・ [${items}] Items: ${nFormatter(itemsvalue)} 💸\`\`\``)
        }
        
        const description = stringarray;
        const TITLE = `${message.guild.name} | Economy Leaderboard 💸`

        let currentPage = 0;
        let embeds = [];
        try {
          let k = 10;
          for (let i = 0; i < description.length; i += 10) {
            const current = description.slice(i, k);
            k += 10;
            const embed = new MessageEmbed()
              .setDescription(current.join("\n"))
              .setTitle(TITLE)
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                
            embeds.push(embed);
          }
          embeds;
        } catch (e){console.error(e)}
        if(embeds.length == 0) return message.reply(":x: No leaderboard yet!**")
        if (embeds.length === 1) return message.reply({embeds: [embeds[0]]}).catch(e => console.log("THIS IS TO PREVENT A CRASH"))
        const queueEmbed = await message.reply(
          {embeds: [embeds[currentPage].setFooter(client.getFooter(`You are: Rank #${yourrank} ・ Page: ${currentPage + 1}/${embeds.length}`, user.displayAvatarURL({dynamic: true})))]}
        ).catch(e => console.log("THIS IS TO PREVENT A CRASH"))
        let reactionemojis = ["⏪", "⏩"];
        try {
          for (const emoji of reactionemojis)
            await queueEmbed.react(emoji);
        } catch {}

        const filter = (reaction, user) =>
          (reactionemojis.includes(reaction.emoji?.name) || reactionemojis.includes(reaction.emoji?.name)) && message.author?.id === user.id;
        const collector = queueEmbed.createReactionCollector({filter, 
          time: 45000
        });

        collector.on("collect", async (reaction, user) => {
          try {
            if (reaction.emoji?.name === reactionemojis[1] || reaction.emoji?.id  === reactionemojis[1]) {
              if (currentPage < embeds.length - 1) {
                currentPage++;
                queueEmbed.edit({embeds: [embeds[currentPage].setFooter(client.getFooter(`You are: Rank #${yourrank} ・ Page: ${currentPage + 1}/${embeds.length}`, user.displayAvatarURL({dynamic: true})))]});
              } else {
                currentPage = 0
                queueEmbed.edit({ embeds: [embeds[currentPage].setFooter(client.getFooter(`You are: Rank #${yourrank} ・ Page: ${currentPage + 1}/${embeds.length}`, user.displayAvatarURL({dynamic: true})))]});
              }
            } else if (reaction.emoji?.name === reactionemojis[0] || reaction.emoji?.id  === reactionemojis[0]) {
              if (currentPage !== 0) {
                --currentPage;
                queueEmbed.edit({ embeds: [embeds[currentPage].setFooter(client.getFooter(`You are: Rank #${yourrank} ・ Page: ${currentPage + 1}/${embeds.length}`, user.displayAvatarURL({dynamic: true})))]});
              } else {
                currentPage = embeds.length - 1
                queueEmbed.edit({ embeds: [embeds[currentPage.setFooter(client.getFooter(`You are: Rank #${yourrank} ・ Page: ${currentPage + 1}/${embeds.length}`, user.displayAvatarURL({dynamic: true})))]]});
              }
            } else {
              collector.stop();
              reaction.message.reactions.removeAll();
            }
            await reaction.users.remove(message.author?.id);
          } catch {}
        });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["ecolb"]["variable1"]))
      ]});
    }
  }
};

