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
function move(pos, dir) {
  switch (dir) {
    case 'up':
      return {
        x: pos.x, y: pos.y - 1
      }
      case 'down':
        return {
          x: pos.x, y: pos.y + 1
        }
        case 'left':
          return {
            x: pos.x - 1, y: pos.y
          }
          case 'right':
            return {
              x: pos.x + 1, y: pos.y
            }
  }
}
function isInsideBlock(pos, width, height) {
  return pos.x >= 0 && pos.y >= 0 && pos.x < width && pos.y < height;
}
function posEqual(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}
function oppDirection(dir) {
  switch (dir) {
    case 'up':
      return 'down'
    case 'down':
      return 'up'
    case 'left':
      return 'right'
    case 'right':
      return 'left'
  }
}
const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
const WIDTH = 4;
const HEIGHT = 4;
class TwoZeroFourEight {
  constructor(options = {}) {
    if (!options.message) throw new TypeError('NO_MESSAGE: Please provide a message arguement')
    if (typeof options.message !== 'object') throw new TypeError('INVALID_MESSAGE: Invalid Discord Message object was provided.')
    if (!options.slash_command) options.slash_command = false;
    if (typeof options.slash_command !== 'boolean') throw new TypeError('INVALID_COMMAND_TYPE: Slash command must be a boolean.')


    if (!options.embed) options.embed = {};
    if (!options.embed.title) options.embed.title = '2048';
    if (typeof options.embed.title !== 'string') throw new TypeError('INVALID_TITLE: Embed Title must be a string.')
    if (!options.embed.color) options.embed.color = '#5865F2';
    if (typeof options.embed.color !== 'string') throw new TypeError('INVALID_COLOR: Embed Color must be a string.')
    if (!options.embed.overTitle) options.embed.overTitle = 'Game Over';
    if (typeof options.embed.overTitle !== 'string') throw new TypeError('INVALID_OVER_TITLE: Over Title must be a string.')


    if (!options.emojis) options.emojis = {};
    if (!options.emojis.up) options.emojis.up = '⬆️';
    if (typeof options.emojis.up !== 'string') throw new TypeError('INVALID_EMOJI: Up Emoji must be a string.')
    if (!options.emojis.left) options.emojis.left = '⬅️';
    if (typeof options.emojis.left !== 'string') throw new TypeError('INVALID_EMOJI: Up Emoji must be a string.')
    if (!options.emojis.down) options.emojis.down = '⬇️';
    if (typeof options.emojis.down !== 'string') throw new TypeError('INVALID_EMOJI: Up Emoji must be a string.')
    if (!options.emojis.right) options.emojis.right = '➡️';
    if (typeof options.emojis.right !== 'string') throw new TypeError('INVALID_EMOJI: Up Emoji must be a string.')

    if (!options.othersMessage) options.othersMessage = 'You are not allowed to use buttons for this message!';
    if (typeof options.othersMessage !== 'string') throw new TypeError('INVALID_OTHERS_MESSAGE: Others Message must be a string.')


    this.options = options;
    this.message = options.message;
    this.gameBoard = [];
    this.mergedPos = [];
    this.score = 0;

    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        this.gameBoard[y * WIDTH + x] = 0;
      }
    }
  }

  placeNewRandomTile() {
    let newPos = {
      x: 0,
      y: 0
    };

    do {
      newPos = {
        x: parseInt(Math.random() * WIDTH),
        y: parseInt(Math.random() * HEIGHT)
      };
    } while (this.gameBoard[newPos.y * WIDTH + newPos.x] != 0)

    this.gameBoard[newPos.y * WIDTH + newPos.x] = (Math.random() * 100) < 25 ? 2 : 1;
  }

  async sendMessage(content) {
    if (this.options.slash_command) return await this.message.editReply(content)
    return await this.message.channel.send(content)
  }

  getImage() {
    return new MessageAttachment(`https://api.aniketdev.cf/2048/${this.gameBoard.map(c => chars[c]).join('')}`, 'gameboard.png')
  }

  async startGame() {
    if (this.options.slash_command) {
      if (!this.message.deferred) await this.message.deferReply({ephemeral: false});
      this.message.author = this.message.user;
    }

    this.score = 0;
    this.placeNewRandomTile();
    const emojis = this.options.emojis;

    const embed = new MessageEmbed()
      .setColor(this.options.embed.color)
      .setTitle(this.options.embed.title)
      .setImage('attachment://gameboard.png')
      .addField(this.options.embed.curScore || 'Score', this.score.toString())
      .setFooter(this.message.author.tag, this.message.author.displayAvatarURL({
        dynamic: true
      }))

    const up = new MessageButton().setEmoji(emojis.up).setStyle('PRIMARY').setCustomId('2048_up')
    const left = new MessageButton().setEmoji(emojis.left).setStyle('PRIMARY').setCustomId('2048_left')
    const down = new MessageButton().setEmoji(emojis.down).setStyle('PRIMARY').setCustomId('2048_down')
    const right = new MessageButton().setEmoji(emojis.right).setStyle('PRIMARY').setCustomId('2048_right')

    const row = new MessageActionRow().addComponents(up, left, down, right)

    const msg = await this.sendMessage({
      embeds: [embed],
      components: [row],
      files: [this.getImage()]
    })

    this.ButtonInteraction(msg)
  }


  ButtonInteraction(msg) {
    const collector = msg.createMessageComponentCollector({
      idle: 60000
    })

    collector.on('collect', async btn => {
      if (btn.user.id !== this.message.author.id) {
        if (this.options.othersMessage == 'false') return await btn.deferUpdate();
        return btn.reply({
          content: this.options.othersMessage.replace('{author}', this.message.author.tag),
          ephemeral: true
        })
      }

      await btn.deferUpdate();
      let moved = false;
      this.mergedPos = [];
      if (btn.customId === '2048_left') {
        moved = this.shiftLeft()
      } else if (btn.customId === '2048_right') {
        moved = this.shiftRight()
      } else if (btn.customId === '2048_up') {
        moved = this.shiftUp()
      } else if (btn.customId === '2048_down') {
        moved = this.shiftDown()
      }


      if (moved) this.placeNewRandomTile();


      if (this.isBoardFull() && this.possibleMoves() === 0) {
        collector.stop()
        return this.gameOver(msg)
      } else {
        const editEmbed = new MessageEmbed()
          .setColor(this.options.embed.color)
          .setTitle(this.options.embed.title)
          .setImage('attachment://gameboard.png')
          .addField(this.options.embed.curScore || 'Score', this.score.toString())
          .setFooter(this.message.author.tag, this.message.author.displayAvatarURL({
            dynamic: true
          }))

        msg.edit({
          embeds: [editEmbed],
          components: msg.components,
          files: [this.getImage()],
          attachments: []
        })
      }
    })

    collector.on('end', async (_, r) => {
      if (r === 'idle') this.gameOver(msg)
    })

  }

  async gameOver(msg) {
    const overTitle = this.gameBoard.includes('b') ? this.options.embed.winTitle || 'Win!' : this.options.embed.overTitle;

    const editEmbed = new MessageEmbed()
      .setColor(this.options.embed.color)
      .setTitle(this.options.embed.title)
      .setImage('attachment://gameboard.png')
      .addField(overTitle, (this.options.embed.totalScore || '**Score:** ') + this.score)
      .setFooter(this.message.author.tag, this.message.author.displayAvatarURL({
        dynamic: true
      }))

    msg.edit({
      embeds: [editEmbed],
      components: disableButtons(msg.components),
      files: [this.getImage()],
      attachments: []
    })
  }


  isBoardFull() {
    for (let y = 0; y < HEIGHT; y++)
      for (let x = 0; x < WIDTH; x++)
        if (this.gameBoard[y * WIDTH + x] === 0)
          return false;
    return true;
  }

  possibleMoves() {
    let numMoves = 0;
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        const pos = {
          x,
          y
        };
        const posNum = this.gameBoard[pos.y * WIDTH + pos.x];
        ['down', 'left', 'right', 'up'].forEach(dir => {
          const newPos = move(pos, dir);
          if (isInsideBlock(newPos, WIDTH, HEIGHT) && (this.gameBoard[newPos.y * WIDTH + newPos.x] === 0 || this.gameBoard[newPos.y * WIDTH + newPos.x] === posNum))
            numMoves++;
        });
      }
    }
    return numMoves;
  }


  shiftLeft() {
    let moved = false;
    for (let y = 0; y < HEIGHT; y++)
      for (let x = 1; x < WIDTH; x++)
        moved = this.shift({
          x,
          y
        }, 'left') || moved;
    return moved;
  }

  shiftRight() {
    let moved = false;
    for (let y = 0; y < HEIGHT; y++)
      for (let x = WIDTH - 2; x >= 0; x--)
        moved = this.shift({
          x,
          y
        }, 'right') || moved;
    return moved;
  }

  shiftUp() {
    let moved = false;
    for (let x = 0; x < WIDTH; x++)
      for (let y = 1; y < HEIGHT; y++)
        moved = this.shift({
          x,
          y
        }, 'up') || moved;
    return moved;
  }

  shiftDown() {
    let moved = false;
    for (let x = 0; x < WIDTH; x++)
      for (let y = HEIGHT - 2; y >= 0; y--)
        moved = this.shift({
          x,
          y
        }, 'down') || moved;
    return moved;
  }


  shift(pos, dir) {
    let moved = false;
    const movingNum = this.gameBoard[pos.y * WIDTH + pos.x];

    if (movingNum === 0) {
      return false
    }

    let moveTo = pos;
    let set = false;
    while (!set) {
      moveTo = move(moveTo, dir);
      const moveToNum = this.gameBoard[moveTo.y * WIDTH + moveTo.x];
      if (!isInsideBlock(moveTo, WIDTH, HEIGHT) || (moveToNum !== 0 && moveToNum !== movingNum) || !!this.mergedPos.find(p => p.x === moveTo.x && p.y === moveTo.y)) {
        const oppDir = oppDirection(dir);
        const moveBack = move(moveTo, oppDir);
        if (!posEqual(moveBack, pos)) {
          this.gameBoard[pos.y * WIDTH + pos.x] = 0;
          this.gameBoard[moveBack.y * WIDTH + moveBack.x] = movingNum;
          moved = true;
        }
        set = true;
      } else if (moveToNum === movingNum) {
        moved = true;
        this.gameBoard[moveTo.y * WIDTH + moveTo.x] += 1;
        this.score += Math.floor(Math.pow(this.gameBoard[moveTo.y * WIDTH + moveTo.x], 2));
        this.gameBoard[pos.y * WIDTH + pos.x] = 0;
        set = true;
        this.mergedPos.push(moveTo)
      }
    }
    return moved;
  }

}
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
module.exports = {
  name: "2048",
  category: "🎮 MiniGames",
  description: "Play a game of 2048",
  usage: "2048 --> Play the Game",
  type: "buttons",
  run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language")
    if (!client.settings.get(message.guild.id, "MINIGAMES")) {
      return message.reply(new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {
          prefix: prefix
        }))
      );
    }
    new TwoZeroFourEight({
      message: message,
      slash_command: false,
      embed: {
        title: '2048',
        color: es.color,
        overTitle: "Game Over"
      },
    }).startGame();

  }
}