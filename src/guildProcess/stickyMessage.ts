import { EmbedBuilder, Message } from "discord.js";
import { botcolor } from "../config.json";
const inviteChannelId: string = "1066228030114123806"; // 募集チャンネル
// -----------------------------------------------------------------------------------------------------------
// Stickyメッセージ
// -----------------------------------------------------------------------------------------------------------
module.exports = {
    async execute(message: Message): Promise<void> {
        if (message.author.bot) return;
        const inviteStickyMessage: EmbedBuilder = new EmbedBuilder()
            .setColor(Number(botcolor))
            .setTitle("募集チャンネルについて")
            .setDescription("このチャンネルではゲームや作業、雑談などの募集をする事が出来ます。\n気軽に募集をしてもらって大丈夫です！(ルールは守りましょう。)\n[使用方法とルールはここから](https://discord.com/channels/685035498699620377/1066228030114123806/1067257705011609680)")
            
        if (inviteChannelId.includes(message.channel.id)) {
            const fetchedMessages = await message.channel.messages.fetch();
            const stickyMessage = fetchedMessages.find(message => message.author.id === message.client.user.id && inviteChannelId.includes(message.channel.id));

            if(stickyMessage) {
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
        };
    }
};