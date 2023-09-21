import { ButtonInteraction, EmbedBuilder, Interaction, VoiceChannel } from "discord.js";
import { botcolor } from "../config.json";
import { 
    operationMenu, 
    memberRoleId,
    allowUserPermisson, 
    denyUserPermisson, 
    allowCreateUserPermisson, 
} from "../module/voiceCreateData";

const publicChannelEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(Number(botcolor))
    .setTitle("ボイスチャンネルを公開しました")
    .setDescription("設定を行いたい場合、下のメニューから設定を行ってください\n※ブロック・ブロック解除の操作は行えません")
    
module.exports = {
	async execute(interaction: Interaction): Promise<void> {
        if (!interaction.isButton()) return;
        const channel = interaction.channel;
        // -----------------------------------------------------------------------------------------------------------
        // チャンネルを公開する時の処理
        // -----------------------------------------------------------------------------------------------------------
        if (interaction.customId === "publicButton") {
            if (channel && channel.type === 2) { // チャンネルがボイスチャンネルかどうか確認
                const channelName: string = (interaction.channel as VoiceChannel).name;
                let channelUserLimit: string | number = (interaction.channel as VoiceChannel)?.userLimit;
                if (channelUserLimit === 0) {
                    channelUserLimit = "無制限";
                } else {
                    channelUserLimit = `${channelUserLimit} 人`
                };
                const channelBitRate = Number((interaction.channel as VoiceChannel)?.bitrate) / 1000;
                await channel.permissionOverwrites.set([
                    {
                        id: interaction.user.id,
                        allow: [allowUserPermisson, allowCreateUserPermisson]
                    },
                    {
                        id: memberRoleId,
                        allow: [allowUserPermisson]
                    }
                ]);
                await (interaction as ButtonInteraction).reply({
                    content: "チャンネルを公開しました",
                    ephemeral: true
                });
                await interaction.message?.edit({
                    embeds: [
                        publicChannelEmbed.setFields(
                            { name: "現在の設定", value: `チャンネル名: ${channelName}\nユーザー人数制限: ${channelUserLimit}\nビットレート: ${channelBitRate}kbps` },
                        )
                    ],
                    components: [operationMenu]
                });
            };
        }
    }
};