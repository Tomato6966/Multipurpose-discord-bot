require("dotenv").config();
const { REST, Routes } = require("discord.js");
const config = require("../botconfig/config.json");
const Discord = require("../handlers/discord-compat");

async function deploy() {
    const token = (process.env.token || config.token || "").trim();
    if (!token || /^(?:get from:|your[_ -]|replace[_ -]|<)/i.test(token)) {
        console.error("Missing Discord bot token. Please set token in .env or botconfig/config.json.");
        process.exit(1);
    }

    const client = {
        allCommands: [],
        slashCommands: new Discord.Collection(),
    };

    require("../handlers/slashCommands")(client);
    console.log(`Prepared ${client.allCommands.length} top-level slash commands.`);

    const rest = new REST({ version: "10" }).setToken(token);

    try {
        console.log("Fetching bot user details...");
        const currentUser = await rest.get(Routes.user());
        const clientId = currentUser.id;
        console.log(`Authenticated as ${currentUser.username} (${clientId}).`);

        const guildId = process.env.GUILD_ID;
        if (guildId) {
            console.log(`Registering slash commands to Guild ${guildId}...`);
            const data = await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: client.allCommands }
            );
            console.log(`Successfully registered ${data.length} guild slash commands!`);
        } else {
            console.log("Registering slash commands globally (may take up to an hour to cache across Discord)...");
            const data = await rest.put(
                Routes.applicationCommands(clientId),
                { body: client.allCommands }
            );
            console.log(`Successfully registered ${data.length} global slash commands!`);
        }
    } catch (error) {
        console.error("Error deploying slash commands:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    deploy();
}

module.exports = { deploy };

