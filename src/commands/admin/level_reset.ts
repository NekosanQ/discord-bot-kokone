import { CommandInteraction, Interaction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { periodicExecution } from "../../module/periodicExecution";

// -----------------------------------------------------------------------------------------------------------
// レベルシステム情報リセット処理
// -----------------------------------------------------------------------------------------------------------
module.exports = {
    data: new SlashCommandBuilder() // スラッシュコマンド
		.setName('level_reset')
		.setDescription('レベルシステムの情報をリセットします'),
    async execute(interaction: Interaction<"cached">) {
        if (interaction.isChatInputCommand()&&interaction.member?.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.deferReply({
                ephemeral: true
            });
            try {
                await periodicExecution(interaction.client);
                await interaction.editReply({
                    content: "成功"
                });
            } catch(error) {
                console.log(error);
            }
        }
	}
};