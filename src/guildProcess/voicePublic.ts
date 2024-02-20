import { ButtonInteraction, EmbedBuilder, GuildMember, Interaction, PermissionsBitField, VoiceBasedChannel, VoiceChannel } from "discord.js";
import { config } from "../utils/config";
import { appendFile } from "../module/file/appedFile";
import { 
    blockSettingUpdate,
    operationMenu, 
    settingBlockEmbed, 
    settingComponentUpdate, 
    userBlockListMenu, 
    userBlockReleaseListMenu, 
} from "../module/voiceController";
import { channelSettingUpdate, editChannelPermission } from "../module/voiceController";

const commandChannelEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(Number(config.botColor))
    .setTitle("ボイスチャンネルの設定")
    .setDescription("設定を行いたい場合、下のメニューから設定を行ってください\nボイスチャンネルの公開はVCチャットから行ってください")
const publicChannelEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(Number(config.botColor))
    .setTitle("ボイスチャンネルを公開しました")
    .setDescription("設定を行いたい場合、下のメニューから設定を行ってください")
module.exports = {
	async execute(interaction: Interaction): Promise<void> {
        if (!interaction.isButton()) return;
        const userName = interaction.user.displayName;
        const userId = interaction.user.id;
        const date = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
        // -----------------------------------------------------------------------------------------------------------
        // チャンネルを公開する・した後のボタン処理
        // -----------------------------------------------------------------------------------------------------------
        try {
            switch (interaction.customId) {
                case "publicButton": {
                    const channel = interaction.member instanceof GuildMember ? interaction.member?.voice.channel : null;
                    if(!channel) return;
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
                        components: settingComponentUpdate(interaction)
                    });
                    break
                }
                case "startButton": {
                    const voiceChannel = interaction.member instanceof GuildMember ? interaction.member?.voice.channel : null;
                    if (!voiceChannel) return;

                    await interaction.update({
                        embeds: [
                            commandChannelEmbed.setFields(await channelSettingUpdate(interaction))
                        ],
                        components: settingComponentUpdate(interaction)
                    });
                    break;
                }
                case "confirmationButton": {
                    await interaction.reply({
                        embeds: [
                            settingBlockEmbed.setFields(await blockSettingUpdate(interaction))
                        ],
                        ephemeral: true,
                    });
                    break;
                }
            }
        } catch(error) {
            console.log(error);
        }
    }
};