const assert = require("node:assert/strict");
const Discord = require("../handlers/discord-compat");

assert.equal(typeof Discord.MessageEmbed, "function");
assert.equal(typeof Discord.MessageAttachment, "function");
assert.equal(typeof Discord.MessageActionRow, "function");
assert.equal(typeof Discord.MessageButton, "function");
assert.equal(typeof Discord.MessageSelectMenu, "function");
assert.ok(Discord.Intents.FLAGS.GUILDS);
assert.equal(typeof Discord.Permissions, "function");
assert.ok(Discord.Permissions.FLAGS.ADMINISTRATOR);
assert.ok(new Discord.Permissions([Discord.Permissions.FLAGS.ADMINISTRATOR]).has(Discord.Permissions.FLAGS.ADMINISTRATOR));
assert.ok(new Discord.Intents([Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS]).has(Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS));
const testCol = new Discord.Collection([["k1", "v1"], ["k2", "v2"]]);
assert.deepEqual(testCol.keyArray(), ["k1", "k2"]);
assert.deepEqual(testCol.array(), ["v1", "v2"]);
assert.equal(
    new Discord.MessageEmbed().setFooter("footer").addField("name", "value").data.fields[0].name,
    "name"
);
assert.equal(new Discord.MessageButton().setStyle("PRIMARY").data.style, Discord.ButtonStyle.Primary);
assert.equal(typeof Discord.BaseInteraction.prototype.isCommand, "function");
assert.equal(typeof Discord.BaseInteraction.prototype.isSelectMenu, "function");
assert.deepEqual(Discord.Util.splitMessage("first\nsecond", { maxLength: 6 }), ["first\n", "second"]);

const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS],
    partials: ["MESSAGE", "CHANNEL"],
    presence: { activities: [{ name: "test", type: "PLAYING" }] },
});
assert.ok(client instanceof Discord.Client);
assert.deepEqual(client.options.partials, [Discord.Partials.Message, Discord.Partials.Channel]);
assert.equal(client.options.presence.activities[0].type, Discord.ActivityType.Playing);
client.destroy();

console.log(`Discord.js ${Discord.version} compatibility checks passed.`);
