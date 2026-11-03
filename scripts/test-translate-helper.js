const assert = require("node:assert/strict");
const translate = require("../handlers/translate");

async function main() {
    const originalFetch = global.fetch;
    let request;
    global.fetch = async (url, options) => {
        request = { url: new URL(url), options };
        return {
            ok: true,
            status: 200,
            json: async () => [[["Hola", "Hello"], [" mundo", " world"]]],
        };
    };

    try {
        const result = await translate("Hello world", { from: "en", to: "es" });
        assert.equal(result.text, "Hola mundo");
        assert.equal(request.url.searchParams.get("sl"), "en");
        assert.equal(request.url.searchParams.get("tl"), "es");
        assert.equal(request.url.searchParams.get("q"), "Hello world");
        assert(request.options.signal instanceof AbortSignal);

        await assert.rejects(() => translate(" ", { from: "en", to: "es" }), /cannot be empty/);
        await assert.rejects(() => translate("é".repeat(2_501), { from: "en", to: "es" }), /5,000 bytes/);
    } finally {
        global.fetch = originalFetch;
    }

    console.log("Translation input, timeout, and response checks passed.");
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
