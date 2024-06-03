import { Events, Message } from 'discord.js';
import { appendFile } from '../module/file/appedFile';

/**
 * @type {string} ユーザーID
 * @type {number} クールダウン開始時刻
 */
const coolDownMap = new Map<string, number>();


/**
 * メッセージ処理
 */
module.exports = {
    name: Events.MessageCreate,
    async execute(message: Message): Promise<void> {
        if (message.author.bot) return;

        if (message.guild === null) return; // 実行場所がサーバーでなかったら処理しない

        const date = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

        await require("../level/message").execute(message);
        await require("../guildProcess/antiTroll").execute(message);
        await require("../guildProcess/stickyMessage").execute(message);

        const attachmentUrl = message.attachments.map(attachment => attachment.url);
        
        appendFile("logs/message.log", `[${date}] ${message.author.displayName}/${message.author.id} ${attachmentUrl}\n`);
        appendFile("logs/message.log", `${message.content}\n`);
    }
};