const emojis = require("./emojis.json");

function getNumberEmojis() {
    return emojis.numberEmojis;
}

function isEmoji(client, message, emoji) {
    if (!emoji) return false;
    const regexExp = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
    let unicode = regexExp.test(String(emoji));
    if (unicode) {
        return true;
    }
    let dcemoji = client?.emojis?.cache?.has(emoji) || message?.guild?.emojis?.cache?.has(emoji);
    if (dcemoji) return true;
    return false;
}

module.exports = {
    getNumberEmojis,
    isEmoji,
    allEmojis: emojis,
};
