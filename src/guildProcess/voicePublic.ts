import { ButtonInteraction, EmbedBuilder, Interaction, VoiceBasedChannel, VoiceChannel } from "discord.js";
import { config } from "../utils/config";
import { appendFile } from "../module/file/appedFile";
import { 
    blockSettingUpdate,
    confirmationButton,
    operationMenu, settingBlockEmbed, userBlockListMenu, userBlockReleaseListMenu, 
} from "../module/voiceController";
import { channelSettingUpdate, editChannelPermission, getChannelOwner } from "../module/voiceController";

const publicChannelEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(Number(config.botColor))
    .setTitle("ボイスチャンネルを公開しました")
    .setDescription("設定を行いたい場合、下のメニューから設定を行ってください\n※ブロック・ブロック解除の操作は行えません")
module.exports = {
	async execute(interaction: Interaction): Promise<void> {
        if (!interaction.isButton()) return;
        const channel = interaction.channel;
        const userName = interaction.user.displayName;
        const userId = interaction.user.id;
        const date = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
        // -----------------------------------------------------------------------------------------------------------
        // チャンネルを公開する・した後のボタン処理
        // -----------------------------------------------------------------------------------------------------------
        try {
            switch (interaction.customId) {
                case "publicButton": {
                    const channel = interaction.channel as VoiceBasedChannel;
                    await interaction.deferReply({ 
                        ephemeral: true 
                    });
                    // -----------------------------------------------------------------------------------------------------------
                    // チャンネルの権限をセットする
                    // -----------------------------------------------------------------------------------------------------------
                    await editChannelPermission(channel, interaction.user )
                    appendFile("logs/vc_create.log", `[${date}] VCを公開しました <実行ユーザー/ID> ${userName}/${userId}\n`);
                    await (interaction as ButtonInteraction).editReply({
                        content: "チャンネルを公開しました"
                    });
                    await interaction.message?.edit({
                        embeds: [
                            publicChannelEmbed.setFields(await channelSettingUpdate(interaction))
                        ],
                        components: [operationMenu, userBlockListMenu, userBlockReleaseListMenu, confirmationButton]
                    });
                    break
                };
                case "confirmationButton": {
                    await interaction.reply({
                        embeds: [
                            settingBlockEmbed.setFields(await blockSettingUpdate(interaction))
                        ],
                        ephemeral: true,
                    });
                }
            }
        } catch(error) {
            console.log(error);
        };
    }
};