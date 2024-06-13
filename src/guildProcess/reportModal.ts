import { Channel, EmbedBuilder, ModalSubmitInteraction, TextChannel } from "discord.js";
import { config } from "../utils/config";
export = {
    async execute(interaction: ModalSubmitInteraction): Promise<void> {
        if (!interaction.isModalSubmit()) return;

        const getManagementChannel: Channel | undefined = interaction.client.channels.cache.get(config.managementChannelId);

        if (getManagementChannel) {
            if (interaction.customId === "messageReportModal") {
                const breachContent = interaction.fields.getTextInputValue('messageBreachContentInput');
                const otherContent = interaction.fields.getTextInputValue('messageOtherContentInput');
                const messageId = interaction.fields.getTextInputValue('messageIdInput');
                const messageLink = `https://discord.com/channels/${interaction.guild?.id}/${interaction.channel?.id}/${messageId}`;
                const reportEmbed = new EmbedBuilder()
                    .setColor(Number(config.botColor))
                    .setTitle("メッセージ報告")
                    .setFields(
                        { name: "違反内容", value: breachContent },
                        { name: "その他", value: otherContent },
                        { name: "メッセージID", value: messageId },
                        { name: "メッセージリンク", value: messageLink }
                    )
                    .setTimestamp()
                    .setFooter({ text: `${interaction.user.displayName}/${interaction.user.id}`})

                await (getManagementChannel as TextChannel).send({
                    embeds: [reportEmbed]
                });
            }

            if (interaction.customId === "userReportModal") {
                const breachContent = interaction.fields.getTextInputValue('userBreachContentInput');
                const otherContent = interaction.fields.getTextInputValue('userOtherContentInput');
                const userId = interaction.fields.getTextInputValue('userIdInput');
                const reportEmbed = new EmbedBuilder()
                    .setColor(Number(config.botColor))
                    .setTitle("ユーザー報告")
                    .setFields(
                        { name: "違反内容", value: breachContent },
                        { name: "その他", value: otherContent },
                        { name: "ユーザーID", value: userId }
                    )
                    .setTimestamp()
                    .setFooter({ text: `${interaction.user.displayName}/${interaction.user.id}`})

                await (getManagementChannel as TextChannel).send({
                    embeds: [reportEmbed]
                });
            }

            await interaction.reply({
                content: `報告が完了しました。\nこの報告は運営が確認し、判断させてもらいます。`,
                ephemeral: true
            });
        }
    }
}
