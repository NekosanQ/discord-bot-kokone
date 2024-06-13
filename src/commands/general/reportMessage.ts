import { 
    ContextMenuCommandInteraction, 
    ContextMenuCommandBuilder, 
    ApplicationCommandType, 
    ActionRowBuilder, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle 
} from "discord.js";

const reportModal = new ModalBuilder()
    .setTitle("報告")
    .setCustomId('messageReportModal')

const breachContentInput = new TextInputBuilder()
    .setCustomId('messageBreachContentInput')
    .setLabel("違反内容")
    .setMinLength(1)
    .setMaxLength(1000)
    .setPlaceholder('違反と思う内容を書いてください')
    .setRequired(true)
    .setStyle(TextInputStyle.Paragraph)

const otherContentInput = new TextInputBuilder()
    .setCustomId('messageOtherContentInput')
    .setLabel("その他")
    .setMinLength(1)
    .setMaxLength(1000)
    .setPlaceholder('運営などに報告したい事などがあれば記載してください(任意)\n※無い場合は「なし」など記入してください。')
    .setStyle(TextInputStyle.Paragraph)
const messageIdInput = new TextInputBuilder()
    .setCustomId('messageIdInput')
    .setLabel("メッセージID(書き換えないでください)")
    .setMinLength(15)
    .setMaxLength(25)
    .setStyle(TextInputStyle.Short)

const breachContentActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(breachContentInput);
const otherContentActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(otherContentInput);
const messageIdActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(messageIdInput);
reportModal.addComponents(breachContentActionRow, otherContentActionRow, messageIdActionRow);

export = {
    data: new ContextMenuCommandBuilder()
	    .setName('このメッセージを報告する')
	    .setType(ApplicationCommandType.Message),
    async execute(interaction: ContextMenuCommandInteraction): Promise<void> {
        messageIdInput.setValue(`${interaction.targetId}`);
        await interaction.showModal(reportModal);
    }
}
