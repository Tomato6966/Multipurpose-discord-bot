var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-commands",
  category: "💪 Setup",
  aliases: ["setupcommands", "setup-command", "setupcommand"],
  cooldown: 5,
  usage: "setup-commands  -->  Follow the Steps",
  description: "Enable/Disable specific Commands",
  memberpermissions: ["ADMINISTRATOR"],
  type: "info",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      function getMenuOptions() {
        return [
          {
            label: "ECONOMY",
            value: "ECONOMY",
            emoji: "💸",
            description: `${client.settings.get(message.guild.id, "ECONOMY") ? "❌ Disable ECONOMY Commands" : "✅ Enable ECONOMY Commands"}`
          },
          {
            label: "SCHOOL",
            value: "SCHOOL",
            emoji: "🏫",
            description: `${client.settings.get(message.guild.id, "SCHOOL") ? "❌ Disable SCHOOL Commands" : "✅ Enable SCHOOL Commands"}`
          },
          {
            label: "MUSIC",
            value: "MUSIC",
            emoji: "🎶",
            description: `${client.settings.get(message.guild.id, "MUSIC") ? "❌ Disable Music Commands" : "✅ Enable Music Commands"}`
          },
          {
            label: "FILTER",
            value: "FILTER",
            emoji: "👀",
            description: `${client.settings.get(message.guild.id, "FILTER") ? "❌ Disable FILTER Commands" : "✅ Enable FILTER Commands"}`
          },
          {
            label: "CUSTOMQUEUE",
            value: "CUSTOMQUEUE",
            emoji: "⚜️",
            description: `${client.settings.get(message.guild.id, "CUSTOMQUEUE") ? "❌ Disable CUSTOM-QUEUE Commands" : "✅ Enable CUSTOM-QUEUE Commands"}`
          },
          {
            label: "PROGRAMMING",
            value: "PROGRAMMING",
            emoji: "⌨️",
            description: `${client.settings.get(message.guild.id, "PROGRAMMING") ? "❌ Disable PROGRAMMING Commands" : "✅ Enable PROGRAMMING Commands"}`
          },
          {
            label: "RANKING",
            value: "RANKING",
            emoji: "📈",
            description: `${client.settings.get(message.guild.id, "RANKING") ? "❌ Disable RANKING Commands" : "✅ Enable RANKING Commands"}`
          },
          {
            label: "SOUNDBOARD",
            value: "SOUNDBOARD",
            emoji: "🔊",
            description: `${client.settings.get(message.guild.id, "SOUNDBOARD") ? "❌ Disable SOUNDBOARD Commands" : "✅ Enable SOUNDBOARD Commands"}`
          },
          {
            label: "VOICE",
            value: "VOICE",
            emoji: "🎤",
            description: `${client.settings.get(message.guild.id, "VOICE") ? "❌ Disable VOICE Commands" : "✅ Enable VOICE Commands"}`
          },
          {
            label: "FUN",
            value: "FUN",
            emoji: "🕹️",
            description: `${client.settings.get(message.guild.id, "FUN") ? "❌ Disable FUN Commands" : "✅ Enable FUN Commands"}`
          },
          {
            label: "MINIGAMES",
            value: "MINIGAMES",
            emoji: "🎮",
            description: `${client.settings.get(message.guild.id, "MINIGAMES") ? "❌ Disable MINIGAMES Commands" : "✅ Enable MINIGAMES Commands"}`
          },
          {
            label: "ANIME",
            value: "ANIME",
            emoji: "😳",
            description: `${client.settings.get(message.guild.id, "ANIME") ? "❌ Disable ANIME Commands" : "✅ Enable ANIME Commands"}`
          },
          {
            label: "NSFW",
            value: "NSFW",
            emoji: "🔞",
            description: `${client.settings.get(message.guild.id, "NSFW") ? "❌ Disable NSFW Commands" : "✅ Enable NSFW Commands"}`
          },
        ];
      }
      function getMenuRowComponent() { 
        let menuOptions = getMenuOptions();
        let menuSelection = new MessageSelectMenu()
          .setCustomId("MenuSelection")
          .setPlaceholder("Click: enable/disable Command-Categories")
          .setMinValues(1)
          .setMaxValues(menuOptions.length)
          .addOptions(menuOptions.filter(Boolean))
        return [new MessageActionRow().addComponents(menuSelection)]
      }


      let embed = new Discord.MessageEmbed()
        .setTitle(`Setup the allowed/not-allowed Command-Categories of this Server`)
        .setColor(es.color)
        .setDescription(`**In the selection down below all Categories are listed**\n\n**Select it to either disable/enable it!**\n\n**You can select all (*at least 1*) Command-Categories if you want to disable/enable all of them at once!**`)

       //Send message with buttons
      let msg = await message.reply({   
        embeds: [embed], 
        components: getMenuRowComponent()
      });
      const collector = msg.createMessageComponentCollector({filter: (i) => i?.isSelectMenu() && i?.user && i?.message.author.id == client.user.id, time: 180e3, max: 1 });
      collector.on("collect", async b => {
        if(b?.user.id !== message.author.id)
        return b?.reply({content: ":x: Only the one who typed the Command is allowed to select Things!", ephemeral: true});
     
        let enabled = 0, disabled = 0;
        for(const value of b?.values) {
          let oldstate = client.settings.get(message.guild.id, `${value.toUpperCase()}`);
          if(!oldstate) enabled++;
          else disabled++;
          client.settings.set(message.guild.id, !oldstate, `${value.toUpperCase()}`)
        }
        b?.reply(`<a:yes:833101995723194437> **\`Enabled ${enabled} Command-Categories\` and \`Disabled ${disabled} Command-Categories\` out of \`${b?.values.length} selected Command-Categories\`**`)
      })
      collector.on('end', collected => {
        msg.edit({content: ":x: Time ran out/Input finished! Cancelled", embeds: [
          msg.embeds[0]
            .setDescription(`${getMenuOptions().map(option => `> ${option.emoji} **${option.value}-Commands**: ${option.description.split(" ")[0] != "❌" ? `\`Are now disabled [❌]\`` : `\`Are now enabled [✅]\``}`).join("\n\n")}`)
        ], components: []}).catch((e)=>{})
      });
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-commands"]["variable5"]))
      ]});
    }
  },
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
