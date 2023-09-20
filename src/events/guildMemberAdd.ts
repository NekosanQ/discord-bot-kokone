import { Channel, EmbedBuilder, Events, GuildMember, TextChannel } from 'discord.js';
import { entranceChannelId, chatChannelId, botcolor } from '../config.json';
import log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = "info";
// -----------------------------------------------------------------------------------------------------------
// 入室通知
// -----------------------------------------------------------------------------------------------------------
module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member: GuildMember): Promise<void> {
        const getEntranceChannelId: Channel | undefined = member.guild.channels.cache.get(entranceChannelId); //入退室チャンネルを取得
        const getChatChannelId: Channel | undefined = member.guild.channels.cache.get(chatChannelId); // 雑談チャンネルを取得

        interface IwelcomeMessageEmbed { // welcomeMessageEmbedはオブジェクトなので、interfaceを使用
            entrance: EmbedBuilder;
            chat:     EmbedBuilder;
        };

        const welcomeMessageEmbed: IwelcomeMessageEmbed = {
            entrance: new EmbedBuilder() // 入退室
                .setTitle(`__❀ᴡᴇʟᴄᴏᴍᴇ to ${member.guild.name}❀__！`)
                .setDescription(`<@${member.id}> さんようこそ！\n${member.guild.name}へ！\n<#685127547662630954>\n利用規約を見てください！\nLet's confirm the rules!\n${member.guild.memberCount}人目の入室者です！`)
                .setColor(Number(botcolor))
                .setThumbnail(member.user.avatarURL())
                .setTimestamp()
                .setFooter({ text: "入室日時", iconURL: member.user.avatarURL() || undefined }),
            chat: new EmbedBuilder() // 雑談
                .setTitle("新規さんが入室しました！")
                .setDescription(`<@${member.id}> has joined the server!\n${member.displayName}さんが入室しました！\n挨拶してあげてね！\nサーバー人数が${member.guild.memberCount}人になりました！`)
                .setColor(Number(botcolor))
                .setThumbnail(member.user.avatarURL())
                .setTimestamp()
                .setFooter({ text: "入室日時", iconURL: member.user.avatarURL() || undefined }),
        };

        logger.info(`[入室通知] <入室ユーザー表示名/名前/ID>: ${member.displayName}/${member.user.username}/${member.id}`);

        if (getEntranceChannelId) { // 入退室チャンネルに送信
            await (getEntranceChannelId as TextChannel).send({
                embeds: [welcomeMessageEmbed.entrance]
            });
        };
        if (getChatChannelId) { // 雑談チャンネルに送信
            await (getChatChannelId as TextChannel).send({
                content: `<@&813892624335241247>新規さん来たよ！`,
                embeds: [welcomeMessageEmbed.chat]
            });
        };
    }
}