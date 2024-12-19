const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
const customEmojis = require(`${process.cwd()}/botconfig/customEmojis.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  TrackUtils
} = require("erela.js");
const {
  format,
  delay,
  swap_pages,
  swap_pages2,
  shuffle
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: `savedqueue`,
  category: `⚜️ Custom Queue(s)`,
  aliases: [`savequeue`, `customqueue`, `savedqueue`],
  description: `Saves the Current Queue onto a Name`,
  extracustomdesc: "\`savedqueue create\`, \`savedqueue addcurrenttrack\`, \`savedqueue addcurrentqueue\`, \`savedqueue removetrack\`, \`savedqueue removedupes\`, \`savedqueueshowall\`, \`savedqueue showdetails\`, \`savedqueue createsave\`, \`savedqueue delete\`, \`savedqueue play\`, \`savedqueue shuffle\`",
  usage: `\`savedqueue <Type> <Name> [Options]\`\n
**Types**:
> \`create\`, \`addcurrenttrack\`, \`addcurrentqueue\`, \`removetrack\`, \`removedupes\`, \`showall\`, \`showdetails\`, \`createsave\`, \`delete\`, \`play\`, \`shuffle\`
**Name**:
> \`Can be anything with maximum of 10 Letters\`
**Options**:
> \`pick the track which you want to remove\``,

  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        if(!client.settings.get(message.guild.id, "MUSIC")){
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          ]});
        }
    try {
      let Type = args[0];
      let Name = args[1];
      let Options = args.slice(2).join(` `);
      if (!Type)
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable1"].replace(":no:", customEmojis.general.no)))
          .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable2"]))
        ]});
      switch (Type.toLowerCase()) {
        case `create`: {
          if (!Name)
            return message.reply({embeds :[new MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.getFooter(es))
              .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable3"].replace(":no:", customEmojis.general.no)))
              .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable4"]))
            ]});
          if (Name.length > 10)
            return message.reply({embeds : [new MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.user.username, ee.footericon)
              .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable5"].replace(":no:", customEmojis.general.no)))
              .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable6"]))
            ]});
          //if the queue does not exist yet, error
          if (client.queuesaves.get(message.author.id, `${Name}`))
            return message.reply({embeds :[new MessageEmbed()
              .setFooter(client.getFooter(es))
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable7"].replace(":no:", customEmojis.general.no)))
              .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable8"]))
            ]});
          client.queuesaves.set(message.author.id, {
            "TEMPLATEQUEUEINFORMATION": [`queue`, `sadasd`]
          }, `${Name}`)
          //return susccess message
          return message.reply({embeds :[new MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable9"].replace(":yes:", customEmojis.general.yes)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable10"]))
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setFooter(client.getFooter(es))
          ]} )
        }
        break;
      case `addcurrenttrack`: {
        if (!Name)
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable11"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable12"]))
          ]});
        if (Name.length > 10)
          return message.reply({embeds :[new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.user.username, ee.footericon)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable13"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable14"]))
          ]});
        //if the queue does not exist yet, error
        if (!client.queuesaves.get(message.author.id, `${Name}`))
          return message.reply({embeds : [new MessageEmbed()
            .setFooter(client.getFooter(es))
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable15"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable16"]))
          ]});
        //get the player instance
        var player = client.manager.players.get(message.guild.id);
        //if no player available return error | aka not playing anything
        if (!player)
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.user.username, ee.footericon)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable17"].replace(":no:", customEmojis.general.no)))
          ]});
        //get the current track
        const track = player.queue.current;
        //if there are no other tracks, information
        if (!track)
          return message.reply({embeds : [new MessageEmbed()
            .setFooter(client.getFooter(es))
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable18"].replace(":no:", customEmojis.general.no)))
          ]});
        let oldtracks = client.queuesaves.get(message.author.id, `${Name}`);
        if (!Array.isArray(oldtracks)) oldtracks = [];
        //add the track
        oldtracks.push({
          "title": track.title,
          "url": track.uri
        })
        //save it in the db
        client.queuesaves.set(message.author.id, oldtracks, `${Name}`);
        //return susccess message
        return message.reply({embeds : [new MessageEmbed()
          .setTitle(`${customEmojis.general.yes} Added ${track.title} onto the Queue \`${Name}\``.substring(0, 256))
          .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable19"]))
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(es))]})  }
      break;
      case `addcurrentqueue`: {
        if (!Name)
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable20"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable21"]))
          ]});
        if (Name.length > 10)
          return message.reply({embeds :[new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.user.username, ee.footericon)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable22"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable23"]))
          ]});
        //if the queue does not exist yet, error
        if (!client.queuesaves.get(message.author.id, `${Name}`))
          return message.reply({embeds :[new MessageEmbed()
            .setFooter(client.getFooter(es))
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable24"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable25"]))
          ]});
        //get the player instance
        var player = client.manager.players.get(message.guild.id);
        //if no player available return error | aka not playing anything
        if (!player)
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.user.username, ee.footericon)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable26"].replace(":no:", customEmojis.general.no)))
          ]});
        //get all tracks
        const tracks = player.queue;
        //if there are no other tracks, information
        if (!tracks.length)
          return message.reply({embeds : [new MessageEmbed()
            .setFooter(client.getFooter(es))
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable27"].replace(":no:", customEmojis.general.no)))
          ]});
        //get the old tracks from the Name
        let oldtracks = client.queuesaves.get(message.author.id, `${Name}`);
        if (!Array.isArray(oldtracks)) oldtracks = [];
        const newtracks = [];

        for (const track of tracks)
          newtracks.push({
            "title": track.title,
            "url": track.uri
          });

        if (player.queue.current) newtracks.push({
          "title": player.queue.current.title,
          "url": player.queue.current.uri
        });
        //define the new customqueue by adding the newtracks to the old tracks
        let newqueue = oldtracks.concat(newtracks)
        //save the newcustomqueue into the db
        client.queuesaves.set(message.author.id, newqueue, `${Name}`);
        //return susccess message
        return message.reply({embeds : [new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable28"].replace(":yes:", customEmojis.general.yes)))
          .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable29"]))
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(es))
        ]})
      }
      break;
      case `removetrack`:
      case `removesong`: {
        if (!Name)
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable30"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable31"]))
          ]});
        if (Name.length > 10)
          return message.reply({embeds :[new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.user.username, ee.footericon)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable32"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable33"]))
          ]});
        if (!Options)
          return message.reply({embeds :[new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable34"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable35"]))
          ]});
        //if the queue already exists, then errors
        if (!client.queuesaves.get(message.author.id, `${Name}`))
          return message.reply({embeds : [new MessageEmbed()
            .setFooter(client.getFooter(es))
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable36"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable37"]))
          ]});
        let tracks = client.queuesaves.get(message.author.id, `${Name}`);
        if (Number(Options) >= tracks.length || Number(Options) < 0)
          return message.reply({embeds :[new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable38"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable39"]))
          ]})
        let deletetrack = tracks[Number(Options)];
        //delete it
        delete tracks[Number(Options)]
        //remove empty spaces
        tracks = tracks.filter(function (entry) {
          return /\S/.test(entry);
        });
        //save it on the db again
        client.queuesaves.set(message.author.id, tracks, `${Name}`)
        //return susccess message
        return message.reply({embeds :[new MessageEmbed()
          .setTitle(`${customEmojis.general.yes} Deleted ${deletetrack.title} of the Queue \`${Name}\``.substring(0, 256))
          .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable40"]))
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(es))
        ]});
      }
      break;
      case `shuffle`:
      case `mix`: {
        if (!Name)
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable41"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable42"]))
          ]});
        if (Name.length > 10)
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.user.username, ee.footericon)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable43"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable44"]))
          ]});
        //if the queue already exists, then errors
        if (!client.queuesaves.get(message.author.id, `${Name}`))
          return message.reply({embeds : [new MessageEmbed()
            .setFooter(client.getFooter(es))
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable45"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable46"]))
          ]} );
        let oldtracks = client.queuesaves.get(message.author.id, `${Name}`);
        if (!Array.isArray(oldtracks))
          return message.reply({embeds: [new MessageEmbed()
            .setFooter(client.getFooter(es))
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable47"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable48"]))
          ]});
        const newtracks = shuffle(oldtracks);
        //save it in the db
        client.queuesaves.set(message.author.id, newtracks, `${Name}`);
        //return susccess message
        return message.reply({embeds : [new MessageEmbed()
          .setTitle(`${customEmojis.general.yes} Shuffled ${newtracks.length} Tracks of the Queue \`${Name}\``.substring(0, 256))
          .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable49"]))
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(es))]})
      }
      break;
      case `removedupes`:
      case `removeduplicates`: {
        if (!Name)
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable50"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable51"]))
          ]});
        if (Name.length > 10)
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.user.username, ee.footericon)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable52"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable53"]))
          ]});
        //if the queue already exists, then errors
        if (!client.queuesaves.get(message.author.id, `${Name}`))
          return message.reply({embeds : [new MessageEmbed()
            .setFooter(client.getFooter(es))
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable54"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable55"]))
          ]});
        let oldtracks = client.queuesaves.get(message.author.id, `${Name}`);
        if (!Array.isArray(oldtracks))
          return message.reply({embeds : [new MessageEmbed()
            .setFooter(client.getFooter(es))
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable56"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable57"]))
          ]});
        //make a new array of each single song which is not a dupe
        let counter = 0;
        const newtracks = [];
        for (let i = 0; i < oldtracks.length; i++) {
          let exists = false;
          for (j = 0; j < newtracks.length; j++) {
            if (oldtracks[i].url === newtracks[j].url) {
              exists = true;
              counter++;
              break;
            }
          }
          if (!exists) {
            newtracks.push(oldtracks[i]);
          }
        }
        //save it in the db
        client.queuesaves.set(message.author.id, newtracks, `${Name}`);
        //return susccess message
        return message.reply({embeds : [new MessageEmbed()
          .setTitle(`${customEmojis.general.yes} Removed ${counter} Tracks from the Queue \`${Name}\``.substring(0, 256))
          .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable58"]))
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(es))]})
      }
      break;
      case `showall`:
      case `listall`:
      case `show`:
      case `queue`:
      case `list`: {
        let queues = client.queuesaves.get(message.author.id);
        if (Object.size(queues) <= 1)
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable59"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable60"]))
          ]});
        let description = ``;
        for (const item in queues) {
          if (item === `TEMPLATEQUEUEINFORMATION`) continue;
          description += `**❯ ${item}** | \`${queues[item].length} Tracks\`\n`
        }
        //return susccess message
        return swap_pages(client, message, description, `Your Saved Queues`)
      }
      break;
      case `createsave`:
      case `cs`:
      case `save`: {
        if (!Name)
          return message.reply({embeds :[new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable61"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable62"]))
          ]});
        if (Name.length > 10)
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.user.username, ee.footericon)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable63"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable64"]))
          ]});
        if (client.queuesaves.get(message.author.id, `${Name}`))
          return message.reply({embeds : [new MessageEmbed()
            .setFooter(client.getFooter(es))
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable65"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable66"]))
          ]});
        //get the player instance
        var player = client.manager.players.get(message.guild.id);
        //if no player available return error | aka not playing anything
        if (!player)
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.user.username, ee.footericon)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable67"].replace(":no:", customEmojis.general.no)))
          ]});
        //get all tracks
        const tracks = player.queue;
        //if there are no other tracks, information
        if (!tracks.length)
          return message.reply({embeds : [new MessageEmbed()
            .setFooter(client.getFooter(es))
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable68"].replace(":no:", customEmojis.general.no)))
          ]});
        //get the old tracks from the Name
        let oldtracks = client.queuesaves.get(message.author.id, `${Name}`);
        if (!Array.isArray(oldtracks)) oldtracks = [];
        const newtracks = [];

        if (player.queue.current) {
          newtracks.push({
            "title": player.queue.current.title,
            "url": player.queue.current.uri
          });
        }
        for (const track of tracks)
          newtracks.push({
            "title": track.title,
            "url": track.uri
          });
        //define the new customqueue by adding the newtracks to the old tracks
        let newqueue = oldtracks.concat(newtracks)
        //save the newcustomqueue into the db
        client.queuesaves.set(message.author.id, newqueue, `${Name}`);
        //return susccess message
        return message.reply({embeds : [new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable69"].replace(":yes:", customEmojis.general.yes)))
          .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable70"]))
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(es))
        ]})
      }
      break;
      case `delete`:
      case `remove`:
      case `del`: {
        if (!Name)
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable71"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable72"]))
          ]});
        if (Name.length > 10)
          return message.reply({embeds  : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.user.username, ee.footericon)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable73"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable74"]))
          ]});
        //if the queue does not exist yet, error
        if (!client.queuesaves.get(message.author.id, `${Name}`))
          return message.reply({embeds : [new MessageEmbed()
            .setFooter(client.getFooter(es))
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable75"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable76"]))
          ]});
        //delete it
        client.queuesaves.delete(message.author.id, `${Name}`);
        //return susccess message
        return message.reply({embeds : [new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable77"].replace(":yes:", customEmojis.general.yes)))
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(es))
        ]})
      }
      break;
      case `play`:
      case `load`:
      case `p`:
      case `add`:
      case `paly`: {
        if (!Name)
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable78"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable79"]))
          ]} );
        if (Name.length > 10)
          return message.reply({embeds :[new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.user.username, ee.footericon)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable80"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable81"]))
          ]});
        //get the channel instance from the Member
        const {
          channel
        } = message.member.voice;
        //if the member is not in a channel, return
        if (!channel)
          return message.reply({embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.user.username, ee.footericon)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable82"].replace(":no:", customEmojis.general.no)))
          ]});
        const mechannel = message.guild.me.voice.channel;
        //get the player instance
        var player = client.manager.players.get(message.guild.id);
        let playercreate = false;
        if (!player) {
          player = client.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: true,
          });
          player.connect();
          player.set("message", message);
          player.set("playerauthor", message.author.id);
          playercreate = true;
        }
        //if not in the same channel as the player, return Error
        if (player && channel.id !== player.voiceChannel)
          return message.reply({embeds :[new MessageEmbed()
            .setFooter(client.getFooter(es))
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable83"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable84"]))
          ]});
        //If there is no player, then kick the bot out of the channel, if connected to
        if(!player && mechannel) {
          message.guild.me.voice.disconnect().catch(e=>console.log("This prevents a Bug"));
        }
        //if not in the same channel --> return
        if (mechannel && channel.id !== mechannel.id)
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable85"].replace(":no:", customEmojis.general.no)))
          .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable86"]))
        ]});
        //if the queue does not exist yet, error
        if (!client.queuesaves.get(message.author.id, `${Name}`))
          return message.reply({embeds : [new MessageEmbed()
            .setFooter(client.getFooter(es))
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable87"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable88"]))
          ]});
        //now add every track of the tracks
        let tempmsg = await message.reply({embeds : [new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(es))
          .setAuthor(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable89"]), "https://cdn.discordapp.com/emojis/763781458417549352.gif")
          .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable90"]))]})
        for (const track of client.queuesaves.get(message.author.id, `${Name}`)) {
          try {
            // Advanced way using the title, author, and duration for a precise search.
            const unresolvedTrack = TrackUtils.buildUnresolved({
              title: track.title,
              url: track.url,
            }, message.author);
            player.queue.add(unresolvedTrack);
          } catch (e) {
            console.log(e.stack ? String(e.stack).grey : String(e).grey)
            continue;
          }
          let res;
          /* old way, --> slow way!
           try {
              // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
              if(track.url.toLowerCase().includes(`youtu`))
              res = await client.manager.search({query: track.url, source: `youtube`}, message.author);
              else if(track.url.toLowerCase().includes(`soundcloud`))
              res = await client.manager.search({query: track.url, source: `soundcloud`}, message.author);
              else {
                res = await client.manager.search(track.url, message.author);
              }
              // Check the load type as this command is not that advanced for basics
              if (res.loadType === `LOAD_FAILED`) continue;
              else if (res.loadType === `PLAYLIST_LOADED`) continue;
              if(!res.tracks[0]) continue;

              player.queue.add(res.tracks[0]);
          } catch (e) {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              continue;
          }

          */
        }
        //return susccess message - by editing the old temp msg
        tempmsg.edit({embeds : [new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable91"].replace(":yes:", customEmojis.general.yes)))
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(client.getFooter(es))
        ]})
        if (playercreate) player.play();
      }
      break;
      case `showdetails`:
      case `showdetail`:
      case `details`: {
        if (!Name)
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable92"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable93"]))
          ]});
        if (Name.length > 10)
          return message.reply({embeds :[new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.user.username, ee.footericon)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable94"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable95"]))
          ]});
        //if the queue already exists, then errors
        if (!client.queuesaves.get(message.author.id, `${Name}`))
          return message.reply({embeds : [new MessageEmbed()
            .setFooter(client.getFooter(es))
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable96"].replace(":no:", customEmojis.general.no)))
            .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable97"]))
          ]});
        //get all tracks
        const tracks = client.queuesaves.get(message.author.id, `${Name}`);
        //return susccess message
        let array = [];
        tracks.map((track, index) => array.push(`**${index})** [${track.title.split(`]`).join(`}`).split(`[`).join(`{`).substring(0, 60)}](${track.url})`)).join(`\n`)
        return swap_pages(client, message, array, `Detailed Information about: \`${Name}\` [${tracks.length} Tracks]`)
      }
      break;
      default:
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(client.getFooter(es))
          .setTitle(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable98"].replace(":no:", customEmojis.general.no)))
          .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable99"]))
        ]});
        break;

      }

    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur.replace(":no:", customEmojis.general.no))
        .setDescription(eval(client.la[ls]["cmds"]["customqueues"]["savedqueue"]["variable100"]))
      ]});
    }
  }
};
Object.size = function (obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
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
