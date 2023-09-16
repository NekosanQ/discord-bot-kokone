import { Channel, Client, TextChannel } from 'discord.js';
import cron from 'node-cron';
import fs from "node:fs"
import path from "node:path"
import { managementChannelId } from '../config.json';
import { writeFile } from "../module/file/writeFile";
// -----------------------------------------------------------------------------------------------------------
// 毎日0時になったら処理をするシステム
// -----------------------------------------------------------------------------------------------------------
module.exports = {
    async execute(client: Client): Promise<void> {
        const getManagementChannelId: Channel | undefined = client.channels.cache.get(managementChannelId); // 運営チャンネルを取得1
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
        };
    }
};