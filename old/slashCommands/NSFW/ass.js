const superagent = require("node-fetch");
const Discord = require('discord.js')
const {
  MessageEmbed,
  MessageAttachment
} = require('discord.js')
const rp = require('request-promise-native');
const config = require(`${process.cwd()}/botconfig/config.json`)
module.exports = {
  name: "ass",
      description: "Get an Ass",
      options: [ 
            //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
            //{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
            //{"User": { name: "which_user", description: "From Which User do you want to get the Avatar?", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
            //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
            //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
            //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
            //{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
      ],
      run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {

    if (!client.settings.get(message.guild.id, "NSFW")) {
      const x = new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {
          prefix: prefix
        }))
      return interaction?.reply({
        embeds: [x], empheral: true
      });
    }
    ////////if (!message.channel.nsfw) return interaction?.reply({content : eval(client.la[ls]["cmds"]["nsfw"]["anal"]["variable2"]), empheral: true})
    return rp.get('http://api.obutts.ru/butts/0/1/random').then(JSON.parse).then(function (res) {
      return rp.get({
        url: 'http://media.obutts.ru/' + res[0].preview,
        encoding: null
      });
    }).then(function (res) {
      let attachment = new MessageAttachment(res, "file.png");
      interaction?.reply({
        files: [attachment],
        ephemeral: true
      });
    });
  }
};