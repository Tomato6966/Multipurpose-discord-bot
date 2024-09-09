import { ExtendedClient } from "..";

export default (client: ExtendedClient) => {
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
}