import { Events, Client } from 'discord.js';

module.exports = {
	name: Events.ClientReady,
	once: false,
	execute(client: Client) {
		console.log(`[INFO] 起動完了: ${client.user?.tag}`);
		require("../guildProcess/periodically").execute(client);
	},
};