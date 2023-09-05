import { Events, Interaction } from 'discord.js';
import { CustomCommand } from '../types/client';

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction: Interaction): Promise<void> {
		let commandName: string;
		if (interaction.isChatInputCommand()) {
			commandName = interaction.commandName;
		} else if (interaction.isStringSelectMenu()&&interaction.message.interaction != null) {	
			commandName = interaction.message.interaction.commandName;
		} else if (interaction.isButton()&&interaction.message.interaction != null) {
			commandName = interaction.message.interaction.commandName;
		} else {
			commandName = ""
		}
		const command: CustomCommand | undefined = interaction.client.commands.get(commandName);
		if (!command) {
			console.error(`[ERROR] コマンドが見つかりませんでした: ${commandName}`);
			return;
		};
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`[ERROR] 実行エラー: ${commandName}`);
			console.error(error);
		}
	},
};