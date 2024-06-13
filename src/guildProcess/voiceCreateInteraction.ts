import { 
    EmbedBuilder, 
    ActionRowBuilder, 
    Interaction, 
    ModalBuilder, 
    ModalSubmitInteraction, 
    TextInputBuilder, 
    TextInputStyle, 
    PermissionsBitField,
    GuildMember
} from "discord.js";
import { MenuInteraction, 
    channelSettingUpdate, 
    channelUserLimitMessage, 
    editChannelPermission, 
    getChannelOwner, 
    transferOwnershipMenu,
    transferOwnershipEmbed,
    settingComponentUpdate
} from "../module/voiceController";
import { config } from "../utils/config";
import { PrismaClient } from "@prisma/client";
import { appendFile } from "../module/file/appedFile";
/**
 * データベースのインスタンス
 */
const prisma = new PrismaClient();
/**
 * チャンネルを編集した時に表示する埋め込みメッセージ
 */
const editChannelEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(Number(config.botColor))
    .setTitle("ボイスチャンネルの設定を変更しました")
    .setDescription("設定を行いたい場合、下のメニューから設定を行ってください。");
/**
 * チャンネル名を変更する際に使用するモーダル
 */
const changeNameModal: ModalBuilder = new ModalBuilder()
	.setCustomId("changeNameModal")
	.setTitle("チャンネル名の変更");
/**
 * 変更したいチャンネル名を入力する画面
 */
const changeNameInput: TextInputBuilder = new TextInputBuilder()
    .setMaxLength(20)
    .setMinLength(1)
    .setCustomId("changeNameInput")
    .setLabel("変更するチャンネル名を入力してください")
    .setPlaceholder("20文字までです")
    .setStyle(TextInputStyle.Short);
/**
 * 人数制限を変更する際に使用するモーダル
 */
const changePeopleLimitedModal: ModalBuilder = new ModalBuilder()
    .setCustomId("changePeopleLimitedModal")
    .setTitle("人数制限の変更");
/**
 * 変更する人数制限を入力する画面
 */
const changePeopleLimitedInput: TextInputBuilder = new TextInputBuilder()
    .setMaxLength(2)
    .setMinLength(1)
    .setCustomId("changePeopleLimitedInput")
    .setLabel("変更する人数を入力してください")
    .setPlaceholder("0~99人までです(0人の場合は無制限になります)")
    .setStyle(TextInputStyle.Short)
/**
 * ビットレートを変更する際に使用するモーダル
 */
const changeBitrateModal: ModalBuilder = new ModalBuilder()
    .setCustomId("changeBitrateModal")
    .setTitle("ビットレートの変更");
/**
 * 変更するビットレートを入力する画面
 */
const changeBitrateInput: TextInputBuilder = new TextInputBuilder()
    .setMaxLength(3)
    .setMinLength(1)
    .setCustomId("changeBitrateInput")
    .setLabel("変更するビットレート数を入力してください")
    .setPlaceholder("8~384Kbpsまでです(64kbps以下は非推奨です)")
    .setStyle(TextInputStyle.Short)
/**
 * チャンネル名を変更する際に使用するコンポーネント
 */
const changeNameRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents(changeNameInput);
changeNameModal.addComponents(changeNameRow);
/**
 * 人数制限を変更する際に使用するコンポーネント
 */
const changePeopleLimitedRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents(changePeopleLimitedInput);
changePeopleLimitedModal.addComponents(changePeopleLimitedRow);
/**
 * ビットレートを変更する際に使用するコンポーネント
 */
const changeBitrateRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents(changeBitrateInput);
changeBitrateModal.addComponents(changeBitrateRow);

/**
 * ボイスチャンネル作成のインタラクション処理
 * @param interaction インタラクション
 */
export = {
	async execute(interaction: Interaction): Promise<void> {
        const date = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
        const userName: string = interaction.user.displayName;
        const userId: string = String(interaction.user.id);
        try {
            if (!interaction.isButton() && !interaction.isStringSelectMenu() && !interaction.isModalSubmit() && !interaction.isUserSelectMenu()) return;
            const channel = interaction.member instanceof GuildMember ? interaction.member?.voice.channel : null;
            if (!channel) return;

            // チャンネル内のユーザー権限を取得
            const permissionOverwrites = channel.permissionOverwrites.cache.get(interaction.user.id);

            // チャンネルの権限がない場合、エラーメッセージを返す
            if (!permissionOverwrites || !permissionOverwrites.allow.has(PermissionsBitField.Flags.ManageChannels)) {
                await interaction.reply({
                    content: "あなたにはチャンネルの設定をする権限がありません",
                    ephemeral: true
                });
                return;
            }
            /**
             * チャンネルの設定
             */
            switch (interaction.customId) {
                /**
                 * チャンネルの公開/設定の開始/ブロックユーザーの確認
                 */
                case "publicButton":
                case "startButton":
                case "confirmationButton": {
                    (await import("../guildProcess/voicePublic")).execute(interaction);
                    break;
                }
                /**
                 * チャンネルのロック
                 */
                case "lockButton": {
                    await interaction.deferReply({ 
                        ephemeral: true
                    });
                    await channel.permissionOverwrites.edit(config.authenticatedRoleId, {
                        Connect: false
                    })
                    await interaction.editReply({
                        content: `チャンネルをロックしました`
                    });
                    break;
                }
                /**
                 * チャンネルのロック解除
                 */
                case "unLockButton": {
                    await interaction.deferReply({ 
                        ephemeral: true 
                    });
                    await channel.permissionOverwrites.edit(config.authenticatedRoleId, {
                        Connect: true
                    })
                    await interaction.editReply({
                        content: `チャンネルのロックを解除しました`
                    });
                    break;
                }
                /**
                 * 更新ボタン
                 */
                case "reloadButton": {
                    await interaction.reply({ 
                        content: "設定画面を更新しました",
                        ephemeral: true 
                    });
                    break;
                }
                /**
                 * チャンネルの設定
                 */
                case "operationMenu": {
                    if (!interaction.isStringSelectMenu()) return;
                    const operationPage = interaction.values[0].split("_")[0];
                    switch (operationPage) {
                        // 名前の変更
                        case "name": {
                            await interaction.showModal(changeNameModal);
                            break;
                        }
                        // 人数制限の変更
                        case "peopleLimited": {
                            await interaction.showModal(changePeopleLimitedModal);
                            break;
                        }
                        // ビットレートの変更
                        case "bitrate": {
                            await interaction.showModal(changeBitrateModal);
                            break;
                        }
                        // VCのオーナーの変更
                        case "owner": {
                            await interaction.reply({
                                embeds: [transferOwnershipEmbed],
                                components: [transferOwnershipMenu],
                                ephemeral: true
                            });
                            break;
                        }
                    }
                    break;
                }
                /**
                 * チャンネル名の変更
                 */
                case "changeNameModal": {
                    if (!interaction.isModalSubmit()) return;
                    const voiceChannel = interaction.member instanceof GuildMember ? interaction.member?.voice.channel : null;
                    if (!voiceChannel) return;
                    await interaction.deferReply({ 
                        ephemeral: true 
                    });
                    const channelName = (interaction as ModalSubmitInteraction).fields.getTextInputValue("changeNameInput");
                    appendFile("logs/vc_create.log", `[${date}] チャンネル名を変更しました: ${channelName} <実行ユーザー/ID> ${userName}/${userId}\n`);
                    await voiceChannel.setName(channelName);
                    await interaction.editReply({
                        content: `チャンネルの名前を${channelName}に変更しました`
                    });
                    break;
                }
                /**
                 * 人数制限の変更
                 */
                case "changePeopleLimitedModal": {
                    if (!interaction.isModalSubmit()) return;
                    await interaction.deferReply({ 
                        ephemeral: true 
                    });
                    const voiceChannel = interaction.member instanceof GuildMember ? interaction.member?.voice.channel : null;
                    if (!voiceChannel) return;
                    let channelUserLimit: number | string = Number((interaction as ModalSubmitInteraction).fields.getTextInputValue("changePeopleLimitedInput"));
                    appendFile("logs/vc_create.log", `[${date}] 人数制限を変更しました: ${channelUserLimit} <実行ユーザー/ID> ${userName}/${userId}\n`);
                    if (Number.isNaN(channelUserLimit)) {
                        await interaction.reply({
                            content: `数字を入れてください`,
                            ephemeral: true
                        });
                    } else if (channelUserLimit > 99) {
                        await interaction.reply({
                            content: `変更できる人数制限の値は0~99人までです`,
                            ephemeral: true
                        });
                    } else {
                        await voiceChannel.setUserLimit(channelUserLimit);
                        channelUserLimit = channelUserLimitMessage(channelUserLimit)
                        await interaction.editReply({
                            content: `チャンネルの人数制限を${channelUserLimit}に変更しました`
                        });
                    }
                    break;
                }
                /**
                 * ビットレートの変更
                 */
                case "changeBitrateModal": {
                    if (!interaction.isModalSubmit()) return;
                    await interaction.deferReply({ 
                        ephemeral: true 
                    });
                    const voiceChannel = interaction.member instanceof GuildMember ? interaction.member?.voice.channel : null;
                    if (!voiceChannel) return;
                    const channelBitrate = Number((interaction as ModalSubmitInteraction).fields.getTextInputValue("changeBitrateInput"));
                    appendFile("logs/vc_create.log", `[${date}] ビットレートを変更しました: ${channelBitrate} <実行ユーザー/ID> ${userName}/${userId}\n`);
                    if (Number.isNaN(channelBitrate)) {
                        await interaction.reply({
                            content: `数字を入れてください`,
                            ephemeral: true
                        });
                    } else if (channelBitrate < 8 || channelBitrate > 384) {
                        await interaction.reply({
                            content: `変更できるビットレートの値は8~384kbpsまでです`,
                            ephemeral: true
                        });
                    } else {
                        await voiceChannel.setBitrate(channelBitrate * 1000);
                        await interaction.editReply({
                            content: `チャンネルのビットレートを${channelBitrate}kbpsに変更しました`,
                        });
                    }
                    break;
                }
                /**
                 * VCの譲渡
                 */
                case "transferOwnership": {
                    if (!interaction.isUserSelectMenu()) return;
                    // 譲渡先のユーザーを取得
                    const newOwnerId: string = String(interaction.values[0]);
                    const newOwner = await interaction.guild?.members.fetch(newOwnerId);
                    if (!newOwner) {
                        await interaction.reply({
                            content: "ユーザーが見つかりませんでした",
                            ephemeral: true,
                        });
                        return;
                    }
                    // 譲渡先がBotでないか確認
                    if (newOwner.user.bot) {
                        await interaction.reply({
                            content: "Botをオーナーにすることはできません",
                            ephemeral: true,
                        });
                        return;
                    }
                    if (!channel) return;

                    // 譲渡先が自分自身の場合かつ、オーナーが既に自分の場合
                    if (newOwner.id === interaction.user.id && newOwner === getChannelOwner(channel)) {
                        await interaction.reply({
                            content: "既にあなたがオーナーです",
                            ephemeral: true,
                        });
                        return;
                    }
                    // 譲渡先のユーザーがVCに入っているか確認
                    if (newOwner.voice.channelId !== channel.id) {
                        await interaction.reply({
                            content: "譲渡先のユーザーが同じVCに入っていません",
                            ephemeral: true,
                        });
                        return;
                    }
                    await interaction.deferReply({ ephemeral: true });

                    // チャンネルのオーナーを変更
                    await editChannelPermission(channel, newOwner.user);

                    // リプライを送信
                    await interaction.editReply({
                        content: `<@${newOwner.id}> にVCのオーナーを譲渡しました`,
                    });

                    break;
                }
                /**
                 * ユーザーのブロック
                 */
                case "userBlockList": {
                    if (!interaction.isUserSelectMenu()) return;
                    await interaction.deferReply({ 
                        ephemeral: true 
                    });
                    const selectedMemberNum = interaction.values.length;
                    const allUsers = await prisma.blockLists.findMany({ // ブロックしたユーザーを取得
                        where: {
                            user_id: String(interaction.user.id),
                        }
                    });
                    // ブロック処理
                    const alreadyBlockedUsers: string[] = [];
                    const privilegedUsers: string[] = [];
                    for (let i = 0; i < selectedMemberNum; i++) {
                        const blockUserId: string = String(interaction.values[i]);
                        // Prismaを使ってBlackListsテーブルにレコードを作成
                        if (allUsers.find((user: { block_user_id: string; }) => String(user.block_user_id) === blockUserId)) {
                            alreadyBlockedUsers.push(blockUserId);
                        } else if (await validatePrivilegedUser(interaction, blockUserId)) {
                            privilegedUsers.push(blockUserId);
                        } else {
                            await prisma.blockLists.create({
                                data: {
                                    user_id: String(interaction.user.id),
                                    block_user_id: String(blockUserId)
                                }
                            });
                        }
                    }
                    const blockedUserNum = selectedMemberNum - privilegedUsers.length - alreadyBlockedUsers.length; // ブロック出来るユーザーの数
                    let replyMessage = `選択した${selectedMemberNum}人${selectedMemberNum === blockedUserNum ? "" : `の内${blockedUserNum}人`}のユーザーのブロックが完了しました。\n`;
                    if (blockedUserNum == 0) {
                        replyMessage = `全員のブロックをする事が出来ませんでした`;
                    } else if (privilegedUsers.length > 0) {
                        const errorUsersString = privilegedUsers
                            .map((userId) => `<@${userId}>`)
                            .join(", ");
                         replyMessage += `${errorUsersString} はブロックできませんでした。\n`;
                    } else if (alreadyBlockedUsers.length > 0) {
                        const errorUsersString = alreadyBlockedUsers
                            .map((userId) => `<@${userId}>`)
                            .join(", ");
                        replyMessage += `${errorUsersString} は既にブロックされているためブロックできませんでした。\n`;
                    };
                    const authenticatedRoleBitfield = channel?.permissionsFor(config.authenticatedRoleId)?.bitfield.toString(); // チャンネルに設定されている認証ロールの権限を取得(文字列に変換後の値)
                    if (!(authenticatedRoleBitfield === "0")) {
                        await editChannelPermission(channel, interaction.user);
                    }
                    await interaction.editReply({
                        content: replyMessage
                    });
                    break;
                }
                case "userBlockReleaseList": {
                    if (!interaction.isUserSelectMenu()) return;
                    await interaction.deferReply({ ephemeral: true });
                    // ブロックしたユーザーを取得
                    const userId: string = String(interaction.user.id);
                    const allUsers = await prisma.blockLists.findMany({
                        where: {
                            user_id: String(interaction.user.id),
                        },
                    });
                    // ブロック解除処理
                    for (let i = 0; i < interaction.values.length; i++) {
                        const blockUserId: string = String(interaction.values[i]);
                        for (let i = 0; i < allUsers.length; i++) {
                            if (String(allUsers[i].block_user_id) === blockUserId) {
                                await prisma.blockLists.deleteMany({
                                    where: {
                                        user_id: String(userId),
                                        block_user_id: String(blockUserId),
                                    }
                                });
                            }
                        }
                    }
                    const authenticatedRoleBitfield = channel?.permissionsFor(config.authenticatedRoleId)?.bitfield.toString(); // チャンネルに設定されている認証ロールの権限を取得(文字列に変換後の値)
                    if (!(authenticatedRoleBitfield === "0")) {
                        await editChannelPermission(channel, interaction.user);
                    }
                    // リプライを送信
                    await interaction.editReply({
                        content: "選択したユーザーのブロック解除が完了しました",
                    });
                    break;
                }
            }
            // -----------------------------------------------------------------------------------------------------------
            // チャンネルの設定を更新するための処理
            // -----------------------------------------------------------------------------------------------------------
            await interaction.message?.edit({
                embeds: [
                    editChannelEmbed.setFields(await channelSettingUpdate(interaction))
                ],
                components: settingComponentUpdate(interaction)
            });
            /**
             * ブロックするユーザーの特権チェックを行う。
             * @param interaction インタラクション
             * @param blockUserId ブロックするユーザーのID
             * @returns 特権があればtrue、なければfalse
             */
            async function validatePrivilegedUser(interaction: MenuInteraction, blockUserId: string): Promise<boolean> {
                // 自身のIDを取得
                const userId: string = String(interaction.user.id);
                // メンバーを取得
                const member = await interaction.guild?.members.fetch(blockUserId);
                // ブロックするユーザーが自分自身か、ブロックするユーザーがVC移動権限を持っているか確認
                return (
                    blockUserId === userId ||
                    member?.permissions.has(PermissionsBitField.Flags.MoveMembers) === true
                );
            }
        } catch(error) {
            console.log(error);
        }
    }
};