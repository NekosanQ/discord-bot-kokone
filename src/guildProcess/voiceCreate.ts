import { VoiceState } from "discord.js";
import { appendFile } from "../module/file/appedFile";
import { 
    createChannelEmbed, 
    userBlackListMenu, 
    userBlackReleaseListMenu, 
    operationMenu, 
    publicButton, 
    allowUserPermisson, 
    denyUserPermisson,
    allowCreateUserPermisson, 
} from "../module/voiceCreateData";
import { PrismaClient } from "@prisma/client"
import { config } from "../utils/config";
const prisma = new PrismaClient();
// デフォルトであるボイスチャンネル
const defaultChannelList: string[] = config.defaultVoiceChannelList;
const deleteMap = new Map<string, NodeJS.Timeout>();
// -----------------------------------------------------------------------------------------------------------
// ボイスチャンネル作成機能
// VC作成チャンネルにアクセス -> VC作成(権限管理) -> VC移動 
// [仕様: VCに30秒間誰もいない場合は自動削除]
// -----------------------------------------------------------------------------------------------------------
module.exports = {  
    async execute(oldState: VoiceState, newState: VoiceState): Promise<void> {
        const newMember = newState.member;
        const oldMember = oldState.member;
        const userName = newMember ? `${newState.member?.user.displayName}` : oldMember ? `${oldState.member?.user.displayName}` : "unknown user";
        const userId = newMember ? `${newState.member?.user.id}` : oldMember ? `${oldState.member?.user.id}` : "";
        const defaultChannelName = `自動作成-${userName}`; // デフォルトのチャンネル名
        const date = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
        // -----------------------------------------------------------------------------------------------------------
        // VC作成チャンネルに入った場合の処理
        // -----------------------------------------------------------------------------------------------------------
        if (oldState.channelId !== config.voiceCreateChannelId && newState.channelId === config.voiceCreateChannelId) {
            appendFile("logs/vc_create.log", `[${date}] VCを作成しました <実行ユーザー/ID> ${userName}/${userId}\n`);
            const voiceChannel = newState.channel; // 特定のボイスチャンネルを取得
            voiceChannel?.clone({ // 特定のボイスチャンネルと同じカテゴリーに新しいボイスチャンネルを作成
                name: defaultChannelName,
                permissionOverwrites: [
                    {
                        id: userId,
                        allow: [allowCreateUserPermisson, allowUserPermisson]
                    },
                    {
                        id: config.authenticatedRoleId,
                        deny: [denyUserPermisson]
                    },
                    {
                        id: config.everyoneRoleId,
                        deny: [denyUserPermisson]
                    }
                ]
            })
            .then((newVoiceChannel) => { 
                newState.setChannel(newVoiceChannel) // 作成したボイスチャンネルに移動
                .then(async () => {
                    const channelName: string | undefined = newState.channel?.name;
                    let channelUserLimit: number | string | undefined = newState.channel?.userLimit;
                    if (channelUserLimit === 0) {
                        channelUserLimit = "無制限";
                    } else {
                        channelUserLimit = `${channelUserLimit}人`
                    }
                    const channelBitRate = Number(newState.channel?.bitrate) / 1000;
                    let blockUserList = "なし";

                    const allUsers = await prisma.blackLists.findMany({
                        where: {
                            user_id: String(newMember?.id)
                        },
                    })
                    for (let i = 0; i < allUsers.length; i++) {
                        if (blockUserList == "なし") blockUserList = "";
                        blockUserList += `<@${String(allUsers[i].block_user_id)}>\n`;
                    };
                    newVoiceChannel.send({ // 移動が成功したらメッセージを送信
                        content: `<@${userId}>`,
                        embeds: [createChannelEmbed
                            .setFields(
                                { name: "現在の設定", value: `チャンネル名: ${channelName}\nユーザー人数制限: ${channelUserLimit}\nビットレート: ${channelBitRate}kbps`},
                                { name: "ブロックしているユーザー", value: blockUserList}
                            )
                        ],
                        components: [userBlackListMenu, userBlackReleaseListMenu, operationMenu, publicButton]
                    });
                })
                .catch((error: Error) => {
                    console.error(error);
                    newVoiceChannel.send("移動に失敗しました");
                });
            })
            .catch((error: Error) => {
                console.error(error);
            });
        };
        // -----------------------------------------------------------------------------------------------------------
        // VCに誰もいない場合、チャンネルを削除する処理
        // -----------------------------------------------------------------------------------------------------------
        if (oldState.channelId && oldState.channelId !== newState.channelId) { 
            try {
                for (let i = 0; i < defaultChannelList.length; i++) { // デフォルトで存在しているボイスチャンネルを除外する
                    if (defaultChannelList[i] === oldState.channelId) return;
                };
                if (oldState.channel?.members.size === 0) { // チャンネルに誰もいない場合
                    const timeout = setTimeout(() => { // 30秒後に削除する予約を作成
                        oldState.channel?.delete();
                        deleteMap.delete(oldState.channel?.id!);
                    }, 30 * 1000);
                    deleteMap.set(oldState.channel.id, timeout); // マップに予約を保存
                };
            } catch (error) {
                console.log(error);
            };
        };
        // -----------------------------------------------------------------------------------------------------------
        // VCに入り直した場合、チャンネルを削除する予約をキャンセルする処理
        // -----------------------------------------------------------------------------------------------------------
        if (newState.channelId && newState.channelId !== oldState.channelId) {
            try {
                for (let i = 0; i < defaultChannelList.length; i++) { // デフォルトで存在しているボイスチャンネルを除外する
                    if (defaultChannelList[i] === newState.channelId) return;
                };
                if (deleteMap.has(newState.channel?.id!)) { // マップに予約がある場合
                    clearTimeout(deleteMap.get(newState.channel?.id!)); // 予約をキャンセル
                    deleteMap.delete(newState.channel?.id!);
                };
            } catch (error) {
                console.log(error);
            };
        };
    },
};