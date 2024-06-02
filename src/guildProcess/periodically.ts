import { Channel, Client, TextChannel } from 'discord.js';
import cron from 'node-cron';
import fs from "node:fs";
import path from "node:path";
import { config } from "../utils/config";
import { writeFile } from "../module/file/writeFile";
import { appendFile } from '../module/file/appedFile';

import { periodicDayExecution, periodicWeekExecution } from "../module/periodicExecution";

/**
 * 毎日0時になったら処理をするシステム
 */
module.exports = {
    async execute(client: Client): Promise<void> {
        const date: string = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
        try {
            const getLogChannelId: Channel | undefined = client.channels.cache.get(config.logChanneld); // 運営チャンネルを取得
            if (getLogChannelId) {
                const logsPath: string = path.join(__dirname, '../../logs');
                const logFiles: string[] = fs.readdirSync(logsPath).filter(file => file.endsWith('.log'));
                cron.schedule("0 0 0 * * *", async () => { // 0時になったら実行
                    for (const file of logFiles) { // logsフォルダのlogファイルを全て取得
                        const filePath: string = path.join(logsPath, file);
                        (getLogChannelId as TextChannel).send({
                            files: [filePath]
                        });
                        setTimeout(() => { // ファイルを送信した1秒後に上書きする
                            writeFile(filePath, "");
                        }, 1000);
                    }
                    await periodicDayExecution();
                })
            }
            cron.schedule("0 0 * * 6", async () => { // 毎週土曜日 午前0時0分 (0 0 * * 6)
                await periodicWeekExecution(client);
                console.log("レベルの更新をしました");
            })
        } catch (error) {
            appendFile("logs/error.log", `[${date}] ${error}`);
        }
    }
};