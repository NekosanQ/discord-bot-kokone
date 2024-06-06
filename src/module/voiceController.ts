import { PrismaClient } from "@prisma/client";
import {
    EmbedBuilder,
    ActionRowBuilder,
    ModalSubmitInteraction,
    StringSelectMenuInteraction,
    UserSelectMenuInteraction,
    OverwriteResolvable,
    VoiceBasedChannel,
    User,
    ButtonInteraction,
    UserSelectMenuBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder,
    PermissionsBitField,
    ButtonStyle,
    OverwriteType,
    GuildMember,
    TextChannel
} from "discord.js";

import { config } from "../utils/config.js";

import { client } from "../index.js";

/**
 * データベースのインスタンス
 */
export const prisma = new PrismaClient();

/**
 * ボイスチャンネルを作成時に送る埋め込みメッセージ
 */
export const createChannelEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(Number(config.botColor))
    .setTitle("ボイスチャンネルを作成しました。")
    .setDescription("設定を行いたい場合、下のメニューから設定を行ってください。")
/**
 * ボイスチャンネルの設定時に送る埋め込みメッセージ
 */
export const settingChannelEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(Number(config.botColor))
    .setTitle("ボイスチャンネルの設定")
    .setDescription("二段階認証をしている場合、手動でチャンネルの設定やボイスチャットメンバーへのミュートなどが行えます。\n二段階認証していない場合、BOTからチャンネルの設定を行う事が出来ます\n※引き継がれるのはブロックしているユーザー・ロールのみです。チャンネル名などは引き継がれません。")
/**
 * ブロック設定時に送る埋め込みメッセージ
 */
export const settingBlockEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(Number(config.botColor))
    .setTitle("ブロックユーザー一覧")
    .setDescription("設定を行いたい場合、設定画面のメニューから設定を行ってください。")
/**
 * VCのロック設定時に送る埋め込みメッセージ
 */
export const settingLockEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(Number(config.botColor))
    .setTitle("VCのロックの設定")
    .setDescription("設定を行いたい場合、設定画面のメニューから設定を行ってください。")
/**
 * ブロックするユーザーを選択するためのセレクトメニュー
 */
export const userBlockListMenu: ActionRowBuilder<UserSelectMenuBuilder> = new ActionRowBuilder<UserSelectMenuBuilder>().setComponents(
    new UserSelectMenuBuilder()
        .setCustomId("userBlockList")
        .setPlaceholder("ブロックするユーザーを選択")
        .setMaxValues(10)
        .setMinValues(1)
);
/**
 * ブロックしているユーザーを解除選択するためのセレクトメニュー
 */
export const userBlockReleaseListMenu: ActionRowBuilder<UserSelectMenuBuilder> = new ActionRowBuilder<UserSelectMenuBuilder>().setComponents(
    new UserSelectMenuBuilder()
        .setCustomId("userBlockReleaseList")
        .setPlaceholder("ブロックを解除するユーザーを選択")
        .setMaxValues(10)
        .setMinValues(1)
);
/**
 * 設定を選択するためのセレクトメニュー
 */
export const operationMenu: ActionRowBuilder<StringSelectMenuBuilder> = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
    new StringSelectMenuBuilder()
        .setCustomId("operationMenu")
        .setPlaceholder("チャンネルの設定")
        .setMaxValues(1)
        .setMinValues(1)
        .addOptions(
            {
                label: "名前",
                description: "チャンネルの名前を変更できます",
                emoji: "<:bot_2:1033758462590599188>",
                value: "name_change"
            },
            {
                label: "人数制限",
                description: "人数制限の人数を変更できます(0~99)",
                emoji: "<:bot_2:1033758462590599188>",
                value: "peopleLimited_change"
            },
            {
                label: "ビットレート",
                description: "ビットレート(音質)を変更できます(8~384)",
                emoji: "<:bot_2:1033758462590599188>",
                value: "bitrate_change"
            },
            {
                label: "オーナーの変更",
                description: "VCの管理権限を他の人に渡します",
                emoji: "<:bot_14:1050454131573276712>",
                value: "owner_change"
            }
        )
);
/**
 * VCをロックするためのボタン
 */
let lockSettingButton: ButtonBuilder = new ButtonBuilder()
    .setCustomId("lockButton")
    .setLabel("🔒")
    .setStyle(ButtonStyle.Primary)
/**
 * VCのロックを解除するためのボタン
 */
const unLockSettingButton: ButtonBuilder = new ButtonBuilder()
    .setCustomId("unLockButton")
    .setLabel("🔓")
    .setStyle(ButtonStyle.Primary)
/**
 * チャンネルを公開するためのボタン
 */
const publicButton: ButtonBuilder = new ButtonBuilder()
    .setCustomId("publicButton")
    .setLabel("ボイスチャンネルを公開する")
    .setStyle(ButtonStyle.Success)
/**
 * ブロックしているユーザーを確認するためのボタン
 */
const confirmationButton: ButtonBuilder = new ButtonBuilder()
    .setCustomId("confirmationButton")
    .setLabel("ブロックユーザーを確認する")
    .setStyle(ButtonStyle.Success)
/**
 * 更新ボタン
 */
const reloadButton: ButtonBuilder = new ButtonBuilder()
    .setCustomId("reloadButton")
    .setLabel("🔄️")
    .setStyle(ButtonStyle.Primary)
/**
 * セレクトメニューの下にある操作ボタン
 */
export let settingButton: ActionRowBuilder<ButtonBuilder>;

export const defaultSettingButton: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(publicButton, reloadButton)
/**
 * VCのオーナーの変更を行う際の埋め込みメッセージ
 */
export const transferOwnershipEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(Number(config.botColor))
    .setTitle("VCのオーナーの変更")
    .setDescription("他の人にVCの管理権限を渡します\n設定を行いたい場合、下のメニューから設定を行ってください。",);
/**
 * 譲渡するユーザーを選択するためのセレクトメニュー
 */
export const transferOwnershipMenu: ActionRowBuilder<UserSelectMenuBuilder> =
    new ActionRowBuilder<UserSelectMenuBuilder>().setComponents(
        new UserSelectMenuBuilder()
            .setCustomId("transferOwnership")
            .setPlaceholder("VCの管理権限を譲渡するユーザーを選択")
            .setMaxValues(1)
            .setMinValues(1),
    );
/**
 * ボイスチャンネルを使用するユーザーの権限
 */
export const allowUserPermisson: bigint[] = [
    PermissionsBitField.Flags.ViewChannel,            // チャンネルを見る
    PermissionsBitField.Flags.SendMessages,           // メッセージを送信
    PermissionsBitField.Flags.EmbedLinks,             // 埋め込みメッセージ
    PermissionsBitField.Flags.AttachFiles,            // ファイルを添付
    PermissionsBitField.Flags.ReadMessageHistory,     // メッセージ履歴を読む
    PermissionsBitField.Flags.AddReactions,           // リアクションの追加
    PermissionsBitField.Flags.UseSoundboard,          // サウンドボードの使用
    PermissionsBitField.Flags.UseApplicationCommands, // アプリケーションコマンドの使用
    PermissionsBitField.Flags.Connect,                // 接続
    PermissionsBitField.Flags.Speak,                  // 発言
    PermissionsBitField.Flags.Stream,                 // 配信
    PermissionsBitField.Flags.UseEmbeddedActivities,  // アクティビティの使用
    PermissionsBitField.Flags.UseVAD                  // 音声検出を使用
];
/**
 * ボイスチャンネルを作成したユーザーの追加管理権限
 */
export const allowCreateUserPermisson: bigint[] = [
    PermissionsBitField.Flags.MuteMembers,            // メンバーをミュート
    PermissionsBitField.Flags.DeafenMembers,          // メンバーをスピーカーミュート
    PermissionsBitField.Flags.ManageMessages,         // メッセージの管理
    PermissionsBitField.Flags.ManageChannels,         // チャンネルの管理
    PermissionsBitField.Flags.UseExternalEmojis,      // 外部の絵文字の使用
    PermissionsBitField.Flags.UseExternalStickers,    // 外部のスタンプの使用
    PermissionsBitField.Flags.UseExternalSounds,      // 外部のサウンドボードの使用
    PermissionsBitField.Flags.Connect,                // 接続
    PermissionsBitField.Flags.Speak,                  // 発言
    PermissionsBitField.Flags.UseVAD                  // 音声検出を使用
];
/**
 * ボイスチャンネルを使用させなくさせる為の権限
 */
export const denyUserPermisson: bigint[] = [
    PermissionsBitField.Flags.ViewChannel,            // チャンネルを見る
];
/**
 * VCコントローラーで用いるインタラクションの型
 */
export type MenuInteraction =
    | StringSelectMenuInteraction
    | UserSelectMenuInteraction
    | ModalSubmitInteraction
    | ButtonInteraction;

/**
 * VCのオーナーを取得する
 * @param channel チャンネル
 * @returns オーナー
 */
export function getChannelOwner(channel: VoiceBasedChannel): GuildMember | undefined {
    const ownerUser = channel.permissionOverwrites.cache.find( // チャンネルのオーナーを取得
        (permission) =>  {
            permission.type === OverwriteType.Member && permission.allow.has(PermissionsBitField.Flags.ManageChannels); // チャンネルの管理権限を持っているユーザーを取得
        }
    );
    if (!ownerUser) return undefined;
    return channel.guild.members.resolve(ownerUser.id) ?? undefined;
}
/**
 * ユーザー人数制限のメッセージを変更する
 * @param channelUserLimit ユーザー人数制限
 * @returns 
 */
export function channelUserLimitMessage(channelUserLimit: number | string): string {
    channelUserLimit = channelUserLimit === 0 ? "無制限" : `${channelUserLimit}人`;
    return channelUserLimit;
}
/**
 * チャンネルのステータスを更新する
 * @param interaction セレクトメニュー
 * @returns チャンネルステータス
 */
export function channelStatusCheckUpdate(interaction: MenuInteraction): string {
    let channelStatus = "🔴非公開";
    if (!interaction.message) return "🔴情報が取得できませんでした"
    const voiceChannel = interaction.member instanceof GuildMember ? interaction.member.voice.channel : null; // ユーザーが接続しているボイスチャンネルを取得

    const permissionOverwrites = voiceChannel?.permissionOverwrites.cache.get(config.authenticatedRoleId);

    if (permissionOverwrites && permissionOverwrites.deny.has(PermissionsBitField.Flags.Connect)) {
        channelStatus = "🔒ロック中";
    } else if (permissionOverwrites && permissionOverwrites.allow.has(PermissionsBitField.Flags.Connect)) {
        channelStatus = "🟢公開中";
    }
    return channelStatus;
}
/**
 * チャンネルの設定の表示を更新する
 * @param interaction メニュー
 * @returns 埋め込みメッセージの設定フィールド
 */
export async function channelSettingUpdate(interaction: MenuInteraction): Promise<{ name: string; value: string; }[]> {
    // ユーザーが接続しているボイスチャンネルを取得
    const voiceChannel = interaction.member instanceof GuildMember ? interaction.member.voice.channel : null;
    if (!voiceChannel) {
        return []; // ユーザーがボイスチャンネルに接続していない場合は空の配列を返す
    }

    const channelName = voiceChannel.name;
    const channelBitrate = Number(voiceChannel.bitrate) / 1000;
    let channelUserLimit: string | number = voiceChannel.userLimit;
    channelUserLimit = channelUserLimitMessage(channelUserLimit);

    const embedFielsArray = [];
    if (interaction.message) {
        const permissionOverwrites = voiceChannel?.permissionOverwrites.cache.get(config.authenticatedRoleId);

        const settingChannelObject = {
            name: "現在の設定", 
            value: `チャンネル名: ${channelName}\nユーザー人数制限: ${channelUserLimit}\nビットレート: ${channelBitrate}kbps\nVCの状態: ${channelStatusCheckUpdate(interaction)}` 
        };
        const blockUserListValue = await showBlockList(interaction, interaction.user.id);
        const blockUserListObject = {
            name: "ブロックしているユーザー",
            value: blockUserListValue
        };
        if (interaction.channel instanceof TextChannel) { // テキストチャンネルで操作している場合の処理
            embedFielsArray.push(settingChannelObject);
        } else { // ボイスチャンネルで操作している場合の処理
            // 公開してなかったらブロックしているユーザーの情報も追加する
            if (permissionOverwrites && permissionOverwrites.deny.has(PermissionsBitField.Flags.ViewChannel)) {
                embedFielsArray.push(settingChannelObject, blockUserListObject)
            } else {
                embedFielsArray.push(settingChannelObject);
            }
        }
    }
    return embedFielsArray;
}
/**
 * コンポーネントを更新する
 * @param interaction メニュー
 * @returns 設定のコンポーネント
 */
export function settingComponentUpdate(interaction: MenuInteraction) {
    if (!interaction.message) return
    const voiceChannel = interaction.member instanceof GuildMember ? interaction.member.voice.channel : null; // ユーザーが接続しているボイスチャンネルを取得
    const permissionOverwrites = voiceChannel?.permissionOverwrites.cache.get(config.authenticatedRoleId);

    let settingComponent: ActionRowBuilder<StringSelectMenuBuilder | ButtonBuilder | UserSelectMenuBuilder>[] = [operationMenu, userBlockListMenu, userBlockReleaseListMenu]; // 初期コンポーネント

    if (permissionOverwrites && permissionOverwrites.deny.has(PermissionsBitField.Flags.Connect)) { // VCに接続できる権限がない場合の処理
        settingButton = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(confirmationButton, unLockSettingButton, reloadButton);
    } else if (permissionOverwrites && permissionOverwrites.allow.has(PermissionsBitField.Flags.Connect)) { // VCに接続できる権限がある場合の処理
        settingButton = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(confirmationButton, lockSettingButton, reloadButton);
    } else { // VCを公開してない場合の処理
        settingButton = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(publicButton, reloadButton);
    }
    settingComponent.push(settingButton)
    return settingComponent;
}
/**
 * ブロックしているユーザーの一覧を更新する
 * @param interaction ユーザーセレクトメニュー/ボタン
 * @returns ブロックしているユーザーオブジェクト
 */
export async function blockSettingUpdate(interaction: UserSelectMenuInteraction | ButtonInteraction): Promise<{ name: string; value: string; }> {
    const blockUserListValue = await showBlockList(interaction, interaction.user.id);
    const blockUserListObject = {
        name: "ブロックしているユーザー",
        value: blockUserListValue
    };
    return blockUserListObject;
}
/**
 * チャンネルの権限設定を更新する
 * @param channel チャンネル
 * @param ownerUser ユーザー
 */
export async function editChannelPermission(channel: VoiceBasedChannel,  ownerUser: User | undefined): Promise<void> {
    const inherit = channel.parent?.permissionOverwrites.cache.values() ?? [];
    if (ownerUser) {
        const allUsers = await prisma.blockLists.findMany({
            where: {
                user_id: String(ownerUser.id),
            }
        });
        // チャンネル権限オーバーライド
        let overwrites: OverwriteResolvable[] = [
            ...inherit,
            {
                id: ownerUser,
                allow: [allowUserPermisson, allowCreateUserPermisson],
            },
            {
                id: config.authenticatedRoleId,
                allow: [allowUserPermisson]
            },
            {
                id: config.everyoneRoleId,
                deny: [denyUserPermisson]
            }
        ];
        // -----------------------------------------------------------------------------------------------------------
        // ブロックしているユーザーがいた場合、チャンネルを表示しない
        // -----------------------------------------------------------------------------------------------------------
        for (const user of allUsers) {
            // ユーザーをフェッチしないと内部でresolveに失敗してエラーが出る
            const blockUser = await client.users.fetch(user.block_user_id);
            if (blockUser) {
                overwrites.push({
                    id: blockUser,
                    deny: [denyUserPermisson]
                });
            }
        }
        // -----------------------------------------------------------------------------------------------------------
        // チャンネルの権限をセットする
        // -----------------------------------------------------------------------------------------------------------
        await channel.permissionOverwrites.set(overwrites);
    }
}
/**
 * ブロックしているユーザーを確認
 * @param interaction インタラクション
 * @param user ユーザー
 * @returns ブロックしているユーザーリストの文字列
 */
export async function showBlockList(interaction: MenuInteraction, user: string) {
    const allUsers = await prisma.blockLists.findMany({
        where: {
            user_id: String(interaction.user.id),
        }
    });
    // ブロックしているユーザーリストの文字列を作成
    const blockUserList: string = allUsers.length > 0
        ? allUsers.map((user: { block_user_id: any; }) => `<@${user.block_user_id}>`).join("\n")
        : "なし";
    return blockUserList;
}