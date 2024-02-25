import { CommandInteraction, EmbedBuilder, SlashCommandBuilder, Message, AttachmentBuilder, GuildMember, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, Interaction } from "discord.js";
import { authenticationProcess, authenticationMap } from "../module/imageGenerate";
import { config } from "../utils/config";
import { appendFile } from "../module/file/appedFile";
import { embeds } from "../module/ruledata";
import { logger } from "../utils/log";

/**
 * 認証をするためのボタン
 */
const certificationButton: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
        new ButtonBuilder()
            .setCustomId("certificationButton")
            .setLabel("認証を開始する")
            .setStyle(ButtonStyle.Success)
    )
/**
 * 認証するためのモーダル
 */
const certificationModal = new ModalBuilder()
	.setCustomId('certificationModal')
	.setTitle('画像認証');
/**
 * 認証画面
 */
const authenticationInput = new TextInputBuilder()
	.setCustomId('authenticationInput')
    .setMinLength(6)
    .setMaxLength(6)
    .setPlaceholder("認証コードは6文字で、緑色のフォントの方です")
	.setLabel("認証コードを入力してください")
	.setStyle(TextInputStyle.Short);
/**
 * コンポーネントを追加
 */
const certificationActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(authenticationInput);
// -----------------------------------------------------------------------------------------------------------
// 認証処理
// -----------------------------------------------------------------------------------------------------------
module.exports = {
    async execute(interaction: Interaction<"cached">): Promise<void> {
        const date: string = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
        const certificationEmbed: EmbedBuilder = new EmbedBuilder()
            .setColor(Number(config.botColor))
            .setTitle("認証テスト")
            .setDescription("以下の画像の緑色のテキストを読み取り、認証を開始してください")
            .setImage(`attachment://${interaction.user.id}.png`)

        if (interaction.isButton()) {
            if (interaction.customId === "agreeButton") {
                const authenticationArray = await authenticationProcess(interaction);
                const authenticationCode = authenticationArray[0] as string; // 認証コード
                const attachment = authenticationArray[1]; // 認証画像
                authenticationMap.set(interaction.user.id, authenticationCode); // 認証コードをセット

                await interaction.reply({
                    embeds: [certificationEmbed],
                    components: [certificationButton],
                    files: [attachment],
                    ephemeral: true
                });
            } else { // 認証を開始するボタンの処理
                certificationModal.setComponents(certificationActionRow);
                await interaction.showModal(certificationModal);
            }
        } else if (interaction.isModalSubmit()) { // 認証結果
            const sendCode = interaction.fields.getTextInputValue('authenticationInput'); // 送信されたコード
            const authenticationCode = authenticationMap.get(interaction.user.id); // 認証コードを取得

            if (sendCode === authenticationCode) { // 一致してた場合の処理
                if (interaction.channel?.id === config.tosChannelId) {
                    await interaction.deferReply({ 
                        ephemeral: true 
                    });
                    await interaction.member.roles.remove(config.uncertifiedRoleId);
                    await interaction.member.roles.add(config.authenticatedRoleId);
                    await interaction.editReply({
                        embeds: [embeds.completed]
                    });
                    logger.info(`利用規約に同意しました <実行ユーザー表示名/名前/ID>: ${interaction.user.displayName}/${interaction.user.username}/${interaction.user.id}`);
                    appendFile("logs/rule.log", `[${date}] 利用規約に同意しました <実行ユーザー/ID>: <実行ユーザー表示名/名前/ID>: ${interaction.user.displayName}/${interaction.user.username}/${interaction.user.id}\n`);
                }
            } else {
                await interaction.reply({
                    content: "認証失敗",
                    ephemeral: true
                });
            }
        }
    }
}