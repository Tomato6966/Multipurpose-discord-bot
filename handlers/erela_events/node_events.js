const stringlength = 69;
const warnedNodes = new Set();

module.exports = client => {
    client.manager
        .on("nodeConnect", node => {
            warnedNodes.delete(node.options.identifier);
            console.log("\n");
            console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightGreen);
            console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen);
            console.log(
                `     ┃ `.bold.brightGreen +
                    `Node connected: `.bold.brightGreen +
                    " ".repeat(-1 + stringlength - ` ┃ `.length - `Node connected: `.length) +
                    "┃".bold.brightGreen
            );
            console.log(
                `     ┃ `.bold.brightGreen +
                    ` { ${node.options.identifier} } `.bold.brightGreen +
                    " ".repeat(-1 + stringlength - ` ┃ `.length - ` { ${node.options.identifier} } `.length) +
                    "┃".bold.brightGreen
            );
            console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen);
            console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightGreen);
        })
        .on("nodeCreate", () => {})
        .on("nodeReconnect", node => {
            if (!warnedNodes.has(node.options.identifier)) {
                console.log(
                    `[Lavalink] Reconnecting to node ${node.options.identifier} (${node.options.host}:${node.options.port})...`
                        .yellow
                );
            }
        })
        .on("nodeDisconnect", node => {
            if (!warnedNodes.has(node.options.identifier)) {
                console.log(`[Lavalink] Node disconnected: ${node.options.identifier}`.magenta);
            }
        })
        .on("nodeError", (node, error) => {
            const errStr = String(error?.message || error || "");
            if (errStr.includes("ECONNREFUSED")) {
                if (!warnedNodes.has(node.options.identifier)) {
                    warnedNodes.add(node.options.identifier);
                    console.warn(
                        `[Lavalink] ⚠️ Connection refused at ${node.options.host}:${node.options.port}. If you do not have a Lavalink server running, set LAVALINK_ENABLED=false in .env to disable music connection attempts.`
                            .yellow
                    );
                }
                return;
            }
            if (errStr.includes("Unable to connect after")) {
                console.warn(
                    `[Lavalink] ℹ️ Stopped connection attempts for node ${node.options.identifier} (${node.options.host}:${node.options.port}).`
                        .cyan
                );
                return;
            }
            console.error(`[Lavalink] Error on node ${node.options.identifier}:`, errStr);
        });
};
