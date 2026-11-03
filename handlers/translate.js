const MAX_TEXT_BYTES = 5_000;

module.exports = async function translate(text, { from, to }) {
    const input = String(text || "");
    if (!input.trim()) throw new TypeError("Text to translate cannot be empty.");
    if (Buffer.byteLength(input, "utf8") > MAX_TEXT_BYTES) {
        throw new RangeError(`Text to translate must not exceed ${MAX_TEXT_BYTES.toLocaleString("en-US")} bytes.`);
    }

    const params = new URLSearchParams({
        client: "gtx",
        sl: from || "auto",
        tl: to || "en",
        dt: "t",
        q: input,
    });
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?${params}`, {
        signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Translation service returned HTTP ${response.status}.`);

    const payload = await response.json();
    const translatedText = Array.isArray(payload?.[0])
        ? payload[0]
              .map(segment => segment?.[0])
              .filter(segment => typeof segment === "string")
              .join("")
        : "";
    if (!translatedText) throw new Error("Translation service returned an empty result.");

    return { text: translatedText };
};
