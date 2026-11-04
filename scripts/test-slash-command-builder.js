const assert = require("node:assert/strict");
const Discord = require("../handlers/discord-compat");

const client = {
    allCommands: [],
    slashCommands: new Discord.Collection(),
};

require("../handlers/slashCommands")(client);

assert.equal(client.allCommands.length, 6, "Expected all five grouped slash commands and the chat command to load.");
for (const command of client.allCommands) {
    assert.ok(command.name);
    assert.ok(Array.isArray(command.options));
}

console.log(`Built ${client.allCommands.length} slash command definitions.`);
