const { MessageEmbed } = require("discord.js");
const path = require("node:path");
module.exports = {
    name: path.parse(__filename).name,
    category: "🕹️ Fun",
    usage: `${path.parse(__filename).name} [@User]`,
    type: "user",
    description: "*Image cmd in the style:* " + path.parse(__filename).name,
    run: async (client, message, args, cmduser, text, prefix) => {
        let es = client.settings.get(message.guild.id, "embed");
        let ls = client.settings.get(message.guild.id, "language");
        if (!client.settings.get(message.guild.id, "FUN")) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle(client.la[ls].common.disabled.title)
                        .setDescription(
                            require(`${process.cwd()}/handlers/functions`).handlemsg(
                                client.la[ls].common.disabled.description,
                                { prefix: prefix }
                            )
                        ),
                ],
            });
        }
        try {
            const response = await fetch("https://www.reddit.com/r/jokes/random/.json?raw_json=1", {
                headers: { "User-Agent": "Multipurpose-discord-bot/11.0.0 (Discord bot)" },
                signal: AbortSignal.timeout(10_000),
            });
            if (!response.ok) {
                throw new Error(`Reddit returned HTTP ${response.status}`);
            }

            const content = await response.json();
            const post = content?.[0]?.data?.children?.[0]?.data;
            if (typeof post?.title !== "string" || typeof post?.selftext !== "string") {
                throw new Error("Reddit returned an invalid joke response");
            }

            const jokeembed = new MessageEmbed()
                .setDescription(post.selftext)
                .setColor(es.color)
                .setFooter(client.getFooter(es))
                .setTitle(post.title)
                .setAuthor("Joke")
                .setTimestamp();
            return message.reply({ embeds: [jokeembed] });
        } catch (e) {
            console.error("Failed to fetch a joke from Reddit:", e);
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle(client.la[ls].common.erroroccur)
                        .setDescription(`\`\`\` ${String(e?.message || e).slice(0, 2000)}\`\`\``),
                ],
            });
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
