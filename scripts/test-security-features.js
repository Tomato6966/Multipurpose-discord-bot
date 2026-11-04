const assert = require("node:assert/strict");
const Discord = require("../handlers/discord-compat");
const { isKnownScamUrl, auditServer } = require("../handlers/security-helper");

// 1. Phishing & scam detection tests
assert.equal(isKnownScamUrl("https://discord.com/channels/123/456"), false);
assert.equal(isKnownScamUrl("https://discord.gg/invite"), false);
assert.equal(isKnownScamUrl("https://steamcommunity.com/id/gamer"), false);

assert.equal(isKnownScamUrl("http://dlscord-nitro.gift/claim"), true);
assert.equal(isKnownScamUrl("http://discord-gift.xyz/free"), true);
assert.equal(isKnownScamUrl("https://steamcommunitly.com/gift/321"), true);
assert.equal(isKnownScamUrl("https://free-nitro.xyz"), true);

// 2. Server audit engine tests
const mockGuild = {
    name: "Test Guild",
    id: "123456789012345678",
    memberCount: 50,
    verificationLevel: 3, // High
    mfaLevel: 1, // Elevated
    explicitContentFilter: 2, // All members
    iconURL: () => "https://example.com/icon.png",
};

const mockClient = {
    Anti_Nuke_System: {
        has: () => true,
        get: () => ({ all: { enabled: true } }),
    },
    settings: {
        has: () => true,
        get: () => ({
            antilink: { enabled: true },
            antidiscord: { enabled: true },
        }),
    },
};

const auditResult = auditServer(mockGuild, mockClient);
assert.ok(auditResult);
assert.equal(auditResult.grade, "A+");
assert.equal(auditResult.score, 100);
assert.equal(auditResult.findings.length > 0, true);

// 3. Command exports test
const prefixCmd = require("../commands/🔰 Info/security");
assert.equal(prefixCmd.name, "security");
assert.equal(typeof prefixCmd.run, "function");

const slashCmd = require("../slashCommands/Info/security");
assert.equal(slashCmd.name, "security");
assert.equal(typeof slashCmd.run, "function");

console.log("Security helper and security commands passed all tests.");

