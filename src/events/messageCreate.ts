import { Events, Message } from 'discord.js';
import { appendFile } from '../module/file/appedFile';
// -----------------------------------------------------------------------------------------------------------
// メッセージ処理
// -----------------------------------------------------------------------------------------------------------
module.exports = {
    name: Events.MessageCreate,
    async execute(message: Message): Promise<void> {
        if (message.author.bot) return;
        await require("../guildProcess/antiTroll").execute(message);
        await require("../guildProcess/stickyMessage").execute(message);

        const date = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
        const attachmentUrl = message.attachments.map(attachment => attachment.url);
        
        appendFile("logs/message.log", `[${date}] ${message.author.displayName}/${message.author.id} ${attachmentUrl}\n`);
        appendFile("logs/message.log", `${message.content}\n`);
    }
};