const { MessageEmbed } = require("discord.js");
const { auditServer } = require("../../handlers/security-helper");

module.exports = {
    name: "security",
    category: "🔰 Info",
    aliases: ["sec", "audit", "securityaudit", "serverhealth"],
    cooldown: 5,
    usage: "security",
    description: "Performs a 2026 server security and health audit",
    type: "server",
    run: async (client, message, args, cmduser, text, prefix) => {
        let es = client.settings?.get(message.guild.id, "embed") || {};
        try {
            const audit = auditServer(message.guild, client);
            if (!audit) {
                return message.reply({ content: "❌ Could not perform security audit." });
            }

            const embed = new MessageEmbed()
                .setColor(audit.color)
                .setTitle(`🛡️ Server Security Audit: ${audit.guildName}`)
                .setDescription(
                    `**Overall Security Score:** \`${audit.score}/100\` — **Grade: \`${audit.grade}\`**\n` +
                    `Audited at \`${new Date().toISOString().split("T")[0]}\` (2026 Enhanced Protection Engine)`
                )
                .addField("📋 Security Findings", audit.findings.join("\n") || "No findings recorded.")
                .setThumbnail(message.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL())
                .setFooter(
                    client.getFooter
                        ? client.getFooter(es)
                        : { text: "Server Security System • 2026 Edition" }
                );

            if (audit.recommendations.length > 0) {
                embed.addField(
                    "💡 Recommended Hardening Steps",
                    audit.recommendations.map((r, i) => `**${i + 1}.** ${r}`).join("\n")
                );
            }

            return message.reply({ embeds: [embed] });
        } catch (e) {
            console.error("Error in security command:", e);
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("Red")
                        .setTitle("❌ Error Running Security Audit")
                        .setDescription(e.message ? `\`\`\`${e.message.substring(0, 1000)}\`\`\`` : "An error occurred."),
                ],
            });
        }
    },
};

