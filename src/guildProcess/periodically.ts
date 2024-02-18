import { Channel, Client, TextChannel } from 'discord.js';
import cron from 'node-cron';
import fs from "node:fs";
import path from "node:path";
import { config } from "../utils/config";
import { writeFile } from "../module/file/writeFile";
import { appendFile } from '../module/file/appedFile';
// -----------------------------------------------------------------------------------------------------------
// 毎日0時になったら処理をするシステム
// -----------------------------------------------------------------------------------------------------------
module.exports = {
    async execute(client: Client): Promise<void> {
        const date: string = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
        try {
            const getManagementChannelId: Channel | undefined = client.channels.cache.get(config.managementChannelId); // 運営チャンネルを取得
            if (getManagementChannelId) {
                const logsPath: string = path.join(__dirname, '../../logs');
                const logFiles: string[] = fs.readdirSync(logsPath).filter(file => file.endsWith('.log'));
                cron.schedule("0 0 0 * * *", () => { // 0時になったら実行
                    for (const file of logFiles) { // logsフォルダのlogファイルを全て取得
                        const filePath: string = path.join(logsPath, file);
                        (getManagementChannelId as TextChannel).send({
                            files: [filePath]
                        })
                        setTimeout(() => { // ファイルを送信した1秒後に上書きする
                            writeFile(filePath, "");
                        }, 1000);
                    };
                });
            }
        } catch (error) {
            appendFile("logs/error.log", `[${date}] ${error}`);
        }
    }
};