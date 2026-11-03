const { MessageEmbed } = require("discord.js");

const COLIRU_URL = "https://coliru.stacked-crooked.com";
const MAX_SOURCE_LENGTH = 8_000;
const REQUEST_TIMEOUT_MS = 15_000;
const COMPILERS = Object.freeze({
    cpp: "g++ main.cpp -pthread -pedantic -Wall -Wextra && ./a.out",
    "c++": "g++ main.cpp -pthread -pedantic -Wall -Wextra && ./a.out",
    c: "mv main.cpp main.c && gcc main.c -pedantic -O2 -pthread -Wall -Wextra && ./a.out",
    ruby: "ruby main.cpp",
    rb: "ruby main.cpp",
    lua: "lua main.cpp",
    python: "python main.cpp",
    py: "python main.cpp",
    haskell: "runhaskell main.cpp",
    hs: "runhaskell main.cpp",
});

async function postColiru(endpoint, payload) {
    const response = await fetch(`${COLIRU_URL}/${endpoint}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
        throw new Error(`Coliru returned HTTP ${response.status}`);
    }

    return response.text();
}

function getCodeBlock(text) {
    const match = /^```(\S*)\n?([^]*)\n?```$/.exec(text);
    if (!match) return { lang: null, code: text };
    if (match[1] && !match[2]) return { lang: null, code: match[1] };
    return { lang: match[1].toLowerCase(), code: match[2] };
}

function safeCodeBlock(text) {
    return String(text).replace(/```/g, "ˋˋˋ").replace(/@/g, "@\u200b").slice(0, 1_850);
}

module.exports = {
    name: "coliru",
    category: "⌨️ Programming",
    aliases: [],
    cooldown: 4,
    usage: "coliru ```language\\ncode\\n```",
    description: "Compile code on Coliru; do not send secrets or sensitive code.",
    run: async (client, message, args, cmduser, text, prefix) => {
        const es = client.settings.get(message.guild.id, "embed");
        const ls = client.settings.get(message.guild.id, "language");

        try {
            const { lang, code } = getCodeBlock(args.join(" "));
            if (!lang || !code) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(es.wrongcolor)
                            .setFooter(client.getFooter(es))
                            .setTitle("Compile code")
                            .setDescription(
                                `Usage:\n${prefix}coliru` +
                                    " ```language\nCode\n```\nCode is sent to the public Coliru compiler service."
                            ),
                    ],
                    allowedMentions: { parse: [] },
                });
            }

            if (!Object.hasOwn(COMPILERS, lang)) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(es.wrongcolor)
                            .setFooter(client.getFooter(es))
                            .setTitle("Unsupported language")
                            .setDescription(`Supported languages: ${Object.keys(COMPILERS).join(", ")}`),
                    ],
                    allowedMentions: { parse: [] },
                });
            }

            if (code.length > MAX_SOURCE_LENGTH) {
                return message.reply({
                    content: `Please keep code under ${MAX_SOURCE_LENGTH.toLocaleString()} characters.`,
                    allowedMentions: { parse: [] },
                });
            }

            const payload = { cmd: COMPILERS[lang], src: code };
            const result = await postColiru("compile", payload);
            if (result.length < 1_900) {
                return message.reply({
                    content: `\`\`\`${lang}\n${safeCodeBlock(result)}\n\`\`\``,
                    allowedMentions: { parse: [] },
                });
            }

            const id = (await postColiru("share", payload)).trim();
            if (!/^[a-zA-Z0-9_-]{1,128}$/.test(id)) {
                throw new Error("Coliru returned an invalid share identifier");
            }

            return message.reply({
                content: `Output was too long to display. [View the result on Coliru](${COLIRU_URL}/a/${id})`,
                allowedMentions: { parse: [] },
            });
        } catch (error) {
            console.error("Coliru compilation failed:", error);
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle(client.la[ls].common.erroroccur)
                        .setDescription(
                            "The remote compiler is unavailable or returned an invalid response. Please try again later."
                        ),
                ],
                allowedMentions: { parse: [] },
            });
        }
    },
};
