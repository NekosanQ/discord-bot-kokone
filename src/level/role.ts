import { Guild } from "discord.js";
import { config } from "../utils/config";

/**
 * 役職がもらえる基準
 * @type {number[]} 基準となるレベル
 */
const levels: number[] = [250000, 100000, 50000, 10000, 1000];

/**
 * 役職を付与する
 * @param userId 対象ユーザー
 * @param guild 実行Guild
 * @param xp 現在の経験値
 * @returns なし
 */
export async function grantRole(userId: string, guild: Guild, xp: number) : Promise<void> {
    const member = await guild.members.fetch(userId);
    const bot = await guild.members.fetch(config.clientId);

    if (member?.roles.highest.position! > bot?.roles.highest.position!) // Botより役職位置が高い人には付与しない
        return;
    
    const roles: string[] = config.roleIds.slice(0, 5).reverse(); // 猫神からのロール順序に変更
    for (let i = 0; i < levels.length; i++) {
        if (xp >= levels[i] && !member?.roles.cache.has(config.roleIds[i])) {
            member?.roles.add(roles[i]);
            break;
        }
    }
}

/**
 * 実行ユーザーの経験値が一定基準より下回ったとき、役職を剥奪する
 * @param userId 実行ユーザーID
 * @param roleId 剥奪しようとしているロールID
 * @param guild 実行サーバID
 * @param xp 実行ユーザーの経験値
 * @returns なし
 */
export async function deprivationRole(userId: string, roleId: string, guild: Guild, xp: number) : Promise<void> {
    const member = await guild?.members.fetch(userId);
    const bot = await guild?.members.fetch(config.clientId);
    if (member?.roles.highest.position! > bot?.roles.highest.position!) // Botより役職位置が高い人には役職剥奪しない
        return;
    if (member.roles.cache.has("1068470906093051924")) // ブースターは役職剥奪しない
        return;
    for (let i = 0; i < levels.length; i++) {
        if (levels[i] > xp && member?.roles.cache.has(roleId)) {
            member?.roles.remove(roleId);
        }
    }
};