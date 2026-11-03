const assert = require("node:assert/strict");
const fnshop = require("../commands/🔰 Info/fnshop");
const fnstats = require("../commands/🔰 Info/fnstats");

function createHarness() {
    const edits = [];
    const client = {
        settings: { get: () => ({ color: 0x123456, wrongcolor: 0xff0000 }) },
        getFooter: () => ({ text: "Test bot" }),
        epicgamesDB: { ensure() {}, get: () => null },
    };
    const message = {
        guild: { id: "guild-id" },
        author: { id: "user-id", tag: "User" },
        mentions: { users: { first: () => undefined } },
        reply: async () => ({
            edit: async payload => edits.push(payload),
        }),
    };
    return { client, message, edits };
}

async function main() {
    const originalFetch = global.fetch;
    const originalFnbrKey = process.env.fnbr;
    const originalTrackerKey = process.env.fortnitetracker;
    process.env.fnbr = "test-fnbr-key";
    process.env.fortnitetracker = "test-tracker-key";

    try {
        const shopHarness = createHarness();
        let shopRequest;
        global.fetch = async (url, options) => {
            shopRequest = { url, options };
            return {
                ok: true,
                status: 200,
                json: async () => ({
                    data: {
                        date: "2025-01-02T00:00:00.000Z",
                        featured: [{ name: "Featured Outfit", rarity: "epic", price: "1,500" }],
                        daily: [{ name: "Daily Emote", rarity: "rare", price: "500" }],
                    },
                }),
            };
        };
        await fnshop.run(shopHarness.client, shopHarness.message);
        assert.equal(shopRequest.url, "https://fnbr.co/api/shop");
        assert.equal(shopRequest.options.headers["x-api-key"], "test-fnbr-key");
        assert(shopRequest.options.signal instanceof AbortSignal);
        const shopEmbed = shopHarness.edits[0].embeds[0].toJSON();
        assert.match(shopEmbed.title, /Fortnite Item Shop/);
        assert.match(shopEmbed.fields[0].value, /Featured Outfit/);
        assert.match(shopEmbed.fields[1].value, /Daily Emote/);

        const statsHarness = createHarness();
        let statsRequest;
        global.fetch = async (url, options) => {
            statsRequest = { url, options };
            return {
                ok: true,
                status: 200,
                json: async () => ({
                    accountId: "account-id",
                    epicUserHandle: "Player One",
                    lifeTimeStats: [
                        { key: "Wins", value: "12" },
                        { key: "Kills", value: "345" },
                        { key: "Matches Played", value: "678" },
                        { key: "K/d", value: "1.25" },
                    ],
                    stats: {
                        p2: { top1: { valueInt: 4 }, kills: { valueInt: 100 }, matches: { valueInt: 50 }, kd: { valueDec: 2 } },
                    },
                }),
            };
        };
        await fnstats.run(statsHarness.client, statsHarness.message, ["pc", "Player", "One"]);
        assert.equal(statsRequest.options.headers["TRN-Api-Key"], "test-tracker-key");
        assert(statsRequest.options.signal instanceof AbortSignal);
        assert.match(statsRequest.url, /\/profile\/pc\/Player%20One$/);
        const statsEmbed = statsHarness.edits[0].embeds[0].toJSON();
        assert.match(statsEmbed.title, /Player One/);
        assert.match(statsEmbed.fields[0].value, /Wins: 12/);
        assert.match(statsEmbed.fields[1].value, /Kills: 100/);
    } finally {
        global.fetch = originalFetch;
        if (originalFnbrKey === undefined) delete process.env.fnbr;
        else process.env.fnbr = originalFnbrKey;
        if (originalTrackerKey === undefined) delete process.env.fortnitetracker;
        else process.env.fortnitetracker = originalTrackerKey;
    }

    console.log("Fortnite command API and embed checks passed.");
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
