import { Events, Client } from 'discord.js';
import log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = "info";
// -----------------------------------------------------------------------------------------------------------
// 起動処理
// -----------------------------------------------------------------------------------------------------------
module.exports = {
	name: Events.ClientReady,
	once: false,
	execute(client: Client) {
		const date = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
		setInterval(() => {
			client.user?.setActivity({
				name: `猫の隠れ家 専属BOT | / |${client.ws.ping}ms | 最終更新: ${date}`
			});
		  }, 10000);
		logger.info(`[INFO] 起動完了: ${client.user?.tag}`);
		require("../guildProcess/periodically").execute(client);
	},
};