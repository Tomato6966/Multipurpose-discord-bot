const Discord = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);

function itemList(items) {
    let result = "";
    for (const item of items.slice(0, 25)) {
        const name = String(item?.name || "Unknown item")
            .replace(/[\r\n]/g, " ")
            .replace(/@/g, "@\u200b")
            .slice(0, 80);
        const rarity = item?.rarity ? ` (${String(item.rarity).replace(/[\r\n]/g, " ").slice(0, 30)})` : "";
        const price = item?.price ? ` — ${String(item.price).replace(/[\r\n]/g, " ").slice(0, 20)} V-Bucks` : "";
        const line = `• ${name}${rarity}${price}\n`;
        if (result.length + line.length > 1_000) break;
        result += line;
    }
    return result || "No items available.";
}

module.exports = {
    name: "fnshop",
    aliases: ["fortniteshop", "fshop"],
    category: "🔰 Info",
    description: "Shows the current Fortnite Shop",
    usage: "fnshop",
    type: "games",
    run: async (client, message) => {
        const settings = client.settings.get(message.guild.id, "embed");
        const loading = await message.reply("<a:Loading:833101350623117342> Getting the Shop-Data");

        try {
            const apiKey = process.env.fnbr || config.fnbr;
            if (!apiKey) throw new Error("Missing fnbr API key configuration.");

            const response = await fetch("https://fnbr.co/api/shop", {
                headers: { "x-api-key": apiKey },
                signal: AbortSignal.timeout(10_000),
            });
            if (!response.ok) throw new Error(`fnbr.co returned HTTP ${response.status}.`);

            const payload = await response.json();
            const shop = payload?.data;
            if (!shop || !Array.isArray(shop.daily) || !Array.isArray(shop.featured)) {
                throw new Error("fnbr.co returned an invalid shop response.");
            }

            const date = shop.date && Number.isFinite(Date.parse(shop.date))
                ? new Date(shop.date).toLocaleDateString()
                : "Today";
            const embed = new Discord.EmbedBuilder()
                .setColor(settings.color)
                .setTitle(`Fortnite Item Shop — ${date}`)
                .addFields(
                    { name: "Featured", value: itemList(shop.featured) },
                    { name: "Daily", value: itemList(shop.daily) }
                )
                .setFooter(client.getFooter(settings));

            await loading.edit({ content: "", embeds: [embed] });
        } catch (error) {
            console.error("Failed to fetch Fortnite shop:", error);
            const embed = new Discord.EmbedBuilder()
                .setColor(settings.wrongcolor)
                .setTitle("Fortnite shop unavailable")
                .setDescription("The shop could not be retrieved right now. Please try again later.")
                .setFooter(client.getFooter(settings));
            await loading.edit({ content: "", embeds: [embed] });
        }
    },
};
