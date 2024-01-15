import { Collection, EmbedBuilder, GuildMember, Message, PermissionsBitField, Role, TextChannel } from "discord.js";
import { setTimeout } from 'node:timers/promises';
import { appendFile } from "../module/file/appedFile";
import { config } from '../utils/config.js';
const inviteChannelId: string = config.inviteChannelId; // 募集チャンネル
const inviteRoleId: string[] = config.inviteRoleId;
const checkmarkId: string = config.checkMarkId; // チェックマークの絵文字のID
// -----------------------------------------------------------------------------------------------------------
// 荒らし対策システム
// -----------------------------------------------------------------------------------------------------------
module.exports = {
    async execute(message: Message): Promise<void> {
        class DefaultEmbeds {
            title: string;
            constructor(title: string) {
                this.title = title;
            };
            output() {
                const embed: EmbedBuilder = new EmbedBuilder()
                    .setColor(0xb9d98b)
                    .setTitle(this.title)
                    .setFields([
                        { name: "処罰ユーザー名", value: `${message.author.displayName}/${message.author.username}` },
                        { name: "処罰ユーザーID", value: `${message.author.id}` }
                    ])
                return embed;
            };
        };
        const date: string = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
        const timeoutEmbed = new DefaultEmbeds("タイムアウトされました");
        const member: GuildMember | undefined = message.guild?.members.cache.get(message.author.id); 
        // -----------------------------------------------------------------------------------------------------------
        // 募集チャンネルで、通話募集通知以外でのメンションをした場合の処理
        // (ユーザーへのメンションは処理しない)
        // -----------------------------------------------------------------------------------------------------------
        const messageRole: Collection<string, Role> = message.mentions.roles; // メッセージに含まれているメンションを取得
        if (message.channel.id == inviteChannelId && message.content.match("@")) {
            const voiceChannel = message.member?.voice.channel;
            if (!voiceChannel) {
                const errorMessage: string = "ボイスチャンネルにいないユーザーのメンションを検出しました";
                appendFile("logs/violation.log", `[${date}] ${errorMessage} <違反ユーザー/ID>: <違反ユーザー表示名/名前/ID>: ${message.author.displayName}/${message.author.username}/${message.author.id}\n`);
                const errorMessageSend: Message = await message.channel.send(`${errorMessage}`);
                await message.delete();
                await setTimeout(10000);
                await errorMessageSend.delete();
            }
            try {
                let inviteMentionCount: number = 0; // 募集通知カウント
                for (let key of messageRole.keys()) { // メンションの数だけ繰り返す
                    for (let n = 0; n < inviteRoleId.length; n++) { // 募集通知のロールがあるか確認
                        if (key == inviteRoleId[n]) { // 募集通知のロールがあった場合の処理
                            inviteMentionCount++; // 募集通知カウントを増やす
                        };
                    };
                };
                if (inviteMentionCount == messageRole.size) { // 募集通知のロールのみメンションされていた場合の処理
                    await message.react(message.guild?.emojis.cache.get(checkmarkId) ?? "");
                } else { // 募集通知以外のメンションがあった場合の処理
                    const errorMessage: string = "募集通知以外でのメンションを検出しました";
                    appendFile("logs/violation.log", `[${date}] ${errorMessage} <違反ユーザー/ID>: <違反ユーザー表示名/名前/ID>: ${message.author.displayName}/${message.author.username}/${message.author.id}\n`);
                    const errorMessageSend: Message = await message.channel.send({
                        embeds: [
                            timeoutEmbed.output().setDescription(`${errorMessage}`)
                        ]
                    });
                    if (!member?.permissions.has(PermissionsBitField.Flags.Administrator)) { // 管理者はタイムアウトしない
                        await message.member?.timeout(60 * 60 * 1000);
                    };
                    await message.delete();
                    await setTimeout(10000);
                    await errorMessageSend.delete();
                };  
            } catch (error) {
                appendFile("logs/error.log", `[${date}] ${error}`);
            };
        };
        // ------------------------------------------------------------------------------------------------------------
        // 全体メンションをした場合の処理
        // 対象: @everone / @here
        // -----------------------------------------------------------------------------------------------------------
        if (message.mentions.everyone&&!member?.permissions.has(PermissionsBitField.Flags.Administrator)) {
            try {
                const MentionMessage: Message = await message.channel.send({
                    embeds: [
                        timeoutEmbed.output().setDescription("処罰理由: 全体メンションの送信")
                    ]
                });
                await message.member?.timeout(24 * 60 * 60 * 1000);
                await message.delete();
                await setTimeout(10000);
                await MentionMessage.delete();
            } catch (error) {
                appendFile("logs/error.log", `[${date}] ${error}`);
            };
        };
        // -----------------------------------------------------------------------------------------------------------
        // 個人メンションが３つ以上送信された場合の処理
        // -----------------------------------------------------------------------------------------------------------
        if (message.mentions.members != null&&message.mentions.members.size >= 3&&!member?.permissions.has(PermissionsBitField.Flags.Administrator)) {
            try {
                await message.delete(); 
                await message.member?.timeout(60 * 60 * 1000);
                await message.channel.send({
                    embeds: [
                        timeoutEmbed.output().setDescription("処罰理由: 複数の個人メンションの送信")
                    ]
                });
            } catch (error) {
                appendFile("logs/error.log", `[${date}] ${error}`);
            };
        };
        // -----------------------------------------------------------------------------------------------------------
        // チケットチャンネルでメッセージが送信されたらログに保存する処理
        // -----------------------------------------------------------------------------------------------------------
        const channel = message.channel;
        if (channel.type === 0) {
            try {
                const ticketCateforyId = "1153219622036848660";
                const messageCategoryId = channel.parent?.id;
                if (messageCategoryId === ticketCateforyId) {
                    appendFile("logs/ticket.log", `[${date}] <${message.author.displayName}/${message.author.id}> <${channel.name}/${channel.id}>\n${message.content}\n`);
                };
            } catch (error) {
                appendFile("logs/error.log", `[${date}] ${error}`);
            }
        };
    }
};