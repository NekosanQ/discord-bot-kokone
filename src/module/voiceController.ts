import { PrismaClient } from '@prisma/client';
import {
    EmbedBuilder,
    ActionRowBuilder,
    ModalSubmitInteraction,
    StringSelectMenuInteraction,
    TextInputBuilder,
    TextInputStyle,
    UserSelectMenuInteraction,
    OverwriteResolvable,
    VoiceBasedChannel,
    User,
    APIEmbedField,
    ButtonInteraction,
    UserSelectMenuBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder,
    PermissionsBitField,
    ButtonStyle,
    OverwriteType,
    GuildMember,
    Channel,
    ModalBuilder,
    VoiceChannel
} from 'discord.js';

import { config } from '../utils/config.js';

import { client } from '../index.js';

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
                value: "name_change"
            },
            {
                label: "人数制限",
                description: "人数制限の人数を変更できます(0~99)",
                value: "peopleLimited_change"
            },
            {
                label: "ビットレート",
                description: "ビットレート(音質)を変更できます(8~384)",
                value: "bitrate_change"
            }
        )
);
/**
 * チャンネルを公開するためのボタン
 */
export const publicButton: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
        new ButtonBuilder()
            .setCustomId("publicButton")
            .setLabel("ボイスチャンネルを公開する")
            .setStyle(ButtonStyle.Success)
    )
    const changeNameInput: TextInputBuilder = new TextInputBuilder()
    .setMaxLength(20)
    .setMinLength(1)
    .setCustomId("changeNameInput")
    .setLabel("変更するチャンネル名を入力してください")
    .setPlaceholder("20文字までです")
    .setStyle(TextInputStyle.Short)

const changePeopleLimitedModal: ModalBuilder = new ModalBuilder()
    .setCustomId("changePeopleLimitedModal")
    .setTitle("人数制限の変更")
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
    PermissionsBitField.Flags.UseExternalEmojis,      // 外部の絵文字の使用
    PermissionsBitField.Flags.UseExternalStickers,    // 外部のスタンプの使用
    PermissionsBitField.Flags.UseExternalSounds,      // 外部のサウンドボードの使用
    PermissionsBitField.Flags.UseSoundboard,          // サウンドボードの使用
    PermissionsBitField.Flags.UseApplicationCommands, // アプリケーションコマンドの使用
    PermissionsBitField.Flags.Connect,                // 接続
    PermissionsBitField.Flags.Speak,                  // 発言
    PermissionsBitField.Flags.Stream,                 // 配信
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
            permission.type === OverwriteType.Member && permission.allow.has(PermissionsBitField.Flags.ManageChannels); // 優先スピーカー権限を持っているユーザーを取得
        }
    );
    if (!ownerUser) return undefined;
    return channel.guild.members.resolve(ownerUser.id) ?? undefined;
};
/**
 * 
 * @param channelUserLimit ユーザー人数制限
 * @returns 
 */
export function channelUserLimitMessage(channelUserLimit: number | string) {
    channelUserLimit = channelUserLimit === 0 ? "無制限" : `${channelUserLimit}人`;
    return channelUserLimit
};
/**
* @returns 埋め込みメッセージの設定フィールドを返す
*/
export async function channelSettingUpdate(interaction: MenuInteraction) {
    const channelName = (interaction.channel as VoiceChannel).name;
    const channelBitrate = Number((interaction.channel as VoiceChannel)?.bitrate) / 1000;
    let channelUserLimit: string | number = (interaction.channel as VoiceChannel)?.userLimit;
    channelUserLimit = channelUserLimitMessage(channelUserLimit);
    const embedFielsArray = [];
    const voiceCreateComponents = interaction.message?.components.length; // 設定メッセージのコンポーネントの数を取得
    const settingChannelObject = {
        name: "現在の設定", 
        value: `チャンネル名: ${channelName}\nユーザー人数制限: ${channelUserLimit}\nビットレート: ${channelBitrate}kbps` 
    };
    const blockUserListValue = await showBlockList(interaction, interaction.user.id);
    const blockUserListObject = {
        name: "ブロックしているユーザー",
        value: blockUserListValue
    }
    voiceCreateComponents === 4 ? embedFielsArray.push(settingChannelObject, blockUserListObject) : embedFielsArray.push(settingChannelObject);
    
    return embedFielsArray;
};
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
            },
        });
        // チャンネル権限オーバーライド
        const overwrites: OverwriteResolvable[] = [
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
            };
        };
        // -----------------------------------------------------------------------------------------------------------
        // チャンネルの権限をセットする
        // -----------------------------------------------------------------------------------------------------------
        await channel.permissionOverwrites.set(overwrites);

        // -----------------------------------------------------------------------------------------------------------
        // ブロックされたユーザーが既にVCにいる場合、VCから退出させる
        // -----------------------------------------------------------------------------------------------------------
        const blockedConnectedMembers = channel.members.filter((member) =>
            allUsers.find((user: { block_user_id: string; }) => member.id === user.block_user_id),
        );
        for (const [_, member] of blockedConnectedMembers) {
            await member.voice.disconnect();
        };
    };
};
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
        },
    });
    // ブロックしているユーザーリストの文字列を作成
    const blockUserList: string = allUsers.length > 0
        ? allUsers.map((user: { block_user_id: any; }) => `<@${user.block_user_id}>`).join('\n')
        : 'なし';
    return blockUserList;
};

/**
 * ボタンが押されたときの処理
 * @param interaction インタラクション
 * @param operationPage ページ
 */
export async function onOperationMenu(interaction: StringSelectMenuInteraction, operationPage: string): Promise<void> {
    switch (operationPage) {
        case 'peopleLimited_change': {
            // 人数制限
            await interaction.showModal(changePeopleLimitedModal);
            break;
        };
    };
};