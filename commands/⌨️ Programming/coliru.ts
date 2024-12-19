import type { ExtendedClient } from "../.."
import { EmbedBuilder, type Message } from "discord.js"
import customEmojis from "../../botconfig/customEmojis.json" assert { type: "json" };
import chalk from "chalk";

export default {
    //definition
    name: "coliru", //the name of the command 
    category: "⌨️ Programming", //the category this will be listed at, for the help cmd
    aliases: [""], //every parameter can be an alias
    cooldown: 4, //this will set it to a 4 second cooldown
    usage: "coliru <Code>", //this is for the help command for EACH cmd
    description: "Compile Code", //the description of the command

    run: async (client: ExtendedClient, message: Message, args, cmduser, text, prefix) => {
        if (!message.guild) return;
        let es = client.settings.get(message.guild.id, "embed");
        let ls = client.settings.get(message.guild.id, "language")

        try {
            const possiblecommands = {
                cpp: "g++ main.cpp -pthread -pedantic -Wall -Wextra && ./a.out",
                "c++": "g++ main.cpp -pthread -pedantic -Wall -Wextra && ./a.out",
                c: "mv main.cpp main.c && gcc main.c -pedantic -O2 -pthread -Wall -Wextra && ./a.out",
                ruby: "ruby main.cpp",
                rb: "ruby main.cpp",
                lua: "lua main.cpp",
                python: "python main.cpp",
                py: "python main.cpp",
                haskell: "runhaskell main.cpp",
                hs: "runhaskell main.cpp",
                bash: "bash main.cpp",
                sh: "sh main.cpp",
                shell: "sh main.cpp"
            };

            function getCodeBlock(txt: string) {
                const match = /^```(\S*)\n?([^]*)\n?```$/.exec(txt);
                if (!match) return { lang: null, code: txt };
                if (match[1] && !match[2]) return { lang: null, code: match[1] };
                return { lang: match[1], code: match[2] };
            };

            const { lang, code } = getCodeBlock(args.join(" "));

            if (!lang || !code) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle(eval(client.la[ls]["cmds"]["programming"]["coliru"]["variable1"].replace(":no:", customEmojis.general.no)))
                        .setDescription(`Usage:\n${prefix}coliru` + "\\`\\`\\`lang\nCode\n\\`\\`\\`\nCodeBlock language will be used to determine how to compile the code.")
                    ]
                });
            };

            if (!possiblecommands[lang]) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(es.wrongcolor)
                        .setFooter(client.getFooter(es))
                        .setTitle(eval(client.la[ls]["cmds"]["programming"]["coliru"]["variable2"].replace(":no:", customEmojis.general.no)))
                        .setDescription(eval(client.la[ls]["cmds"]["programming"]["coliru"]["variable3"]))
                    ]
                });
            };

            const cmd = possiblecommands[lang];
            const src = code;
            const res = await fetch("http://coliru.stacked-crooked.com/compile", {
                method: "POST",
                body: JSON.stringify({ cmd, src })
            }).then((res) => res.text());

            async function post(message: Message, { cmd, src }) {
                const id = await fetch("http://coliru.stacked-crooked.com/share", {
                    method: "POST",
                    body: JSON.stringify({ cmd, src })
                })
                    .then((res) => res.text());
                return message.reply({ content: eval(client.la[ls]["cmds"]["programming"]["coliru"]["variable4"]) });
            };

            if (res.length < 1990) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setTitle("Coliru Results")
                        .setDescription(`**Code Provided:**\n\`\`\`${lang}\n${code}\`\`\`\n\n**Code Results:**\n\`\`\`${lang}\n${res}\`\`\``)
                        .setColor(es.color)
                        .setFooter(client.getFooter(es))
                    ]
                });
            };

            return post(message, { cmd, src });
        } catch (e) {
            console.log(chalk.grey.bgRed(String(e.stack)));
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(es.wrongcolor).setFooter(client.getFooter(es))
                    .setTitle(client.la[ls].common.erroroccur.replace(":no:", customEmojis.general.no))
                    .setDescription(eval(client.la[ls]["cmds"]["programming"]["coliru"]["variable5"]))
                ]
            });
        }
    }
};

//-CODED-BY-TOMATO#6966-//