const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  MessageAttachment
} = require('discord.js')
const apiBase = "https://api.aniketdev.cf"

const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
const WIDTH = 4;
const HEIGHT = 4;

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
      embed: {
        title: '2048',
        color: es.color,
        overTitle: "Game Over"
      },
    }).startGame();

  }
}


class TwoZeroFourEight {
  constructor(options = {}) {
    options.emojis = {
      up: '⬆️',
      down: '⬇️',
      left: '⬅️',
      right: '➡️',
    }
    options.othersMessage = 'You are not allowed to use buttons for this message!';
    this.options = options;
    this.message = options.message;
    this.board = [];
    this.mergedPos = [];
    this.score = 0;
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        this.board[y * WIDTH + x] = 0;
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
    } while (this.board[newPos.y * WIDTH + newPos.x] != 0)

    this.board[newPos.y * WIDTH + newPos.x] = (Math.random() * 100) < 25 ? 2 : 1;
  }

  async sendMessage(content) {
    return await this.message.channel.send(content)
  }

  getImage() {
    return new MessageAttachment(`${apiBase}/2048/${this.board.map(c => chars[c]).join('')}`, 'board.png')
  }

  async startGame() {

    this.score = 0;
    this.placeNewRandomTile();
    const emojis = this.options.emojis;

    const embed = new MessageEmbed()
      .setColor(this.options.embed.color)
      .setTitle(this.options.embed.title)
      .setImage('attachment://board.png')
      .addField(this.options.embed.curScore || 'Score', this.score.toString())
      .setFooter(this.message.client.getFooter(this.message.author.tag + " | Aniket's Api", this.message.author.displayAvatarURL({
        dynamic: true
      })))

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

    collector.on('collect', async buttonInteraction => {
      if (buttonInteraction.user.id !== this.message.author.id) {
        if (this.options.othersMessage == 'false') return await buttonInteraction.deferUpdate();
        return buttonInteraction.reply({
          content: this.options.othersMessage.replace('{author}', this.message.author.tag),
          ephemeral: true
        })
      }

      await buttonInteraction.deferUpdate();
      let moved = false;
      this.mergedPos = [];
      if (buttonInteraction.customId === '2048_left') {
        moved = this.shiftLeft()
      } else if (buttonInteraction.customId === '2048_right') {
        moved = this.shiftRight()
      } else if (buttonInteraction.customId === '2048_up') {
        moved = this.shiftUp()
      } else if (buttonInteraction.customId === '2048_down') {
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
          .setImage('attachment://board.png')
          .addField(this.options.embed.curScore || 'Score', this.score.toString())
          .setFooter(this.message.client.getFooter(this.message.author.tag + " | Aniket's Api", this.message.author.displayAvatarURL({
            dynamic: true
          })))

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
    const overTitle = this.board.includes('b') ? this.options.embed.winTitle || 'Win!' : this.options.embed.overTitle;

    const editEmbed = new MessageEmbed()
      .setColor(this.options.embed.color)
      .setTitle(this.options.embed.title)
      .setImage('attachment://board.png')
      .addField(overTitle, (this.options.embed.totalScore || '**Score:** ') + this.score)
      .setFooter(this.message.client.getFooter(this.message.author.tag + " | Aniket's Api", this.message.author.displayAvatarURL({
        dynamic: true
      })))

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
        if (this.board[y * WIDTH + x] === 0)
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
        const posNum = this.board[pos.y * WIDTH + pos.x];
        ['down', 'left', 'right', 'up'].forEach(dir => {
          const newPos = move(pos, dir);
          if (isInsideBlock(newPos, WIDTH, HEIGHT) && (this.board[newPos.y * WIDTH + newPos.x] === 0 || this.board[newPos.y * WIDTH + newPos.x] === posNum))
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
    const movingNum = this.board[pos.y * WIDTH + pos.x];

    if (movingNum === 0) {
      return false
    }

    let moveTo = pos;
    let set = false;
    while (!set) {
      moveTo = move(moveTo, dir);
      const moveToNum = this.board[moveTo.y * WIDTH + moveTo.x];
      if (!isInsideBlock(moveTo, WIDTH, HEIGHT) || (moveToNum !== 0 && moveToNum !== movingNum) || !!this.mergedPos.find(p => p.x === moveTo.x && p.y === moveTo.y)) {
        const oppDir = oppDirection(dir);
        const moveBack = move(moveTo, oppDir);
        if (!posEqual(moveBack, pos)) {
          this.board[pos.y * WIDTH + pos.x] = 0;
          this.board[moveBack.y * WIDTH + moveBack.x] = movingNum;
          moved = true;
        }
        set = true;
      } else if (moveToNum === movingNum) {
        moved = true;
        this.board[moveTo.y * WIDTH + moveTo.x] += 1;
        this.score += Math.floor(Math.pow(this.board[moveTo.y * WIDTH + moveTo.x], 2));
        this.board[pos.y * WIDTH + pos.x] = 0;
        set = true;
        this.mergedPos.push(moveTo)
      }
    }
    return moved;
  }

}

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
