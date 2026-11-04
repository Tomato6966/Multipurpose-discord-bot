const { EmbedBuilder } = require("discord.js");
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
const translate = require(`${process.cwd()}/handlers/translate`);

module.exports = {
    name: "translate",
    category: "🔰 Info",
    aliases: ["trans", "tran", "tr"],
    cooldown: 5,
    usage: "translate <from> <to> <TEXT>",
    description: "Translates text from one language to another",
    type: "util",
    run: async (client, message, args, cmduser, text, prefix) => {
        const settings = client.settings.get(message.guild.id, "embed");
        const language = client.settings.get(message.guild.id, "language");
        if (!args[0] || !args[1] || !args[2]) {
            return message.reply(handlemsg(client.la[language].cmds.info.translate.error, { prefix }));
        }

        try {
            const result = await translate(args.slice(2).join(" "), { from: args[0], to: args[1] });
            const embed = new EmbedBuilder()
                .setColor(settings.color)
                .setAuthor({
                    name: handlemsg(client.la[language].cmds.info.translate.to, { to: args[1] }),
                    iconURL: "https://imgur.com/0DQuCgg.png",
                    url: "https://discord.gg/milrato",
                })
                .setFooter({
                    text: handlemsg(client.la[language].cmds.info.translate.from, { from: args[0] }),
                    iconURL: message.author.displayAvatarURL(),
                })
                .setDescription(result.text.slice(0, 4_000));
            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Translation failed:", error);
            const embed = new EmbedBuilder()
                .setColor(settings.wrongcolor)
                .setTitle(client.la[language].common.erroroccur)
                .setDescription("Translation failed. Check the language codes and try again later.");
            await message.reply({ embeds: [embed] });
        }
    },
};
