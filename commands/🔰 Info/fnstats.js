const Discord = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);

function statValue(stats, key) {
    const stat = Array.isArray(stats) ? stats.find(value => value?.key?.toLowerCase() === key.toLowerCase()) : null;
    const value = Number(stat?.value);
    return Number.isFinite(value) ? value.toLocaleString("en-US") : "0";
}

function modeSummary(stats) {
    return [
        `Wins: ${stats?.top1?.valueInt ?? 0}`,
        `Kills: ${stats?.kills?.valueInt ?? 0}`,
        `Matches: ${stats?.matches?.valueInt ?? 0}`,
        `K/D: ${stats?.kd?.valueDec ?? 0}`,
    ].join("\n");
}

module.exports = {
    name: "fnstats",
    aliases: ["fortnitestats", "fstats"],
    category: "🔰 Info",
    description: "Shows the Fortnite Stats of a User",
    usage: "fnstats <platform> <Epic> | fnstats @USER",
    type: "games",
    run: async (client, message, args) => {
        const settings = client.settings.get(message.guild.id, "embed");
        const mentionedUser = message.mentions.users.first();
        const accountId = mentionedUser?.id || message.author.id;
        let epic;
        let platform;

        if (mentionedUser || !args[0] || !args[1]) {
            client.epicgamesDB.ensure(accountId, {
                epic: "",
                user: accountId,
                guild: message.guild.id,
                Platform: "",
                InputMethod: "",
            });
            const linkedAccount = client.epicgamesDB.get(accountId);
            if (!linkedAccount?.epic || linkedAccount.epic.length < 5) {
                return message.reply(
                    mentionedUser
                        ? `❌ **${mentionedUser.tag}** has not linked an Epic Games account.`
                        : "❌ Your account is not linked. Use `fnstats <platform> <Epic>` instead."
                );
            }
            epic = linkedAccount.epic;
            platform = linkedAccount.Platform;
        } else {
            platform = String(args[0]).toLowerCase();
            epic = args.slice(1).join(" ").trim();
        }

        if (!["pc", "xbl", "psn"].includes(String(platform).toLowerCase())) {
            return message.reply("Please enter a valid platform: `pc`, `xbl`, or `psn`.");
        }
        if (!epic) return message.reply("Please enter an Epic Games name.");

        const loading = await message.reply(`⏳ Getting the Fortnite Stats of ${epic}`);
        try {
            const apiKey = process.env.fortnitetracker || config.fortnitetracker;
            if (!apiKey) throw new Error("Missing Fortnite Tracker API key configuration.");

            const endpoint = `https://api.fortnitetracker.com/v1/profile/${encodeURIComponent(
                String(platform).toLowerCase()
            )}/${encodeURIComponent(epic)}`;
            const response = await fetch(endpoint, {
                headers: { "TRN-Api-Key": apiKey },
                signal: AbortSignal.timeout(10_000),
            });
            if (response.status === 404) {
                await loading.edit({ content: "User not found. Check the Epic name and platform.", embeds: [] });
                return;
            }
            if (!response.ok) throw new Error(`Fortnite Tracker returned HTTP ${response.status}.`);

            const profile = await response.json();
            if (profile?.error || !Array.isArray(profile?.lifeTimeStats)) {
                await loading.edit({ content: "User not found or Fortnite Tracker returned no stats.", embeds: [] });
                return;
            }

            const modes = profile.stats || {};
            const embed = new Discord.EmbedBuilder()
                .setColor(settings.color)
                .setTitle(`Fortnite Stats: ${String(profile.epicUserHandle || epic).slice(0, 200)}`)
                .setURL(`https://fortnitetracker.com/profile/${platform}/${encodeURIComponent(epic)}`)
                .addFields(
                    {
                        name: "Lifetime",
                        value: [
                            `Wins: ${statValue(profile.lifeTimeStats, "Wins")}`,
                            `Kills: ${statValue(profile.lifeTimeStats, "Kills")}`,
                            `Matches: ${statValue(profile.lifeTimeStats, "Matches Played")}`,
                            `K/D: ${statValue(profile.lifeTimeStats, "K/d")}`,
                        ].join("\n"),
                        inline: true,
                    },
                    { name: "Solo", value: modeSummary(modes.p2), inline: true },
                    { name: "Duo", value: modeSummary(modes.p10), inline: true },
                    { name: "Squad", value: modeSummary(modes.p9), inline: true }
                )
                .setFooter(client.getFooter(settings));

            await loading.edit({ content: "", embeds: [embed] });
        } catch (error) {
            console.error("Failed to fetch Fortnite stats:", error);
            const embed = new Discord.EmbedBuilder()
                .setColor(settings.wrongcolor)
                .setTitle("Fortnite stats unavailable")
                .setDescription("Stats could not be retrieved right now. Please try again later.")
                .setFooter(client.getFooter(settings));
            await loading.edit({ content: "", embeds: [embed] });
        }
    },
};
