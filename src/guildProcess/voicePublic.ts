import { ButtonInteraction, EmbedBuilder, Interaction, VoiceBasedChannel, VoiceChannel } from "discord.js";
import { config } from "../utils/config";
import { appendFile } from "../module/file/appedFile";
import { 
    operationMenu, 
    allowUserPermisson, 
    allowCreateUserPermisson,
    denyUserPermisson, 
} from "../module/voiceCreateData";
import { PrismaClient } from "@prisma/client"
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
        // チャンネルを公開する時の処理
        // -----------------------------------------------------------------------------------------------------------
        if (interaction.customId === "publicButton") {
            try {
                if (channel && channel.type === 2) { // チャンネルがボイスチャンネルかどうか確認
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
                        components: [operationMenu]
                    });
                };
            } catch(error) {
                console.log(error);
            };
        };
    }
};