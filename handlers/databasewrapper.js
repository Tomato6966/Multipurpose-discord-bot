const mongoose = require('mongoose');
const Tinyfy = require("tiny-typed-emitter");
const lodash = require("lodash");

const StandardSchema = new mongoose.Schema({
    ID: {
        type: mongoose.SchemaTypes.String,
        required: !0,
        unique: !0
    },
    data: {
        type: mongoose.SchemaTypes.Mixed,
        required: !1
    },
    expireAt: {
        type: mongoose.SchemaTypes.Date,
        required: !1,
        default: null
    }
}, {
    timestamps: !0
})

const UtilClass = class extends null {
    constructor() { }
    static v(t, e, n) {
        return typeof t === e && !!t ? t : n
    }
    static pick(t, e) {
        if (!t || typeof t != "object" || !e || typeof e != "string" || !e.includes(".")) return t;
        let n = UtilClass.getKeyMetadata(e);
        return lodash.get(Object.assign({}, t), n.target)
    }
    static getKey(t) {
        return t.split(".").shift()
    }
    static getKeyMetadata(t) {
        let [e, ...n] = t.split(".");
        return {
            master: e,
            child: n,
            target: n.join(".")
        }
    }
    static shouldExpire(t) {
        return !(typeof t != "number" || t > 1 / 0 || t <= 0 || Number.isNaN(t))
    }
    static createDuration(t) {
        return UtilClass.shouldExpire(t) ? new Date(Date.now() + t) : null
    }
};
const DatabaseClass = class extends Tinyfy.TypedEmitter {
    constructor(t, e = {}) {
        super();
        this.url = t;
        this.options = e;
        this.parent = null;
        this.__child__ = !1;
        this.model = null;
        this.cache = new Map(),
        Object.defineProperty(this, "__child__", {
            writable: !0,
            enumerable: !1,
            configurable: !0
        })
    }
    isChild() {
        return !this.isParent()
    }
    isParent() {
        return !this.__child__
    }
    get ready() {
        return !!(this.model && this.connection)
    }
    get readyState() {
        return this.connection?.readyState ?? 0
    }
    async getRaw(key) {
        return new Promise(async (res) => {
            this.__readyCheck();
            let e = await this.model.findOne({
                ID: UtilClass.getKey(key)
            });
            return res(!e || e.expireAt && e.expireAt.getTime() - Date.now() <= 0 ? null : e)
        })
    }
    async get(key) {
        var RawData = null;
        if(this.cache.has(key)) {
            RawData = this.cache.get(key);
            key == "748088208427974676" ? console.log(`${"GET".blue} ${String(this.cache.has(key)).green} for the Key: ${String(key).green} in ${String(this.model.collection.name).green}`.dim) : null
        }
        else {
            key == "748088208427974676" ? console.log(`${"FETCH-DB".blue} ${String(this.cache.has(key)).green} for the Key: ${String(key).green} in ${String(this.model.collection.name).green}`.dim) : null
            RawData = await this.getRaw(key)
            this.cache.set(key, RawData); 
        }
        let returnData = UtilClass.pick(this.__formatData(RawData), key);
        return returnData  // formattedData
    }
    async fetch(key) {
        return await this.get(key)
    }
    async set(t, e, n = -1) {
        if(this.cache.has(t)) {
            t == "748088208427974676" ? console.log(`${"DELETE".blue} Cache for ${String(t).green} in ${String(this.model.collection.name).green} [db.set()]`.dim) : null;
            this.cache.delete(t);
        }
        if (this.__readyCheck(), t.includes(".")) {
            const r = UtilClass.getKeyMetadata(t);
            const o = await this.model.findOne({
                ID: r.master
            })
            if (!o) {
                return await this.model.create(UtilClass.shouldExpire(n) ? {
                    ID: r.master,
                    data: lodash.set({}, r.target, e),
                    expireAt: UtilClass.createDuration(n * 1e3)
                } : {
                    ID: r.master,
                    data: lodash.set({}, r.target, e)
                }), await this.get(t);
            }
            if (o.data !== null && typeof o.data != "object") throw new Error("CANNOT_TARGET_NON_OBJECT");
            const l = Object.assign({}, o.data);
            const s = lodash.set(l, r.target, e);
            return await o.updateOne({
                $set: UtilClass.shouldExpire(n) ? {
                    data: s,
                    expireAt: UtilClass.createDuration(n * 1e3)
                } : {
                    data: s
                }
            }), await this.get(r.master)
        } else {
            
            return await this.model.findOneAndUpdate({
                ID: t
            }, {
                $set: UtilClass.shouldExpire(n) ? {
                    data: e,
                    expireAt: UtilClass.createDuration(n * 1e3)
                } : {
                    data: e
                }
            }, {
                upsert: !0
            }), await this.get(t)
        }
    }
    async has(key) {
        return await this.get(key) != null
    }
    async delete(t) {
        this.__readyCheck();
        let e = UtilClass.getKeyMetadata(t);
        if (!e.target) return (await this.model.deleteOne({
            ID: e.master
        })).deletedCount > 0;
        let n = await this.model.findOne({
            ID: e.master
        })
        if (!n) return !1;
        if (n.data !== null && typeof n.data != "object") throw new Error("CANNOT_TARGET_NON_OBJECT");
        let r = Object.assign({}, n.data);
        
        if(this.cache.has(t)) {
            key == "748088208427974676" ? console.log(`${"DELETE".blue} Cache for ${String(t).green} in ${String(this.model.collection.name).green} [db.delete()]`.dim) : null
            this.cache.delete(t);
        }
        return lodash.unset(r, e.target), await n.updateOne({
            $set: {
                data: r
            }
        }), !0
    }
    async deleteAll() {
        const deleted = await this.model.deleteMany();
        return deleted?.deletedCount > 0
    }
    async count() {
        return await this.model.estimatedDocumentCount()
    }
    async ping() {
        let t = Date.now(), pingkey = "SOMETHING_RANDOM_FOR_PING";
        await this.get(pingkey)
        if(this.cache.has(pingkey)) {
            this.cache.delete(pingkey);
        }
        return Date.now() - t
    }
    async instantiateChild(t, e) {
        return await new d(e || this.url, {
            ...this.options,
            child: !0,
            parent: this,
            collectionName: t,
            shareConnectionFromParent: !!e || !0
        }).connect()
    }
    get table() {
        return new Proxy(function () { }, {
            construct: (t, e) => {
                let n = e[0];
                if (!n || typeof n != "string") throw new TypeError("ERR_TABLE_NAME");
                let r = new DatabaseClass(this.url, this.options);
                return r.connection = this.connection, 
                r.model = Indexer(this.connection, n), 
                r.cache = new Map(),
                r.connect = () => Promise.resolve(r), Object.defineProperty(r, "table", {
                    get() { },
                    set() { }
                }), 
                r;
            },
            apply: () => {
                throw new Error("TABLE_IS_NOT_A_FUNCTION")
            }
        })
    }
    async all(t) {
        this.__readyCheck();
        let n = (await this.model.find()).filter(r => !(r.expireAt && r.expireAt.getTime() - Date.now() <= 0)).map(r => ({
            ID: r.ID,
            data: this.__formatData(r)
        })).filter((r, o) => t?.filter ? t.filter(r, o) : !0);
        if (typeof t?.sort == "string") {
            t.sort.startsWith(".") && (t.sort = t.sort.slice(1));
            let r = t.sort.split(".");
            n = lodash.sortBy(n, r).reverse()
        }
        let returnData = typeof t?.limit == "number" && t.limit > 0 ? n.slice(0, t.limit) : n
        
        if(this.cache.has(t)) this.cache.set(t, returnData); 

        return returnData;
    }
    async drop() {
        return this.__readyCheck(), await this.model.collection.drop()
    }
    async push(t, e) {
        let n = await this.get(t);
        if (n == null) return Array.isArray(e) ? await this.set(t, e) : await this.set(t, [e]);
        if (!Array.isArray(n)) throw new Error("TARGET_EXPECTED_ARRAY");
        return Array.isArray(e) ? await this.set(t, n.concat(e)) : (n.push(e), await this.set(t, n)) 
    }
    async pull(t, e, n = !0) {
        let r = await this.get(t);
        if (r == null) return !1;
        if (!Array.isArray(r)) throw new Error("TARGET_EXPECTED_ARRAY");
        if (Array.isArray(e)) return r = r.filter(o => !e.includes(o)), await this.set(t, r);
        if (n) return r = r.filter(o => o !== e), await this.set(t, r); {
            if (!r.some(s => s === e)) return !1;
            let l = r.findIndex(s => s === e);
            return r = r.splice(l, 1), await this.set(t, r)
        }
    }
    async add(t, e) {
        if (typeof e != "number") throw new TypeError("VALUE_MUST_BE_NUMBER");
        let n = await this.get(t);
        return await this.set(t, (typeof n == "number" ? n : 0) + e)
    }
    async subtract(t, e) {
        if (typeof e != "number") throw new TypeError("VALUE_MUST_BE_NUMBER");
        let n = await this.get(t);
        return await this.set(t, (typeof n == "number" ? n : 0) - e)
    }
    connect() {
        return new Promise((t, e) => {
            if (typeof this.url != "string" || !this.url) return e(new Error("MISSING_MONGODB_URL"));
            this.__child__ = Boolean(this.options.child), this.parent = this.options.parent || null;
            let n = this.options.collectionName,
                r = !!this.options.shareConnectionFromParent;
            if (delete this.options.collectionName, delete this.options.child, delete this.options.parent, delete this.options.shareConnectionFromParent, r && this.__child__ && this.parent) return this.parent.connection ? (this.connection = this.parent.connection, this.model = Indexer(this.connection, UtilClass.v(n, "string", "JSON")), this.cache = new Map(), t(this)) : e(new Error("PARENT_HAS_NO_CONNECTION"));
            mongoose.createConnection(this.url, this.options, async (o, l) => {
                if (o) return e(o);
                this.connection = l, 
                this.model = Indexer(this.connection, UtilClass.v(n, "string", "JSON")), 
                this.cache = new Map(),
                this.emit("ready", this), this.__applyEventsBinding(), 
                t(this);
            })
        })
    }
    get metadata() {
        return this.model ? {
            name: this.model.collection.name,
            db: this.model.collection.dbName,
            namespace: this.model.collection.namespace
        } : null
    }
    async stats() {
        return this.__readyCheck(), await this.model.collection.stats()
    }
    async close(t = !1) {
        return await this.connection.close(t)
    }
    __applyEventsBinding() {
        this.__readyCheck();
        let t = ["connecting", "connected", "open", "disconnecting", "disconnected", "close", "reconnected", "error", "fullsetup", "all", "reconnectFailed", "reconnectTries"];
        for (let e of t) this.connection.prependListener(e, (...n) => {
            this.emit(e, ...n)
        })
    }
    __formatData(t) {
        return t?.data ? t.data : null
    }
    __readyCheck() {
        if (!this.model) throw new Error("DATABASE_NOT_READY")
    }
};

function Indexer(i, t = "JSON") {
    let e = i.model(t, StandardSchema);

    e.collection.createIndex({
        expireAt: 1
    }, {
        expireAfterSeconds: 0
    }).catch(() => null)
    
    return e
}
function Define (i){ 
    return Object.defineProperty(i, "__esModule", { value: !0 });
}
function IterateCreation (i, t) {
    for (const e in t) 
        Object.defineProperty(i, e, {
            get: t[e],
            enumerable: !0
        })
    return;
};
function ChangeG (i, t, e, n) {
    if (t && typeof t == "object" || typeof t == "function")
        for (let r of Object.getOwnPropertyNames(t)) !Object.prototype.hasOwnProperty.call(i, r) && (e || r !== "default") && Object.defineProperty(i, r, {
            get: () => t[r],
            enumerable: !(n = Object.getOwnPropertyDescriptor(t, r)) || n.enumerable
        });
    return i
};

const ExportFormat = (i => (t, e) => i && i.get(t) || (e = ChangeG(Define({}), t, 1), i && i.set(t, e), e))(typeof WeakMap != "undefined" ? new WeakMap : 0);
const I = {};
IterateCreation(I, {
    Database: () => DatabaseClass,
    Util: () => UtilClass,
    docSchema: () => StandardSchema
});

module.exports = ExportFormat(I);
0 && (module.exports = {
    Database,
    Util,
    docSchema
});