import chalk from "chalk";
import { ExtendedClient } from "..";

export default (client: ExtendedClient) => {
    let dateNow = Date.now();

    client.getFooter = (es, stringurl) => {
        //allow inputs: ({footericon, footerurl}) and (footericon, footerurl);
        let embedData: any = {};
        if (typeof es !== "object") {
            embedData = {
                footertext: es,
                footericon: stringurl
            }
        } else {
            embedData = es;
        };

        let text = embedData.footertext;
        let iconURL = embedData.footericon;
        if (!text || text.length < 1) {
            text = `${client.user?.username} | By: Tomato#6966`;
        };
        if (!iconURL || iconURL.length < 1) {
            iconURL = `${client.user?.displayAvatarURL()}`;
        };

        // Change the lengths
        iconURL = iconURL.trim();
        text = text.trim().substring(0, 2048);

        // Verify the iconURL
        if (!iconURL.startsWith("https://") && !iconURL.startsWith("http://")) {
            iconURL = client.user?.displayAvatarURL();
        };
        if (![".png", ".jpg", ".wpeg", ".webm", ".gif"].some(d => iconURL.toLowerCase().endsWith(d))) {
            iconURL = client.user?.displayAvatarURL();
        };

        // Return the footerobject
        return { text, iconURL };
    };

    client.getAuthor = (authorname:string, authoricon:string, authorurl?:string) => {
        // Allow inputs: ({footericon, footerurl}) and (footericon, footerurl);
        let name = authorname;
        let iconURL = authoricon;
        let url = authorurl;

        if (!client.user) return;

        // Verify the name
        if (!name || name.length < 1) {
            name = `${client.user.username} | By: Tomato#6966`;
        };

        // Verify the iconURL
        if (!iconURL || iconURL.length < 1) {
            iconURL = `${client.user.displayAvatarURL()}`;
        };

        // Verify the url
        if (!url || url.length < 1) {
            url = `https://discord.gg/EETWaC3edf`;
        };

        // Change the lengths
        iconURL = iconURL.trim();
        name = name.trim().substring(0, 2048);

        // Verify the URLs and Images
        if (!url.startsWith("https://") && !url.startsWith("http://")) {
            url = `https://discord.gg/EETWaC3edf`;
        };

        if (!iconURL.startsWith("https://") && !iconURL.startsWith("http://")) {
            iconURL = client.user.displayAvatarURL();
        };

        if (![".png", ".jpg", ".wpeg", ".webm", ".gif"].some(d => iconURL.toLowerCase().endsWith(d))) {
            iconURL = client.user.displayAvatarURL();
        };

        // Return the authorobject
        return { name, iconURL, url};
    }

    const time = `${Date.now() - dateNow}ms`;
    const box = `${String(chalk.magenta("[x] :: "))}`
    const stringlength2 = 69;
    console.log(chalk.bold.greenBright(`     ┃ `) + chalk.bold.greenBright(`${box}Loaded the Extra Client Events after: ${chalk.green(`${Date.now() - dateNow}ms`)}`) + " ".repeat(-1 + stringlength2 - ` ┃ `.length - `[x] :: Loaded the Extra Client Events after: ${time}`.length) + chalk.bold.greenBright("┃"))
}