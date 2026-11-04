const { MessageEmbed } = require("discord.js");
const { auditServer } = require("../../handlers/security-helper");

module.exports = {
    name: "security",
    description: "Performs a 2026 server security and health audit",
    run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
        const { guild } = interaction;
        try {
            const audit = auditServer(guild, client);
            if (!audit) {
                return interaction.reply({
                    content: "❌ Could not perform security audit for this guild.",
                    ephemeral: true,
                });
            }

            const embed = new MessageEmbed()
                .setColor(audit.color)
                .setTitle(`🛡️ Server Security Audit: ${audit.guildName}`)
                .setDescription(
                    `**Overall Security Score:** \`${audit.score}/100\` — **Grade: \`${audit.grade}\`**\n` +
                    `Audited at \`${new Date().toISOString().split("T")[0]}\` (2026 Enhanced Protection Engine)`
                )
                .addField("📋 Security Findings", audit.findings.join("\n") || "No findings recorded.")
                .setThumbnail(guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL())
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

            return interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (e) {
            console.error("Error in slash security command:", e);
            return interaction.reply({
                ephemeral: true,
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

