import { Message } from "discord.js";

const { ActionRowBuilder, EmbedBuilder, PermissionsBitField, MessageActivityType } = require("discord.js");
const { setTimeout } = require('node:timers/promises');
const inviteChannelId = "1066228030114123806";
const inviteRoleId = [
    // 通話募集通知
    "1117382182512627793", // 雑談募集
    "1117382378395021312", // 作業募集
    "1117382446493736960", // 相談募集
    "956777920687390750",  // その他通話募集
    // ゲーム募集通知
    "1025065797741195344", // プロセカ募集
    "978311856705916978",  // Minecraft募集
    "978311961605472367",  // Apex募集
    "1117442891900522576", // VALORANT募集
    "1115553228944314388", // 原神募集
    "1115553388181069924",  // その他ゲーム募集
]
const checkmarkId = "1033764709305962506";
module.exports = {
    // -----------------------------------------------------------------------------------------------------------
    // 荒らし対策システム
    // -----------------------------------------------------------------------------------------------------------
    async run_message (message: Message) {
        console.log(3);
        const embed = {
            timeout: new EmbedBuilder()
                .setColor(0xb9d98b)
                .setTitle("タイムアウトしました")
                .addFields([
                    { name: "処罰ユーザー名", value: `${message.author.username}` },
                    { name: "処罰ユーザーID", value: `${message.author.id}` }
                ]),
            kick: new EmbedBuilder()
                .setColor(0xb9d98b)
                .setTitle("キックしました")
                .addFields([
                    { name: "処罰ユーザー名", value: `${message.author.username}` },
                    { name: "処罰ユーザーID", value: `${message.author.id}` }
                ]),
        }
        const member = message.guild?.members.cache.get(message.author.id);
        // -----------------------------------------------------------------------------------------------------------
        // 募集チャンネルで、通話募集通知以外でのメンションをした場合の処理
        // -----------------------------------------------------------------------------------------------------------
        const messageRole = message.mentions.roles; // メッセージに含まれているメンションを取得
        if (message.channel.id == inviteChannelId && message.content.match("@")) {
            let inviteMentionCount = 0; // 募集通知カウント
            for (let key of messageRole.keys()) { // メンションの数だけ繰り返す
                for (let n = 0; n < inviteRoleId.length; n++) { // 募集通知のロールがあるか確認
                    if (key == inviteRoleId[n]) { // 募集通知のロールがあった場合の処理
                        inviteMentionCount++; // 募集通知カウントを増やす
                    }
                }
            };
            if (inviteMentionCount == messageRole.size) { // 募集通知のロールのみメンションされていた場合の処理
                await message.react(message.guild?.emojis.cache.get(checkmarkId) ?? "");
            } else { // 募集通知以外のメンションがあった場合の処理
                const inviteNotMentionMessage = await message.channel.send({
                    embeds: [
                        embed.timeout.setDescription("募集通知以外でのメンションが検出されました")
                    ]
                });
                if (!member?.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    await message.member?.timeout(5 * 1000);
                };
                await message.delete();
                await setTimeout(3000);
                await inviteNotMentionMessage.delete();
            };     
        };
        // ------------------------------------------------------------------------------------------------------------
        // 全体メンションをした場合の処理
        // 対象: @everone / @here
        // -----------------------------------------------------------------------------------------------------------
        if (message.mentions.everyone) {
            const MentionMessage = await message.channel.send({
                embeds: [
                    embed.timeout.setDescription("処罰理由: 全体メンションの送信")
                ]
            });
            if (!member?.permissions.has(PermissionsBitField.Flags.Administrator)) {
                await message.member?.timeout(24 * 60 * 60 * 1000);
            }
            await message.delete();
            await setTimeout(3000);
            await MentionMessage.delete();
            
        };
        // -----------------------------------------------------------------------------------------------------------
        // 個人メンションが３つ以上送信された場合の処理
        // -----------------------------------------------------------------------------------------------------------
        if (message.mentions.members != null&&message.mentions.members.size >= 3) {
            await message.delete(); 
            await message.member?.timeout(60 * 60 * 1000);
            await message.channel.send({
                embeds: [
                    embed.timeout.setDescription("処罰理由: 複数の個人メンションの送信")
                ]
            })
        };
    }
};