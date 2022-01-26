const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  MessageAttachment
} = require('discord.js')
function disableButtons(components) {
  for (let x = 0; x < components.length; x++) {
    for (let y = 0; y < components[x].components.length; y++) {
      components[x].components[y].disabled = true;
    }
  }
  return components;
}
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
class RPSGame {
  constructor(options = {}) {
      if (!options.message) throw new TypeError('NO_MESSAGE: Please provide a message arguement')
      if (typeof options.message !== 'object') throw new TypeError('INVALID_MESSAGE: Invalid Discord Message object was provided.')
      if(!options.opponent) throw new TypeError('NO_OPPONENT: Please provide an opponent arguement')
      if (typeof options.opponent !== 'object') throw new TypeError('INVALID_OPPONENT: Invalid Discord User object was provided.')
      if (!options.slash_command) options.slash_command = false;
      if (typeof options.slash_command !== 'boolean') throw new TypeError('INVALID_COMMAND_TYPE: Slash command must be a boolean.')


      if (!options.embed) options.embed = {};
      if (typeof options.embed !== 'object') throw new TypeError('INVALID_EMBED_OBJECT: Embed arguement must be an object.')
      if (!options.embed.title) options.embed.title = 'Rock Paper Scissors';
      if (typeof options.embed.title !== 'string')  throw new TypeError('INVALID_TITLE: Embed Title must be a string.')
      if (!options.embed.description) options.embed.description = 'Press a button below to make a choice!';
      if (typeof options.embed.description !== 'string')  throw new TypeError('INVALID_TITLE: Embed Title must be a string.')
      if (!options.embed.color) options.embed.color = '#5865F2';
      if (typeof options.embed.color !== 'string')  throw new TypeError('INVALID_COLOR: Embed Color must be a string.')


      if (!options.buttons) options.buttons = {};
      if (!options.buttons.rock) options.buttons.rock = 'Rock';
      if (typeof options.buttons.rock !== 'string')  throw new TypeError('INVALID_BUTTON: Rock Button must be a string.')
      if (!options.buttons.paper) options.buttons.paper = 'Paper';
      if (typeof options.buttons.paper !== 'string')  throw new TypeError('INVALID_BUTTON: Paper Button must be a string.')
      if (!options.buttons.scissors) options.buttons.scissors = 'Scissors';
      if (typeof options.buttons.scissors !== 'string')  throw new TypeError('INVALID_BUTTON: Scissors Button must be a string.')


      if (!options.emojis) options.emojis = {};
      if (!options.emojis.rock) options.emojis.rock = '🌑';
      if (typeof options.emojis.rock !== 'string')  throw new TypeError('INVALID_EMOJI: Rock Emoji must be a string.')
      if (!options.emojis.paper) options.emojis.paper = '📃';
      if (typeof options.emojis.paper !== 'string')  throw new TypeError('INVALID_EMOJI: Paper Emoji must be a string.')
      if (!options.emojis.scissors) options.emojis.scissors = '✂️';
      if (typeof options.emojis.scissors !== 'string')  throw new TypeError('INVALID_EMOJI: Scissors Emoji must be a string.')

  
      if (!options.askMessage) options.askMessage = 'Hey {opponent}, {challenger} challenged you for a game of Rock Paper Scissors!';
      if (typeof options.askMessage !== 'string')  throw new TypeError('ASK_MESSAGE: Ask Messgae must be a string.')
      if (!options.cancelMessage) options.cancelMessage = 'Looks like they refused to have a game of Rock Paper Scissors. \:(';
      if (typeof options.cancelMessage !== 'string')  throw new TypeError('CANCEL_MESSAGE: Cancel Message must be a string.')
      if (!options.timeEndMessage) options.timeEndMessage = 'Since the opponent didnt answer, i dropped the game!';
      if (typeof options.timeEndMessage !== 'string')  throw new TypeError('TIME_END_MESSAGE: Time End Message must be a string.')
      
      
      if (!options.othersMessage) options.othersMessage = 'You are not allowed to use buttons for this message!';
      if (typeof options.othersMessage !== 'string') throw new TypeError('INVALID_OTHERS_MESSAGE: Others Message must be a string.')
      if (!options.chooseMessage) options.chooseMessage = 'You choose {emoji}!';
      if (typeof options.chooseMessage !== 'string') throw new TypeError('INVALID_CHOOSE_MESSAGE: Choose Message must be a string.')
      if (!options.noChangeMessage) options.noChangeMessage = 'You cannot change your selection!';
      if (typeof options.noChangeMessage !== 'string') throw new TypeError('INVALID_NOCHANGE_MESSAGE: noChange Message must be a string.')
      

      if (!options.gameEndMessage) options.gameEndMessage = 'The game went unfinished :(';
      if (typeof options.gameEndMessage !== 'string')  throw new TypeError('GAME_END_MESSAGE: Game End Message must be a string.')
      if (!options.winMessage) options.winMessage = '{winner} won the game!';
      if (typeof options.winMessage !== 'string')  throw new TypeError('WIN_MESSAGE: Win Message must be a string.')
      if (!options.drawMessage) options.drawMessage = 'It was a draw!';
      if (typeof options.drawMessage !== 'string')  throw new TypeError('DRAW_MESSAGE: Draw Message must be a string.')


      this.inGame = false;
      this.options = options;
      this.opponent = options.opponent;
      this.message = options.message;
  }


  sendMessage(content) {
      if (this.options.slash_command) return this.message.editReply(content)
      else return this.message.channel.send(content)
  }


  async startGame() {
      if (this.options.slash_command) {
          if (!this.message.deferred) await this.message.deferReply({ephemeral: false});
          this.message.author = this.message.user;
      }

      if (this.opponent.bot) return this.sendMessage('You can\'t play with bots!')
      if (this.opponent.id === this.message.author.id) return this.sendMessage('You cannot play with yourself!')

      const check = await verify(this.options)

      if (check) {
          this.RPSGame();
      }
  }


  async RPSGame() {
      this.inGame = true;

      const emojis = this.options.emojis;
      const choice = { r: emojis.rock, p: emojis.paper, s: emojis.scissors};

      const embed = new MessageEmbed()
  .setTitle(this.options.embed.title)
   .setDescription(this.options.embed.description)
      .setColor(this.options.embed.color)
      

      const rock = new MessageButton().setCustomId('r_rps').setStyle('PRIMARY').setLabel(this.options.buttons.rock).setEmoji(emojis.rock)
      const paper = new MessageButton().setCustomId('p_rps').setStyle('PRIMARY').setLabel(this.options.buttons.paper).setEmoji(emojis.paper)
      const scissors = new MessageButton().setCustomId('s_rps').setStyle('PRIMARY').setLabel(this.options.buttons.scissors).setEmoji(emojis.scissors)
      const row = new MessageActionRow().addComponents(rock, paper, scissors)

      const msg = await this.sendMessage({ embeds: [embed], components: [row] })


      let challenger_choice;
      let opponent_choice;
      const filter = m => m;
      const collector = msg.createMessageComponentCollector({
          filter,
          time: 60000,
      }) 


      collector.on('collect', async btn => {
          if (btn.user.id !== this.message.author.id && btn.user.id !== this.opponent.id) {
              const authors = this.message.author.tag + 'and' + this.opponent.tag;
              return btn.reply({ content: this.options.othersMessage.replace('{author}', authors),  ephemeral: true })
          }


          if (btn.user.id == this.message.author.id) {
              if (challenger_choice) {
                  return btn.reply({ content: this.options.noChangeMessage,  ephemeral: true })
              }
              challenger_choice = choice[btn.customId.split('_')[0]];

              btn.reply({ content: this.options.chooseMessage.replace('{emoji}', challenger_choice),  ephemeral: true })

              if (challenger_choice && opponent_choice) {
                  collector.stop()
                  this.getResult(msg, challenger_choice, opponent_choice)
              }
          }
          else if (btn.user.id == this.opponent.id) {
              if (opponent_choice) {
                  return btn.reply({ content: this.options.noChangeMessage,  ephemeral: true })
              }
              opponent_choice = choice[btn.customId.split('_')[0]];

              btn.reply({ content: this.options.chooseMessage.replace('{emoji}', opponent_choice),  ephemeral: true })

              if (challenger_choice && opponent_choice) {
                  collector.stop()
                  this.getResult(msg, challenger_choice, opponent_choice)
              }
          }
      })

      collector.on('end', async(c, r) => {
          if (r === 'time' && this.inGame == true) {
              const endEmbed = new MessageEmbed()
              .setTitle(this.options.embed.title)
              .setColor(this.options.embed.color)
              .setDescription(this.options.gameEndMessage)
              .setTimestamp()

              return msg.edit({ embeds: [endEmbed], components: disableButtons(msg.components) })
          }
      })
  }

  getResult(msg, challenger, opponent) {
      let result;
      const { rock, paper, scissors } = this.options.emojis;

      if (challenger === opponent) {
          result = this.options.drawMessage;
      } else if (
          (opponent === scissors && challenger === paper) || 
          (opponent === rock && challenger === scissors) || 
          (opponent === paper && challenger === rock)
      ) {
          result = this.options.winMessage.replace('{winner}', this.opponent.toString())
      } else {
          result = this.options.winMessage.replace('{winner}', this.message.author.toString())
      }

      const finalEmbed = new MessageEmbed()
      .setTitle(this.options.embed.title)
      .setColor(this.options.embed.color)
      .setDescription(result)
      .addField(this.message.author.username, challenger, true)
      .addField(this.opponent.username, opponent, true)
      .setTimestamp()


      return msg.edit({ embeds: [finalEmbed], components: disableButtons(msg.components) })
  }
}
module.exports = {
    name: "rockpaperscissors",
    aliases: ["rpc"],
    category: "🎮 MiniGames",
    description: "Allows you to play a Game of Rock Paper Scissors",
    usage: "rockpaperscissors --> Play the Game",
    type: "buttons",
     run: async (client, message, args, cmduser, text, prefix) => {    
        let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        if(!client.settings.get(message.guild.id, "MINIGAMES")){
          return message.reply(new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          );
        }
        const opponent = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!opponent) return message.reply(eval(client.la[ls]["cmds"]["minigames"]["rockpaperscissors"]["variable1"]));

        new RPSGame({
          message: message,
          slash_command: false,
          opponent: opponent.user,
          embed: {
            title: 'Rock Paper Scissors',
            description: 'Press a button below to make a choice!',
            color: es.color,
          },
          buttons: {
            rock: 'Rock',
            paper: 'Paper',
            scissors: 'Scissors',
          },
          emojis: {
            rock: '🌑',
            paper: '📃',
            scissors: '✂️',
          },
          othersMessage: 'You are not allowed to use buttons for this message!',
          chooseMessage: 'You choose {emoji}!',
          noChangeMessage: 'You cannot change your selection!',
          askMessage: 'Hey {opponent}, {challenger} challenged you for a game of Rock Paper Scissors!',
          cancelMessage: 'Looks like they refused to have a game of Rock Paper Scissors. \:(',
          timeEndMessage: 'Since the opponent didnt answer, i dropped the game!',
          drawMessage: 'It was a draw!',
          winMessage: '{winner} won the game!',
          gameEndMessage: 'The game went unfinished :(',
        }).startGame();
        
    }
  }

  async function verify(options) {
    return new Promise(async (res, rej) => {
        const message = options.message;
    	const opponent = options.opponent;

    
        const askEmbed = new MessageEmbed()
        .setTitle(options.embed.askTitle || options.embed.title)
        .setDescription(options.askMessage
            .replace('{challenger}', message.author.toString()).replace('{opponent}', opponent.toString())
        )
        .setColor(options.colors?.green || options.embed.color)
    
        const btn1 = new MessageButton().setLabel(options.buttons?.accept || 'Accept').setStyle('SUCCESS').setCustomId('accept')
        const btn2 = new MessageButton().setLabel(options.buttons?.reject || 'Reject').setStyle('DANGER').setCustomId('reject')
        const row = new MessageActionRow().addComponents(btn1, btn2);
    
    
    	let askMsg;
    	if (options.slash_command) askMsg = await message.editReply({ embeds: [askEmbed], components: [row] })
        else askMsg = await message.channel.send({ embeds: [askEmbed], components: [row] })
    
        const filter = (interaction) => interaction === interaction;
        const interaction = askMsg.createMessageComponentCollector({
            filter, time: 30000
        })
    
        
        await interaction?.on('collect', async (btn) => {
            if (btn.user.id !== opponent.id) return btn.reply({ content: options.othersMessage.replace('{author}', opponent.tag),  ephemeral: true })
    
            await btn.deferUpdate();
            interaction?.stop(btn.customId)
        });
    
    
        await interaction?.on('end', (_, r) => {
            if (r === 'accept') {
                if (!options.slash_command) askMsg.delete().catch();
                return res(true)
            }

            const cancelEmbed = new MessageEmbed()
            .setTitle(options.embed.cancelTitle || options.embed.title)
            .setDescription(options.cancelMessage
                .replace('{challenger}', message.author.toString()).replace('{opponent}', opponent.toString())
            )
            .setColor(options.colors?.red || options.embed.color)

            if (r === 'time') {
                cancelEmbed.setDescription(options.timeEndMessage
                    .replace('{challenger}', message.author.toString()).replace('{opponent}', opponent.toString())
                )
            }


            res(false)
            return askMsg.edit({ embeds: [cancelEmbed], components: disableButtons(askMsg.components) });
        });
    })
}
