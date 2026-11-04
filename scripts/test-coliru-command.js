const assert = require("node:assert/strict");
require("../handlers/discord-compat");
const command = require("../commands/⌨️ Programming/coliru");

function createContext() {
    const replies = [];
    const client = {
        settings: {
            get: (_guildId, key) => (key === "language" ? "en" : { wrongcolor: "#ff0000" }),
        },
        getFooter: () => "footer",
        la: { en: { common: { erroroccur: "Error" } } },
    };
    const message = {
        guild: { id: "test-guild" },
        reply: async payload => {
            replies.push(payload);
            return payload;
        },
    };

    return { client, message, replies };
}

async function main() {
    const originalFetch = global.fetch;
    const requests = [];
    try {
        global.fetch = async (url, options) => {
            requests.push({ url, options });
            return new Response("compiled output", { status: 200 });
        };

        const valid = createContext();
        await command.run(valid.client, valid.message, ["```python\nprint(1)\n```"], null, "", "!");
        assert.equal(requests.length, 1);
        assert.equal(requests[0].url, "https://coliru.stacked-crooked.com/compile");
        assert.equal(requests[0].options.signal.aborted, false);
        assert.deepEqual(valid.replies[0].allowedMentions, { parse: [] });
        assert.match(valid.replies[0].content, /compiled output/);

        const unsupported = createContext();
        await command.run(unsupported.client, unsupported.message, ["```bash\necho hi\n```"], null, "", "!");
        assert.equal(requests.length, 1);
        assert.match(unsupported.replies[0].embeds[0].data.title, /Unsupported language/);

        const oversized = createContext();
        await command.run(
            oversized.client,
            oversized.message,
            [`\`\`\`python\n${"x".repeat(8_001)}\n\`\`\``],
            null,
            "",
            "!"
        );
        assert.equal(requests.length, 1);
        assert.match(oversized.replies[0].content, /8,000 characters/);
    } finally {
        global.fetch = originalFetch;
    }

    console.log("Coliru command safety checks passed.");
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
