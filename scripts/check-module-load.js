const { readdirSync } = require("node:fs");
const path = require("node:path");

require("../handlers/discord-compat");

const root = path.resolve(__dirname, "..");
const files = [];
const failures = [];

function collect(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if ([".git", "node_modules", "scripts"].includes(entry.name)) continue;
        const filePath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            collect(filePath);
        } else if (entry.isFile() && entry.name.endsWith(".js") && entry.name !== "index.js") {
            files.push(filePath);
        }
    }
}

collect(root);
for (const file of files) {
    try {
        require(file);
    } catch (error) {
        failures.push(`${path.relative(root, file)}\n${error.stack || error}`);
    }
}

if (failures.length) {
    console.error(`Failed to load ${failures.length} of ${files.length} modules:\n${failures.join("\n\n")}`);
    process.exitCode = 1;
} else {
    console.log(`Loaded ${files.length} JavaScript modules using Discord.js ${require("discord.js").version}.`);
}
