import { Channel, EmbedBuilder, ModalSubmitInteraction, TextChannel } from "discord.js";
import { config } from "../utils/config";

export = {
    async execute(interaction: ModalSubmitInteraction): Promise<void> {
        if (!interaction.isModalSubmit()) return;

        const getManagementChannel: Channel | undefined = interaction.client.channels.cache.get(config.managementChannelId);

        if (getManagementChannel && (interaction.customId === "messageReportModal" || interaction.customId === "userReportModal")) {
            const isMessageReport = interaction.customId === "messageReportModal";
            const breachContent = interaction.fields.getTextInputValue(isMessageReport ? 'messageBreachContentInput' : 'userBreachContentInput');
            const otherContent = interaction.fields.getTextInputValue(isMessageReport ? 'messageOtherContentInput' : 'userOtherContentInput');
            const id = interaction.fields.getTextInputValue(isMessageReport ? 'messageIdInput' : 'userIdInput');
            const reportEmbed = new EmbedBuilder()
                .setColor(Number(config.botColor))
                .setTitle(isMessageReport ? "メッセージ報告" : "ユーザー報告")
                .setFields(
                    { name: "違反内容", value: breachContent },
                    { name: "その他", value: otherContent },
                    { name: isMessageReport ? "メッセージID" : "ユーザーID", value: id }
                )
                .setTimestamp()
                .setFooter({ text: `${interaction.user.displayName}/${interaction.user.id}` });

            if (isMessageReport) {
                const messageLink = `https://discord.com/channels/${interaction.guild?.id}/${interaction.channel?.id}/${id}`;
                reportEmbed.addFields({ name: "メッセージリンク", value: messageLink });
            }

            await (getManagementChannel as TextChannel).send({ embeds: [reportEmbed] });
            await interaction.reply({
                content: `報告が完了しました。\nこの報告は運営が確認し、判断させてもらいます。`,
                ephemeral: true
            });
        }
    }
}