import { Events, Interaction, ModalSubmitInteraction } from 'discord.js';
import { CustomCommand } from '../types/client';
import { config } from "../utils/config";
/**
 * インタラクション処理
 */
export = {
	name: Events.InteractionCreate,
	async execute(interaction: Interaction): Promise<void> {
		// コンテキストのメニューによってファイル別に読み込む
		if (interaction.isMessageContextMenuCommand()) {
			(await import("../commands/general/reportMessage")).execute(interaction);
		} else if (interaction.isUserContextMenuCommand()) {
			(await import("../commands/general/reportUser")).execute(interaction);
		}

		let commandName: string;
		// インタラクションの種類によってcommandNameを取得
		if (interaction.isChatInputCommand()) {
			commandName = interaction.commandName;
		} else if (interaction.isStringSelectMenu()&&interaction.message.interaction != null) {	
			commandName = interaction.message.interaction.commandName;
		} else if (interaction.isButton()&&interaction.message.interaction != null) {
			commandName = interaction.message.interaction.commandName;
		} else if (interaction.isStringSelectMenu() || interaction.isButton()) {
			commandName = interaction.customId.split("_")[1];
		} else {
			commandName = ""
		}
		const command: CustomCommand | undefined = interaction.client.commands.get(commandName);
		if (command) {
			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`[ERROR] 実行エラー: ${commandName}`);
				console.error(error);
			}
		} else if (!command) {
			try {
				if (interaction.channel?.id === config.tosChannelId) {
					(await import("../guildProcess/authentication")).execute(interaction as Interaction<"cached">);
				} else {
					(await import("../guildProcess/voiceCreateInteraction")).execute(interaction);
					(await import("../guildProcess/reportModal")).execute(interaction as ModalSubmitInteraction);
				}
			} catch (error) {
				console.log(error);
			}
		}
	}
};