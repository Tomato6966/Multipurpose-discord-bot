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
const WIDTH = 7;
const HEIGHT = 6;

class Connect4Game {
    constructor(options = {}) {
        if (!options.message) throw new TypeError('NO_MESSAGE: Please provide a message arguement')
        if (typeof options.message !== 'object') throw new TypeError('INVALID_MESSAGE: Invalid Discord Message object was provided.')
        if(!options.opponent) throw new TypeError('NO_OPPONENT: Please provide an opponent arguement')
        if (typeof options.opponent !== 'object') throw new TypeError('INVALID_OPPONENT: Invalid Discord User object was provided.')
        if (!options.slash_command) options.slash_command = false;
        if (typeof options.slash_command !== 'boolean') throw new TypeError('INVALID_COMMAND_TYPE: Slash command must be a boolean.')


        if (!options.embed) options.embed = {};
        if (!options.embed.title) options.embed.title = 'Connect 4';
        if (typeof options.embed.title !== 'string')  throw new TypeError('INVALID_TITLE: Embed Title must be a string.')
        if (!options.embed.color) options.embed.color = '#5865F2';
        if (typeof options.embed.color !== 'string')  throw new TypeError('INVALID_COLOR: Embed Color must be a string.')


        if (!options.emojis) options.emojis = {};
        if (!options.emojis.player1) options.emojis.player1 = '🔵';
        if (typeof options.emojis.player1 !== 'string')  throw new TypeError('INVALID_EMOJI: Player1 Emoji must be a string.')
        if (!options.emojis.player2) options.emojis.player2 = '🟡';
        if (typeof options.emojis.player2 !== 'string')  throw new TypeError('INVALID_EMOJI: Player2 Emoji must be a string.')


        if (!options.askMessage) options.askMessage = 'Hey {opponent}, {challenger} challenged you for a game of Connect 4!';
        if (typeof options.askMessage !== 'string')  throw new TypeError('ASK_MESSAGE: Ask Message must be a string.')
        if (!options.cancelMessage) options.cancelMessage = 'Looks like they refused to have a game of Connect4. \:(';
        if (typeof options.cancelMessage !== 'string')  throw new TypeError('CANCEL_MESSAGE: Cancel Message must be a string.')
        if (!options.timeEndMessage) options.timeEndMessage = 'Since the opponent didnt answer, i dropped the game!';
        if (typeof options.timeEndMessage !== 'string')  throw new TypeError('TIME_END_MESSAGE: Time End Message must be a string.')

        
        if (!options.turnMessage) options.turnMessage = '{emoji} | Its turn of player **{player}**.';
        if (typeof options.turnMessage !== 'string')  throw new TypeError('TURN_MESSAGE: Turn Message must be a string.')
        if (!options.waitMessage) options.waitMessage = 'Waiting for the opponent...';
        if (typeof options.waitMessage !== 'string')  throw new TypeError('WAIT_MESSAGE: Wait Message must be a string.')        


        if (!options.gameEndMessage) options.gameEndMessage = 'The game went unfinished :(';
        if (typeof options.gameEndMessage !== 'string')  throw new TypeError('GAME_END_MESSAGE: Game End Message must be a string.')
        if (!options.winMessage) options.winMessage = '{emoji} | **{winner}** won the game!';
        if (typeof options.winMessage !== 'string')  throw new TypeError('WIN_MESSAGE: Win Message must be a string.')
        if (!options.drawMessage) options.drawMessage = 'It was a draw!';
        if (typeof options.drawMessage !== 'string')  throw new TypeError('DRAW_MESSAGE: Draw Message must be a string.')
        if (!options.othersMessage) options.othersMessage = 'You are not allowed to use buttons for this message!';
        if (typeof options.othersMessage !== 'string') throw new TypeError('INVALID_OTHERS_MESSAGE: Others Message must be a string.')


        this.message = options.message;
        this.opponent = options.opponent;
        this.emojis = options.emojis;
        this.gameBoard = [];
        this.options = options;
        this.inGame = false;
        this.redTurn = true;
        // red => author, yellow => opponent
    }

    
    getGameBoard() {
        let str = '';
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                str += '' + this.gameBoard[y * WIDTH + x];
            }
            str += '\n';
        }
        str += '1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣'
        return str;
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
            this.Connect4Game();
        }
    }


    async Connect4Game() {
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                this.gameBoard[y * WIDTH + x] = '⚪';
            }
        }
        this.inGame = true;


        const btn1 = new MessageButton().setStyle('PRIMARY').setEmoji('1️⃣').setCustomId('1_connect4')
        const btn2 = new MessageButton().setStyle('PRIMARY').setEmoji('2️⃣').setCustomId('2_connect4')
        const btn3 = new MessageButton().setStyle('PRIMARY').setEmoji('3️⃣').setCustomId('3_connect4')
        const btn4 = new MessageButton().setStyle('PRIMARY').setEmoji('4️⃣').setCustomId('4_connect4')
        const btn5 = new MessageButton().setStyle('PRIMARY').setEmoji('5️⃣').setCustomId('5_connect4')
        const btn6 = new MessageButton().setStyle('PRIMARY').setEmoji('6️⃣').setCustomId('6_connect4')
        const btn7 = new MessageButton().setStyle('PRIMARY').setEmoji('7️⃣').setCustomId('7_connect4')

        const row1 = new MessageActionRow().addComponents(btn1, btn2, btn3, btn4)
        const row2 = new MessageActionRow().addComponents(btn5, btn6, btn7)


        const msg = await this.sendMessage({ embeds: [this.GameEmbed()], components: [row1, row2] })

        this.ButtonInteraction(msg);  
    }

    
    GameEmbed() {
        const status = this.options.turnMessage.replace('{emoji}', this.getChip())
        .replace('{player}', this.redTurn ? this.message.author.tag : this.opponent.tag)

        return new MessageEmbed() 
        .setColor(this.options.embed.color)
        .setTitle(this.options.embed.title)
        .setDescription(this.getGameBoard())
        .addField(this.options.embed.statusTitle || 'Status', status)
        .setFooter(client.getFooter(`${this.message.author.username} vs ${this.opponent.username}`, this.message.guild.iconURL({ dynamic: true })))
    } 


    gameOver(result, msg) {
        this.inGame = false;

        const editEmbed = new MessageEmbed()
        .setColor(this.options.embed.color)
        .setTitle(this.options.embed.title)
        .setDescription(this.getGameBoard())
        .addField(this.options.embed.statusTitle || 'Status', this.getResultText(result))
        .setFooter(client.getFooter(`${this.message.author.username} vs ${this.opponent.username}`, this.message.guild.iconURL({ dynamic: true })))
        

        return msg.edit({ embeds: [editEmbed], components: disableButtons(msg.components) });
    }

    
    ButtonInteraction(msg) {
        const collector = msg.createMessageComponentCollector({
            idle: 60000,
        })


        collector.on('collect', async btn => {
            if (btn.user.id !== this.message.author.id && btn.user.id !== this.opponent.id) {
                const authors = this.message.author.tag + 'and' + this.opponent.tag;
                return btn.reply({ content: this.options.othersMessage.replace('{author}', authors),  ephemeral: true })
            }
            
            const turn = this.redTurn ? this.message.author.id : this.opponent.id;
            if (btn.user.id !== turn) {
				return btn.reply({ content: this.options.waitMessage,  ephemeral: true })
			}
            await btn.deferUpdate();


            const id = btn.customId.split('_')[0];
            const column = parseInt(id) - 1;
            let placedX = -1;
            let placedY = -1;


            for (let y = HEIGHT - 1; y >= 0; y--) {
                const chip = this.gameBoard[column + (y * WIDTH)];
                if (chip === '⚪') {
                    this.gameBoard[column + (y * WIDTH)] = this.getChip();
                    placedX = column;
                    placedY = y;
                    break;
                }
            }

            if (placedY == 0) {
                if (column > 3) {
                    msg.components[1].components[column % 4].disabled = true;
                } else {
                    msg.components[0].components[column].disabled = true;
                }
            }


            if (this.hasWon(placedX, placedY)) {
                this.gameOver({ result: 'winner', name: btn.user.tag, emoji: this.getChip() }, msg);
            }
            else if (this.isBoardFull()) {
                this.gameOver({ result: 'tie' }, msg);
            }
            else {
                this.redTurn = !this.redTurn;
                msg.edit({ embeds: [this.GameEmbed()], components: msg.components });
            }
        })

        collector.on('end', async(c, r) => {
            if (r === 'idle' && this.inGame == true) this.gameOver({ result: 'timeout' }, msg)
        })

    }


    hasWon(placedX, placedY) {
        const chip = this.getChip();
        const gameBoard = this.gameBoard;

        //Horizontal Check
        const y = placedY * WIDTH;
        for (var i = Math.max(0, placedX - 3); i <= placedX; i++) {
            var adj = i + y;
            if (i + 3 < WIDTH) {
                if (gameBoard[adj] === chip && gameBoard[adj + 1] === chip && gameBoard[adj + 2] === chip && gameBoard[adj + 3] === chip)
                    return true;
            }
        }
        //Verticle Check
        for (var i = Math.max(0, placedY - 3); i <= placedY; i++) {
            var adj = placedX + (i * WIDTH);
            if (i + 3 < HEIGHT) {
                if (gameBoard[adj] === chip && gameBoard[adj + WIDTH] === chip && gameBoard[adj + (2 * WIDTH)] === chip && gameBoard[adj + (3 * WIDTH)] === chip)
                    return true;
            }
        }
        //Ascending Diag
        for (var i = -3; i <= 0; i++) {
            var adjX = placedX + i;
            var adjY = placedY + i;
            var adj = adjX + (adjY * WIDTH);
            if (adjX + 3 < WIDTH && adjY + 3 < HEIGHT) {
                if (gameBoard[adj] === chip && gameBoard[adj + WIDTH + 1] === chip && gameBoard[adj + (2 * WIDTH) + 2] === chip && gameBoard[adj + (3 * WIDTH) + 3] === chip)
                    return true;
            }
        }
        //Descending Diag
        for (var i = -3; i <= 0; i++) {
            var adjX = placedX + i;
            var adjY = placedY - i;
            var adj = adjX + (adjY * WIDTH);
            if (adjX + 3 < WIDTH && adjY - 3 >= 0) {
                if (gameBoard[adj] === chip && gameBoard[adj - WIDTH + 1] === chip && gameBoard[adj - (2 * WIDTH) + 2] === chip && gameBoard[adj - (3 * WIDTH) + 3] === chip)
                    return true;
            }
        }
        return false;
    }

    getChip() {
        return this.redTurn ? this.emojis.player1 : this.emojis.player2;
    }

    isBoardFull() {
        for (let y = 0; y < HEIGHT; y++)
            for (let x = 0; x < WIDTH; x++)
                if (this.gameBoard[y * WIDTH + x] === '⚪')
                    return false;
        return true;
    }

    getResultText(result) {
        if (result.result === 'tie')
            return this.options.drawMessage;
        else if (result.result === 'timeout')
            return this.options.gameEndMessage;
        else if (result.result === 'error')
            return 'ERROR: ' + result.error;
        else
            return this.options.winMessage.replace('{emoji}', result.emoji).replace('{winner}', result.name);
    }
}

module.exports = {
    name: "connect4",
    aliases: ["viergewinnt"],
    category: "🎮 MiniGames",
    description: "Allows you to play a Game of Connect4",
    usage: "connect4 --> Play the Game",
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

        new Connect4Game({
            message: message,
            slash_command: false,
            opponent: opponent.user,
            embed: {
              title: 'Connect 4',
              color: es.color,
            },
            emojis: {
              player1: '🔵',
              player2: '🟡'
            },
            waitMessage: 'Waiting for the opponent...',
            turnMessage: '{emoji} | Its turn of player **{player}**.',
            winMessage: '{emoji} | **{winner}** won the game!',
            gameEndMessage: 'The game went unfinished :(',
            drawMessage: 'It was a draw!',
            othersMessage: 'You are not allowed to use buttons for this message!',
            askMessage: 'Hey {opponent}, {challenger} challenged you for a game of Connect 4!',
            cancelMessage: 'Looks like they refused to have a game of Connect4. \:(',
            timeEndMessage: 'Since the opponent didnt answer, i dropped the game!',
          }).startGame()
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
