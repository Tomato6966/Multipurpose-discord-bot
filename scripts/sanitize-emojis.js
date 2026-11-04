const fs = require("fs");
const path = require("path");

const exactReplacements = {
    "<:no:833101993668771842>": "❌",
    "<a:yes:833101995723194437>": "✅",
    "<a:yes:929001012830806016>": "✅",
    "<:arrow:832598861813776394>": "▶️",
    "<:joines:866356465299488809>": "➕",
    "<:leaves:866356598356049930>": "➖",
    "<:Discord:787321652345438228>": "💬",
    "<:Like:857334024087011378>": "👍",
    "<a:Loading:833101350623117342>": "⏳",
    "<a:Loading:592829210054098944>": "⏳",
    "<:Milrato:840259659163893820>": "🛡️",
    "<a:Server_Boosts:867777823468027924>": "🚀",
    "<:Youtube:840260133686870036>": "📺",
    "<:Bittmax:840370610755862529>": "🖥️",
    "<:BeroHost:852970925695041646>": "🌐",
    "<a:nitro:833402717506502707>": "💎",
    "<a:nitro_logo:833402717950836806>": "💎",
    "<a:Tada_Yellow:867721863151747092>": "🎉",
    "<a:Tada_Green:867721862858539048>": "🎉",
    "<:Tada_WON:867724032207224833>": "🎉",
    "<a:Join_vc:863876115584385074>": "🔊",
    "<:twitter:840255600851812393>": "🐦",
    "<:TOMATO:858450817665204224>": "🍅",
    "<:Spotify:846090652231663647>": "🎵",
    "<:PAYPAL:861207258846330880>": "💳",
    "<:PATREON:861207934070816849>": "🪙",
    "<:clanbot:832697296687726654>": "🤖",
    "<:Cat_Sad:867722685949804565>": "😿",
    "<a:Valid_Code_Developer:858405056238714930>": "👨‍💻",
    "<a:Light_Saber_Dancce:867721861462229013>": "💃",
    "<a:Gift:853993605868683285>": "🎁",
    "<:Crying:867724032316407828>": "😢",
    "<:Builder:866089513654419466>": "👷",
    "<:progressbar_left_filled:818558865268408341>": "🟩",
};

// Add number emojis
for (let i = 0; i <= 25; i++) {
    exactReplacements[`<:Number_${i}:843943149915078696>`] = `${i}️⃣`;
}

function cleanEmojiTag(match, animated, name, id) {
    if (exactReplacements[match]) {
        return exactReplacements[match];
    }
    const lowerName = name.toLowerCase();
    if (lowerName.includes("no") || lowerName.includes("error") || lowerName.includes("cancel") || lowerName.includes("cross")) return "❌";
    if (lowerName.includes("yes") || lowerName.includes("check") || lowerName.includes("success") || lowerName.includes("valid")) return "✅";
    if (lowerName.includes("load") || lowerName.includes("wait")) return "⏳";
    if (lowerName.includes("arrow") || lowerName.includes("play")) return "▶️";
    if (lowerName.includes("leave") || lowerName.includes("minus") || lowerName.includes("remove")) return "➖";
    if (lowerName.includes("join") || lowerName.includes("plus") || lowerName.includes("add")) return "➕";
    if (lowerName.includes("boost")) return "🚀";
    if (lowerName.includes("gift") || lowerName.includes("present")) return "🎁";
    if (lowerName.includes("tada") || lowerName.includes("party")) return "🎉";
    if (lowerName.includes("sad") || lowerName.includes("cry")) return "😢";
    if (lowerName.includes("bot") || lowerName.includes("robot")) return "🤖";
    if (lowerName.includes("youtube")) return "📺";
    if (lowerName.includes("twitter")) return "🐦";
    if (lowerName.includes("spotify") || lowerName.includes("music") || lowerName.includes("song")) return "🎵";
    if (lowerName.includes("vc") || lowerName.includes("voice")) return "🔊";
    if (lowerName.includes("code") || lowerName.includes("dev")) return "💻";
    if (lowerName.includes("nitro")) return "💎";
    if (lowerName.includes("like")) return "👍";
    return "🔹";
}

const emojiRegex = /<(a)?:([a-zA-Z0-9_]+):([0-9]+)>/g;

const targetDirs = ["commands", "handlers", "events", "slashCommands", "botconfig", "languages"];

let totalReplaced = 0;
let filesModified = 0;

function processDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name !== "node_modules" && entry.name !== ".git" && entry.name !== "databases") {
                processDir(fullPath);
            }
        } else if (entry.isFile() && (entry.name.endsWith(".js") || entry.name.endsWith(".json"))) {
            let content = fs.readFileSync(fullPath, "utf8");
            let fileReplaced = 0;
            const newContent = content.replace(emojiRegex, (match, animated, name, id) => {
                fileReplaced++;
                totalReplaced++;
                return cleanEmojiTag(match, animated, name, id);
            });
            if (fileReplaced > 0) {
                fs.writeFileSync(fullPath, newContent, "utf8");
                filesModified++;
                console.log(`Updated ${fileReplaced} emojis in ${fullPath}`);
            }
        }
    }
}

for (const dir of targetDirs) {
    const fullDir = path.resolve(__dirname, "..", dir);
    if (fs.existsSync(fullDir)) {
        processDir(fullDir);
    }
}

console.log(`\nFinished: Modified ${filesModified} files with ${totalReplaced} emoji replacements.`);

