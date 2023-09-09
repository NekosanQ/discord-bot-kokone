import { Channel, Client, TextChannel } from 'discord.js';
import cron from 'node-cron';
import fs from "node:fs"
import path from "node:path"
import { ManagementChannelId } from '../config.json';
import { writeFile } from "../module/file/writeFile";

module.exports = {
    async execute(client: Client): Promise<void> {
        const getManagementChannelId: Channel | undefined = client.channels.cache.get(ManagementChannelId);
        if (getManagementChannelId) {
            const logsPath: string = path.join(__dirname, '../../logs');
            const logFiles: string[] = fs.readdirSync(logsPath).filter(file => file.endsWith('.log'));
            
            cron.schedule('0 0 0 * * *', () => {
                for (const file of logFiles) {
                    const filePath: string = path.join(logsPath, file);
                    (getManagementChannelId as TextChannel).send({
                        files: [filePath]
                    })
                    setTimeout(() => {
                        writeFile(filePath, "");
                      }, 1000);
                }
            });
        }
    }
}