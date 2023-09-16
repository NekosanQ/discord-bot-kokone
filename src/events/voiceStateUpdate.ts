import { Events, TextChannel, VoiceState, } from "discord.js";
import { appendFile } from '../module/file/appedFile';
// -----------------------------------------------------------------------------------------------------------
// メッセージ処理
// -----------------------------------------------------------------------------------------------------------
module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState: VoiceState, newState: VoiceState): Promise<void> {
        const date = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
        // ログチャンネルを取得
        const logChannel = newState.client.channels.cache.get("993406780262592532");

        // ユーザー名とボイスチャンネル名を取得
        const newMember = newState.member;
        const oldMember = oldState.member;
        const userName = newMember ? `${newState.member?.user.displayName}/${newState.member?.user.id}` : oldMember ? `${oldState.member?.user.displayName}/${oldState.member?.user.id}` : "なし";
        // ボイスチャンネル名とIDを取得
        const newChannel = newState.channel;
        const oldChannel = oldState.channel;
        const voiceChannelName = newChannel ? `${newChannel.name}/${newChannel.id}` : oldChannel ? `${oldChannel.name}/${oldChannel.id}` : "なし";

        // ミュート状態と配信状態を取得
        const muteStatus = newState.mute ? "ミュート" : "ミュート解除";
        const streamStatus = newState.streaming ? "配信開始" : "配信終了";

        // ログメッセージを作成
        let logMessage = `[${date}] `;
        // ボイスチャンネルに入ったか退出したか判定
        if (oldState.channelId === newState.channelId) {
            // チャンネルが同じならミュート状態か配信状態が変わったと判定
            if (oldState.mute !== newState.mute) {
                // ミュート状態が変わったらログメッセージに追加
                logMessage += `${muteStatus}にしました`;
            } else if (oldState.streaming !== newState.streaming) {
                // 配信状態が変わったらログメッセージに追加
                logMessage += `${streamStatus}しました`;
            } else {
                return;
            }
        } else if (newState.channel) {
            // 新しいチャンネルがあるなら入室したと判定
            logMessage += "入室しました";
        } else {
            // 新しいチャンネルがないなら退出したと判定
            logMessage += "退出しました";
        };
        logMessage += ` <ユーザー表示名/ID> ${userName} <チャンネル名/ID> ${voiceChannelName}`;
        appendFile("logs/voice.log", logMessage);
    }
};