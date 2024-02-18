import { Channel, EmbedBuilder, Events, GuildMember, TextChannel } from 'discord.js';
import { config } from "../utils/config";
import { logger } from "../utils/log";

// -----------------------------------------------------------------------------------------------------------
// 退室通知
// -----------------------------------------------------------------------------------------------------------
module.exports = {
	name: Events.GuildMemberRemove,
	async execute(member: GuildMember): Promise<void> {
        const getEntranceChannelId: Channel | undefined = member.guild.channels.cache.get(config.entranceChannelId); // 入退室チャンネルを取得
        const timeSpent: number = Math.round((Date.now() - Number(member.joinedAt)) / 86400000) // サーバーに居た期間を日数にして計算

        const removeMessageEmbed: EmbedBuilder = new EmbedBuilder()
            .setTitle(`さよなら…${member.displayName}さん`)
            .setDescription(`ご利用ありがとうございました(♡ᴗ͈ˬᴗ͈)⁾⁾⁾\n少し寂しくなりますね…\n${member.displayName} は、${member.guild.name}に${timeSpent}日間入室してました。\nサーバー人数が${member.guild.memberCount}人になりました。`)
            .setColor(Number(config.botColor))
            .setThumbnail(member.user.avatarURL())
            .setTimestamp()
            .setFooter({ text: "退室日時", iconURL: member.user.avatarURL() || undefined });

        logger.info(`[退室通知] <入室ユーザー表示名/名前/ID>: ${member.displayName}/${member.user.username}/${member.id}`);
        
        if (getEntranceChannelId) { // 入退室チャンネルに送信
            await (getEntranceChannelId as TextChannel).send({
                embeds: [removeMessageEmbed]
            });
        }
    }
}