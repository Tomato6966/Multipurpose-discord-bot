const { EmbedBuilder } = require("discord.js");
const { handlemsg } = require(`${process.cwd()}/handlers/functions`);
const translate = require(`${process.cwd()}/handlers/translate`);

module.exports = {
    name: "translate",
    description: "Translate text between languages",
    options: [
        { String: { name: "from", description: "Source language code, for example en", required: true } },
        { String: { name: "to", description: "Target language code, for example es", required: true } },
        { String: { name: "text", description: "Text to translate", required: true } },
    ],
    run: async (client, interaction, cmduser, settings, language, prefix) => {
        const from = interaction.options.getString("from");
        const to = interaction.options.getString("to");
        const text = interaction.options.getString("text");

        try {
            const result = await translate(text, { from, to });
            const embed = new EmbedBuilder()
                .setColor(settings.color)
                .setAuthor({
                    name: handlemsg(client.la[language].cmds.info.translate.to, { to }),
                    iconURL: "https://imgur.com/0DQuCgg.png",
                    url: "https://discord.gg/milrato",
                })
                .setFooter({
                    text: handlemsg(client.la[language].cmds.info.translate.from, { from }),
                    iconURL: interaction.user.displayAvatarURL(),
                })
                .setDescription(result.text.slice(0, 4_000));
            await interaction.reply({ ephemeral: true, embeds: [embed] });
        } catch (error) {
            console.error("Translation failed:", error);
            const embed = new EmbedBuilder()
                .setColor(settings.wrongcolor)
                .setTitle(client.la[language].common.erroroccur)
                .setDescription("Translation failed. Check the language codes and try again later.");
            await interaction.reply({ ephemeral: true, embeds: [embed] });
        }
    },
};
