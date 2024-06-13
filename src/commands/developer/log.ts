import { CommandInteraction, SlashCommandBuilder, } from "discord.js";
/**
 * ログを送信するコマンド
 */
export = {
	data: new SlashCommandBuilder()
		.setName("log")
		.setDescription("ログを送信します"),
	async execute(interaction: CommandInteraction): Promise<void> {
        console.log(interaction);
		await interaction.reply({
            content: "成功",
            allowedMentions: { repliedUser: false }
        });
	},
};