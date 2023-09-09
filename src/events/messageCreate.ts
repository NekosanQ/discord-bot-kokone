import { Events, Client, Message } from 'discord.js';
import { prefix } from "../config.json";
// -----------------------------------------------------------------------------------------------------------
// メッセージ処理
// -----------------------------------------------------------------------------------------------------------
module.exports = {
    name: Events.MessageCreate,
    async execute(message: Message): Promise<void> {
        if (message.author.bot) return;
        await require("../guildProcess/invite").execute(message);
    }
};