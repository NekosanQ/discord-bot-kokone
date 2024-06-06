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
    .setCustomId('userReportModal')
    .setTitle('報告')

const breachContentInput = new TextInputBuilder()
    .setCustomId('userBreachContentInput')
    .setLabel("ユーザー違反行為内容")
    .setMinLength(1)
    .setMaxLength(1000)
    .setPlaceholder('ユーザーが違反したと思う内容を記載してください')
    .setRequired(true)
    .setStyle(TextInputStyle.Paragraph)

const otherContentInput = new TextInputBuilder()
    .setCustomId('userOtherContentInput')
    .setLabel("その他")
    .setMinLength(1)
    .setMaxLength(1000)
    .setPlaceholder('運営などに報告したい事などがあれば記載してください(任意)\n※無い場合は「なし」など記入してください。')
    .setStyle(TextInputStyle.Paragraph)

const userIdInput = new TextInputBuilder()
    .setCustomId('userIdInput')
    .setLabel("ユーザーID(書き換えないでください)")
    .setMinLength(15)
    .setMaxLength(25)
    .setStyle(TextInputStyle.Short)

const breachContentActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(breachContentInput);
const otherContentActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(otherContentInput);
const userIdActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(userIdInput);

reportModal.addComponents(breachContentActionRow, otherContentActionRow, userIdActionRow);

module.exports = {
    data: new ContextMenuCommandBuilder()
	    .setName('このユーザーを報告する')
	    .setType(ApplicationCommandType.User),
    async execute(interaction: ContextMenuCommandInteraction): Promise<void> {
        userIdInput.setValue(interaction.targetId);
        await interaction.showModal(reportModal);
    }
}
