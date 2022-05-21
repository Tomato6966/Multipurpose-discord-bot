const { dbEnsure } = require("./functions")
module.exports = async (client) => {
    module.exports.messageCreate = async (client, message, guild_settings) => {
        ValidCode(client, message, guild_settings)
    }
    client.on("messageUpdate", async (oldMessage, newMessage) => {
        if (!newMessage.guild || newMessage.guild.available === false || !newMessage.channel || newMessage.author?.bot) return;
        let guild_settings = await client.settings.get(newMessage.guild.id);
        ValidCode(client, newMessage, guild_settings)
    })
    async function ValidCode(client, message, guild_settings){
        try{
            if (!message.guild || message.guild.available === false || !message.channel || message.author?.bot) return;
            let validcode = guild_settings.validcode
            if(!validcode) return;
            try {
                var aa = message.content.replace(/[^```]/g, "").length > 2
                if(aa && (
                    message.content.includes("```js") ||
                    message.content.includes("```c") ||
                    message.content.includes("```cs") ||
                    message.content.includes("```css") ||
                    message.content.includes("```cpp") ||
                    message.content.includes("```fix") ||
                    message.content.includes("```diff") ||
                    message.content.includes("```html") ||
                    message.content.includes("```yml") ||
                    message.content.includes("```java") ||
                    message.content.includes("```python") ||
                    message.content.includes("```rb") ||
                    message.content.includes("```hs") ||
                    message.content.includes("```haskell") ||
                    message.content.includes("```bash") ||
                    message.content.includes("```ruby") ||
                    message.content.includes("```lua") ||
                    message.content.includes("```py") 
                )) message.react("858405056238714930").catch(() => null)
            } catch (e) {
                console.log(String(e.stack).grey.bgRed)
            }
        }catch (e){
            console.error(e)
        }
    }

}