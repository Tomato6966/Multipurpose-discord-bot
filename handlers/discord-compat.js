const Discord = require("discord.js");

const intentAliases = {
    GUILDS: "Guilds",
    GUILD_MEMBERS: "GuildMembers",
    GUILD_BANS: "GuildBans",
    GUILD_EMOJIS_AND_STICKERS: "GuildExpressions",
    GUILD_INTEGRATIONS: "GuildIntegrations",
    GUILD_WEBHOOKS: "GuildWebhooks",
    GUILD_INVITES: "GuildInvites",
    GUILD_VOICE_STATES: "GuildVoiceStates",
    GUILD_PRESENCES: "GuildPresences",
    GUILD_MESSAGES: "GuildMessages",
    GUILD_MESSAGE_REACTIONS: "GuildMessageReactions",
    GUILD_MESSAGE_TYPING: "GuildMessageTyping",
    DIRECT_MESSAGES: "DirectMessages",
    DIRECT_MESSAGE_REACTIONS: "DirectMessageReactions",
    DIRECT_MESSAGE_TYPING: "DirectMessageTyping",
    GUILD_SCHEDULED_EVENTS: "GuildScheduledEvents",
};

const permissionAliases = {
    CREATE_INSTANT_INVITE: "CreateInstantInvite",
    KICK_MEMBERS: "KickMembers",
    BAN_MEMBERS: "BanMembers",
    ADMINISTRATOR: "Administrator",
    ADMINSTRATOR: "Administrator",
    MANAGE_CHANNELS: "ManageChannels",
    MANAGE_GUILD: "ManageGuild",
    ADD_REACTIONS: "AddReactions",
    VIEW_AUDIT_LOG: "ViewAuditLog",
    PRIORITY_SPEAKER: "PrioritySpeaker",
    STREAM: "Stream",
    VIEW_CHANNEL: "ViewChannel",
    READ_MESSAGES: "ViewChannel",
    SEND_MESSAGES: "SendMessages",
    SEND_TTS_MESSAGES: "SendTTSMessages",
    MANAGE_MESSAGES: "ManageMessages",
    EMBED_LINKS: "EmbedLinks",
    ATTACH_FILES: "AttachFiles",
    READ_MESSAGE_HISTORY: "ReadMessageHistory",
    MENTION_EVERYONE: "MentionEveryone",
    USE_EXTERNAL_EMOJIS: "UseExternalEmojis",
    VIEW_GUILD_INSIGHTS: "ViewGuildInsights",
    CONNECT: "Connect",
    SPEAK: "Speak",
    MUTE_MEMBERS: "MuteMembers",
    DEAFEN_MEMBERS: "DeafenMembers",
    MOVE_MEMBERS: "MoveMembers",
    USE_VAD: "UseVAD",
    CHANGE_NICKNAME: "ChangeNickname",
    MANAGE_NICKNAMES: "ManageNicknames",
    MANAGE_ROLES: "ManageRoles",
    MANAGE_WEBHOOKS: "ManageWebhooks",
    MANAGE_EMOJIS_AND_STICKERS: "ManageGuildExpressions",
    USE_APPLICATION_COMMANDS: "UseApplicationCommands",
    REQUEST_TO_SPEAK: "RequestToSpeak",
    MANAGE_EVENTS: "ManageEvents",
    MANAGE_THREADS: "ManageThreads",
    CREATE_PUBLIC_THREADS: "CreatePublicThreads",
    CREATE_PRIVATE_THREADS: "CreatePrivateThreads",
    USE_EXTERNAL_STICKERS: "UseExternalStickers",
    SEND_MESSAGES_IN_THREADS: "SendMessagesInThreads",
    USE_EMBEDDED_ACTIVITIES: "UseEmbeddedActivities",
    MODERATE_MEMBERS: "ModerateMembers",
    VIEW_CREATOR_MONETIZATION_ANALYTICS: "ViewCreatorMonetizationAnalytics",
    USE_SOUNDBOARD: "UseSoundboard",
    CREATE_GUILD_EXPRESSIONS: "CreateGuildExpressions",
    CREATE_EVENTS: "CreateEvents",
    USE_EXTERNAL_SOUNDS: "UseExternalSounds",
    SEND_VOICE_MESSAGES: "SendVoiceMessages",
    SEND_POLLS: "SendPolls",
};

const buttonStyleAliases = {
    PRIMARY: "Primary",
    SECONDARY: "Secondary",
    SUCCESS: "Success",
    DANGER: "Danger",
    LINK: "Link",
    PREMIUM: "Premium",
};

const activityTypeAliases = {
    PLAYING: Discord.ActivityType.Playing,
    STREAMING: Discord.ActivityType.Streaming,
    LISTENING: Discord.ActivityType.Listening,
    WATCHING: Discord.ActivityType.Watching,
    COMPETING: Discord.ActivityType.Competing,
};

function mapFlags(aliases, flags) {
    return Object.fromEntries(
        Object.entries(aliases)
            .filter(([, currentName]) => flags[currentName] !== undefined)
            .map(([oldName, currentName]) => [oldName, flags[currentName]])
    );
}

function addLegacyConstructor(name, currentClass) {
    if (!Discord[name]) {
        Discord[name] = currentClass;
    }
}

function patchBuilderMethod(builder, method, adapt) {
    const original = builder.prototype[method];
    if (typeof original !== "function" || original.__legacyAdapter) return;

    const wrapped = function (...args) {
        return original.apply(this, adapt(args));
    };
    wrapped.__legacyAdapter = true;
    builder.prototype[method] = wrapped;
}

addLegacyConstructor("MessageEmbed", Discord.EmbedBuilder);
addLegacyConstructor("MessageAttachment", Discord.AttachmentBuilder);
addLegacyConstructor("MessageActionRow", Discord.ActionRowBuilder);
addLegacyConstructor("MessageButton", Discord.ButtonBuilder);
addLegacyConstructor("MessageSelectMenu", Discord.StringSelectMenuBuilder);

Discord.Intents = Discord.IntentsBitField;
Discord.Intents.FLAGS = mapFlags(intentAliases, Discord.GatewayIntentBits);
Discord.Permissions = Discord.PermissionsBitField;
Discord.Permissions.FLAGS = mapFlags(permissionAliases, Discord.PermissionFlagsBits);

if (!Discord.Collection.prototype.keyArray) {
    Discord.Collection.prototype.keyArray = function () {
        return Array.from(this.keys());
    };
}
if (!Discord.Collection.prototype.array) {
    Discord.Collection.prototype.array = function () {
        return Array.from(this.values());
    };
}

Discord.EmbedBuilder.prototype.addField = function (name, value, inline) {
    return this.addFields({ name, value, inline });
};
patchBuilderMethod(Discord.EmbedBuilder, "setFooter", ([footer, iconURL]) => [
    typeof footer === "string" ? { text: footer, iconURL } : footer,
]);
patchBuilderMethod(Discord.EmbedBuilder, "setAuthor", ([author, iconURL, url]) => [
    typeof author === "string" ? { name: author, iconURL, url } : author,
]);
patchBuilderMethod(Discord.ButtonBuilder, "setStyle", ([style]) => [
    typeof style === "string" && buttonStyleAliases[style]
        ? Discord.ButtonStyle[buttonStyleAliases[style]]
        : style,
]);

const legacyPartials = {
    MESSAGE: Discord.Partials.Message,
    CHANNEL: Discord.Partials.Channel,
    REACTION: Discord.Partials.Reaction,
    GUILD_MEMBER: Discord.Partials.GuildMember,
    USER: Discord.Partials.User,
    GUILD_SCHEDULED_EVENT: Discord.Partials.GuildScheduledEvent,
};

const Client = Discord.Client;
Discord.Client = class LegacyCompatibleClient extends Client {
    constructor(options = {}) {
        const { fetchAllMembers, restTimeOffset, ...clientOptions } = options;
        super({
            ...clientOptions,
            presence: clientOptions.presence
                ? {
                      ...clientOptions.presence,
                      activities: clientOptions.presence.activities?.map(activity => ({
                          ...activity,
                          type:
                              typeof activity.type === "string"
                                  ? (activityTypeAliases[activity.type] ?? activity.type)
                                  : activity.type,
                      })),
                  }
                : undefined,
            partials: clientOptions.partials?.map(partial => {
                if (typeof partial !== "string") return partial;
                return legacyPartials[partial] ?? partial;
            }),
        });
    }
};

const Guild = Discord.Guild;
if (Guild && !Object.getOwnPropertyDescriptor(Guild.prototype, "me")) {
    Object.defineProperty(Guild.prototype, "me", {
        configurable: true,
        get() {
            return this.members.me;
        },
    });
}

const BaseInteraction = Discord.BaseInteraction;
if (BaseInteraction?.prototype && !BaseInteraction.prototype.isCommand) {
    BaseInteraction.prototype.isCommand = BaseInteraction.prototype.isChatInputCommand;
    BaseInteraction.prototype.isSelectMenu = BaseInteraction.prototype.isStringSelectMenu;
}

Discord.Util = Object.assign(Discord.Util || {}, {
    splitMessage(content, { maxLength = 2_000, char = "\n", prepend = "", append = "" } = {}) {
        const remainingLength = maxLength - prepend.length - append.length;
        if (remainingLength < 1) {
            throw new RangeError("Message wrappers must leave room for content.");
        }

        const remaining = String(content);
        const chunks = [];
        let offset = 0;
        while (offset < remaining.length) {
            let end = Math.min(offset + remainingLength, remaining.length);
            if (end < remaining.length && char) {
                const separator = remaining.lastIndexOf(char, end);
                if (separator > offset) end = separator + char.length;
            }
            chunks.push(`${prepend}${remaining.slice(offset, end)}${append}`);
            offset = end;
        }

        return chunks.length ? chunks : [`${prepend}${append}`];
    },
});

module.exports = Discord;
