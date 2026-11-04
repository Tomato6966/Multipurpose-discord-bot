const Discord = require("discord.js");

const SCAM_DOMAIN_PATTERNS = [
    /d[i1l]sc[o0]rd[a-z0-9-]*\.(gift|gg|com|org|net|xyz|app|club|info)/i,
    /d[i1l]sc[o0]r[cd]-(nitro|gift|drop|boost|airdrop|steam|free)/i,
    /nitro-?(discord|gift|free|drop|boost)/i,
    /discorcl\./i,
    /dlscord\./i,
    /steamc[o0]m+un[a-z0-9-]*\./i,
    /steam-?(gift|trade|community|nitro)\./i,
    /trade-?steam\./i,
    /free-?nitro/i,
];

function isKnownScamUrl(input) {
    if (!input || typeof input !== "string") return false;
    const lower = input.toLowerCase();
    // Exclude genuine Discord and Steam domains
    if (
        lower.includes("discord.com/") ||
        lower.includes("discord.gg/") ||
        lower.includes("discordapp.com/") ||
        lower.includes("discordapp.net/") ||
        lower.includes("steamcommunity.com/") ||
        lower.includes("steampowered.com/")
    ) {
        return false;
    }
    return SCAM_DOMAIN_PATTERNS.some(pattern => pattern.test(lower));
}

function auditServer(guild, client) {
    if (!guild) return null;

    let score = 100;
    const findings = [];
    const recommendations = [];

    // 1. Verification Level
    // Verification levels: 0 = NONE, 1 = LOW, 2 = MEDIUM, 3 = HIGH, 4 = VERY_HIGH
    const vLevel = guild.verificationLevel;
    const vNames = ["None", "Low", "Medium", "High", "Very High"];
    const vName = typeof vLevel === "number" ? (vNames[vLevel] || String(vLevel)) : String(vLevel);

    if (vLevel === 0 || vName === "None" || vName === "0") {
        score -= 25;
        findings.push("⚠️ **Verification Level:** None (Vulnerable to raid bots)");
        recommendations.push("Set Server Verification to Medium or High in Server Settings.");
    } else if (vLevel === 1 || vName === "Low" || vName === "1") {
        score -= 10;
        findings.push("ℹ️ **Verification Level:** Low (Verified email required)");
    } else {
        findings.push(`✅ **Verification Level:** ${vName}`);
    }

    // 2. 2FA Moderation requirement
    const mfa = guild.mfaLevel;
    if (mfa === 1 || mfa === "ELEVATED" || mfa === "Elevated") {
        findings.push("✅ **2FA Requirement for Moderation:** Enabled");
    } else {
        score -= 15;
        findings.push("⚠️ **2FA Requirement:** Disabled (Moderators can act without 2FA)");
        recommendations.push("Enable 2FA requirement for moderation in Server Settings.");
    }

    // 3. Explicit Content Filter
    // 0 = DISABLED, 1 = MEMBERS_WITHOUT_ROLES, 2 = ALL_MEMBERS
    const ecf = guild.explicitContentFilter;
    const ecfNames = ["Disabled", "Members without roles", "All members"];
    const ecfName = typeof ecf === "number" ? (ecfNames[ecf] || String(ecf)) : String(ecf);

    if (ecf === 0 || ecfName === "Disabled" || ecfName === "0") {
        score -= 15;
        findings.push("⚠️ **Explicit Content Filter:** Disabled");
        recommendations.push("Set Explicit Content Filter to scan messages from all members.");
    } else if (ecf === 2 || ecfName === "All members" || ecfName === "2") {
        findings.push("✅ **Explicit Content Filter:** Scanning all members");
    } else {
        findings.push(`ℹ️ **Explicit Content Filter:** ${ecfName}`);
    }

    // 4. Bot internal protections
    let antiNukeEnabled = false;
    if (client.Anti_Nuke_System && client.Anti_Nuke_System.has(guild.id)) {
        const anData = client.Anti_Nuke_System.get(guild.id);
        antiNukeEnabled = Boolean(anData?.all?.enabled);
    }
    if (antiNukeEnabled) {
        findings.push("✅ **Anti-Nuke System:** Active");
    } else {
        score -= 15;
        findings.push("⚠️ **Anti-Nuke System:** Disabled");
        recommendations.push("Enable the Anti-Nuke system using setup commands.");
    }

    let antiLinkEnabled = false;
    let antiDiscordEnabled = false;
    if (client.settings && client.settings.has(guild.id)) {
        const s = client.settings.get(guild.id);
        antiLinkEnabled = Boolean(s?.antilink?.enabled);
        antiDiscordEnabled = Boolean(s?.antidiscord?.enabled);
    }

    findings.push(
        antiLinkEnabled ? "✅ **Anti-Link Filter:** Active" : "ℹ️ **Anti-Link Filter:** Inactive"
    );
    findings.push(
        antiDiscordEnabled ? "✅ **Anti-Invite Filter:** Active" : "ℹ️ **Anti-Invite Filter:** Inactive"
    );

    // Compute Grade
    let grade = "A+";
    let color = "Green";
    if (score >= 90) {
        grade = "A+";
        color = "Green";
    } else if (score >= 80) {
        grade = "A";
        color = "Green";
    } else if (score >= 65) {
        grade = "B";
        color = "Yellow";
    } else if (score >= 50) {
        grade = "C";
        color = "Orange";
    } else {
        grade = "D";
        color = "Red";
    }

    return {
        score: Math.max(0, score),
        grade,
        color,
        findings,
        recommendations,
        guildName: guild.name,
        guildId: guild.id,
        memberCount: guild.memberCount,
    };
}

module.exports = {
    isKnownScamUrl,
    auditServer,
    SCAM_DOMAIN_PATTERNS,
};
