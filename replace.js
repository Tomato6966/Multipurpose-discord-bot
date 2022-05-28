const fs = require(`fs`)
replaceallfiles(
    `./`, // Source Dir //b, interaction, button, menu, i
    `collected ? collected.first().values[0]`, // The To Search Parameter
    `collected && collected?.first()?.values?.[0] ? collected.first().values[0]`, // The Replacement,
    true, //if it should be .js Files only
    //
) //setFooter({text: `${es.footertext}`, iconURL: `${es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL()}`})
async function replaceallfiles(srcdir, toreplace, replacewith, jsonly) {
    
    if(srcdir.endsWith(".js")) {
        await fs.readFile(srcdir, 'utf8', async (err, data) => {
            if (err) return console.error(err);
            const client = { la: {} }; const ls = "en"; client.la[ls] = require(`./languages/${ls}.json`)
            for(const [key, value] of Object.entries(client.la[ls]["cmds"]["setup"]["setup-apply"])){
                if(value.includes("apply_for_here")) {
                    const toReplace1 = `eval(client.la[ls]["cmds"]["setup"]["setup-apply"]["${key}"])`;
                    const toReplace2 = `client.la[ls]["cmds"]["setup"]["setup-apply"]["${key}"]`;
                    if(data.includes(toReplace1) || data.includes(toReplace2))  console.log(`FOUND AND REPLACE ${key}`);
                    data = data.replace(toReplace1, `${value}`).replace(toReplace2, `${value}`)
                    await delay(50);
                }
            }
            await fs.writeFile(srcdir, data, (e) => {
                if (e) return console.log(`Error on ${srcdir}`, e);
                return console.log(`Successfully replaced: ${srcdir}`);
            });
            return delay(250)
        })
        return;
    }
    
    let Files  = []; allFolders(srcdir);
    function allFolders(Directory) {
        fs.readdirSync(Directory).forEach(File => {
            const Absolute = require(`path`).join(Directory, File);
            if (fs.statSync(Absolute).isDirectory() && !Absolute.includes("node_modules")) return allFolders(Absolute);
            else return Files.push(Absolute);
        });
    }
    for (const file of Files) {
        if(file.includes("replace.js") || (jsonly && !file.endsWith(".js"))) continue 
        await fs.readFile(file, 'utf8', async (err, data) => {
            if (err) return console.error(err);
            if (data.includes(toreplace)) {
                await fs.writeFile(file, data.split(toreplace).join(replacewith), (e) => {
                    if (e) return console.log(`Error on ${file}`, e);
                    return console.log(`Successfully replaced: ${file.replace(srcdir, ``)}`);
                });
                return delay(250)
            };
        })
    }
}
function delay(ms) {
    return new Promise((r)=>setTimeout(()=>r(2),ms))
}
