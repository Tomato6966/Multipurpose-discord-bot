const { readdirSync } = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const files = [];

function collectJavaScriptFiles(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (entry.isDirectory() && [".git", "node_modules"].includes(entry.name)) {
            continue;
        }

        const filePath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            collectJavaScriptFiles(filePath);
        } else if (entry.isFile() && entry.name.endsWith(".js")) {
            files.push(filePath);
        }
    }
}

collectJavaScriptFiles(root);

let hasErrors = false;
for (const file of files) {
    const result = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
    if (result.status !== 0) {
        hasErrors = true;
        process.stderr.write(`${path.relative(root, file)}\n${result.stderr || result.error}\n`);
    }
}

if (hasErrors) {
    process.exitCode = 1;
} else {
    console.log(`Syntax checked ${files.length} JavaScript files.`);
}
