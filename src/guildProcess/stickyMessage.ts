import { EmbedBuilder, Message } from "discord.js";
import { appendFile } from "../module/file/appedFile";
import { config } from '../utils/config';
// -----------------------------------------------------------------------------------------------------------
// Stickyメッセージ
// -----------------------------------------------------------------------------------------------------------
module.exports = {
    async execute(message: Message): Promise<void> {
        if (message.author.bot) return;
        const date: string = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
        const inviteStickyMessage: EmbedBuilder = new EmbedBuilder()
            .setColor(Number(config.botColor))
            .setTitle("募集チャンネルについて")
            .setDescription("このチャンネルではゲームや作業、雑談などの募集をする事が出来ます。\n気軽に募集をしてもらって大丈夫です！(ルールは守りましょう。)\n[使用方法とルールはここから確認してください](https://discord.com/channels/685035498699620377/1066228030114123806/1067257705011609680)")
            
        if (config.inviteChannelId.includes(message.channel.id)) {
            try {
                const fetchedMessages = await message.channel.messages.fetch();
                const stickyMessage = fetchedMessages.find(message => message.author.id === message.client.user.id && config.inviteChannelId.includes(message.channel.id));

                if (stickyMessage) {
                    stickyMessage.delete().then(() => {
                        message.channel.send({
                            embeds: [inviteStickyMessage]
                        });
                    }).catch(() => {});
                } else {
                    // Stickyメッセージが無い場合
                    message.channel.send({
                        embeds: [inviteStickyMessage]
                    });
                };
            } catch (error) {
                appendFile("logs/error.log", `[${date}] ${error}`);
            }
        }
    }
};