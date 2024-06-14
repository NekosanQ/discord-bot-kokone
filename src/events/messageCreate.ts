import { Events, Message } from 'discord.js';
import { appendFile } from '../module/file/appedFile';

/**
 * メッセージ処理
 */
export = {
    name: Events.MessageCreate,
    async execute(message: Message): Promise<void> {
        if (message.author.bot) return;

        if (message.guild === null) return; // 実行場所がサーバーでなかったら処理しない

        const date = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

        (await import("../level/message")).execute(message);
        (await import("../guildProcess/antiTroll")).execute(message);
        (await import("../guildProcess/stickyMessage")).execute(message);

        const attachmentUrl = message.attachments.map(attachment => attachment.url);
        
        appendFile("logs/message.log", `[${date}] ${message.author.displayName}/${message.author.id} ${attachmentUrl}\n`);
        appendFile("logs/message.log", `${message.content}\n`);
    }
};