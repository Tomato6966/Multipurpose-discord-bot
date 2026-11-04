let enmapPatched = false;

async function getEnmap() {
    const { default: Enmap } = await import("enmap");
    if (!enmapPatched) {
        if (!Enmap.prototype.keyArray) {
            Enmap.prototype.keyArray = function (fn) {
                if (typeof fn === "function") {
                    return this.entries()
                        .filter(([key, value]) => fn(value, key, this))
                        .map(([key]) => key);
                }
                return Array.from(this.keys());
            };
        }
        if (!Enmap.prototype.filterArray) {
            Enmap.prototype.filterArray = function (fn, thisArg) {
                return Array.from(this.values()).filter(fn, thisArg);
            };
        }
        enmapPatched = true;
    }
    return Enmap;
}

module.exports = { getEnmap };

