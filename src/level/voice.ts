import { vcConnectTimeMap, vcBonusMap } from "../module/periodicExecution";
import { PrismaClient } from "@prisma/client";
import { grantRole } from "../level/role";
import { grantXP } from "../level/grantXP";
import { VoiceState } from "discord.js";
import { config } from "../utils/config";
const prisma = new PrismaClient();

module.exports = {  
    async execute(oldState: VoiceState, newState: VoiceState): Promise<void> {
        if (oldState.channel?.id === config.afkChannelId) return; // 放置チャンネルはXPを付与しない
        const now = new Date();
        const unixTimeStamp = Math.floor(now.getTime() / 1000);
        const userId = oldState?.id || newState?.id || "";
        const guild = oldState?.guild || newState?.guild;
        const vcConnectTime: number = vcConnectTimeMap.get(userId) || 0;

        let xp: number = 0;

        const user = await prisma.levels.findFirst({
            select: {
                user_id: true,
                user_xp: true
            },
            where: { user_id: userId }
        });

        const isBonus = vcBonusMap.get(userId) ? vcBonusMap.get(userId)! < 600 : true; // ボーナス適用するか (初接続 or 600s未満だったら、true)

        try {
            /**
             * レベルシステム
             */
            if (oldState?.channel === null && newState?.channel !=  null) { // 入った時
                vcConnectTimeMap.set(userId, unixTimeStamp);
                console.log(`[VC接続] user_id: ${userId}, unixTimeStamp(JoinedTime): ${unixTimeStamp}`);
            } else if (oldState?.channel != null && newState?.channel === null) { // 抜けた時
                xp = grantXP(userId, vcConnectTime, unixTimeStamp, isBonus);
                vcConnectTimeMap.delete(userId);
            } else if (oldState?.channel != null && newState?.channel != null) { // 移動した時
                xp = grantXP(userId, vcConnectTime, unixTimeStamp, isBonus);
                vcConnectTimeMap.delete(userId);
            }

            if (user) { // データがある場合、更新する
                await prisma.levels.updateMany({
                    where: { user_id: userId },
                    data: { user_xp: user.user_xp + xp }
                });

                grantRole(userId, guild, user.user_xp + xp); // 役職付与
            } else { // データがない場合、作成する
                await prisma.levels.create({
                    data: {
                        user_id: userId,
                        user_xp: xp
                    }
                });

                grantRole(userId, guild, xp); // 役職付与
            }
        } catch(error) {
            console.log(error);
        }
    }
}