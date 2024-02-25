import { Events, Message, PermissionsBitField } from 'discord.js';
import { appendFile } from '../module/file/appedFile';
import { PrismaClient } from '@prisma/client';
import { grantRole } from '../level/role';
import { earnedXpMap, messageBonusMap  } from "../module/periodicExecution.js";

const prisma = new PrismaClient();

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

        const now = Date.now();
        const date = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
        
        const coolDowndate = coolDownMap.get(message.author.id);

        if (coolDowndate) return; // クールダウン中の場合、処理しない

        let xp: number = 0;
        let isVoiceChannel: boolean = false;
        if (message.member?.voice.channel) {
            isVoiceChannel = true;
        }

        const user = await prisma.levels.findFirst({
           select: {
                user_id: true,
                user_xp: true
            },
            where: { user_id: message.author.id }
        });

        if (user) { // データがある場合、更新する
            const boostCount = messageBonusMap.get(message.author.id) || 0;
            const isBoosting = boostCount < 10; // ブースト回数 10回以下でtrue

            xp = grantXP(message.author.id, user.user_xp, boostCount, isBoosting, isVoiceChannel);

            await prisma.levels.updateMany({
                where: { user_id: String(message.author.id) },
                data: { user_xp: user.user_xp + xp }
            });

            grantRole(message.author.id, message.guild, user.user_xp + xp);
        } else { // データがない場合、新規作成
            xp = grantXP(message.author.id, 0, 0, true, isVoiceChannel);

            await prisma.levels.create({
                data: {
                    user_id: String(message.author.id),
                    user_xp: xp
                }
            });

            grantRole(message.author.id, message.guild, xp);
        }

        coolDownMap.set(message.author.id, now); // 5秒のクールダウンを入れる

        setTimeout(() => {
            coolDownMap.delete(message.author.id);
        }, 5000);

        await require("../guildProcess/antiTroll").execute(message);
        await require("../guildProcess/stickyMessage").execute(message);

        const attachmentUrl = message.attachments.map(attachment => attachment.url);
        
        appendFile("logs/message.log", `[${date}] ${message.author.displayName}/${message.author.id} ${attachmentUrl}\n`);
        appendFile("logs/message.log", `${message.content}\n`);
    }
};

/**
 * 経験値の付与
 * @param userId ユーザーId
 * @param xp 実行ユーザー経験値
 * @param boostCount ブースト回数
 * @param isBoosting ブースト有効の可否
 * @param isVoiceChannel
 */
function grantXP(userId: string, xp: number, boostCount: number, isBoosting: boolean, isVoiceChannel: boolean) : number {
    let earnExp: number = Math.floor(Math.random() * 50) + 1;   // 獲得経験値。 1 - 50
    earnExp = isBoosting ? earnExp * 5 : earnExp;               // ブースト有効時は5倍
    if (isVoiceChannel) {
        earnExp = Math.floor(Math.random() * 10) + 1;
    }
    
    if (isBoosting) { // ブースト有効
        messageBonusMap.set(userId, boostCount + 1);
        console.log(`[ボーナス] user_id=${userId} 回数更新, 現在: ${messageBonusMap.get(userId)}`);
    }
    let earnedXp: number = earnedXpMap.get(userId) || 0; // 1週間に稼いだ経験値
    earnedXpMap.set(userId, earnedXp + earnExp);

    console.log(`${userId} の今日獲得したXP: ${earnedXpMap.get(userId)!}`)
    return earnExp;
}