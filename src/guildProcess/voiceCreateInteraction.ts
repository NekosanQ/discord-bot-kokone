import { 
    EmbedBuilder, 
    ActionRowBuilder, 
    Interaction, 
    ModalBuilder, 
    ModalSubmitInteraction, 
    StringSelectMenuInteraction, 
    TextInputBuilder, 
    TextInputStyle, 
    VoiceChannel, 
    PermissionsBitField,
    CacheType,
    UserSelectMenuInteraction,
    User, 
} from "discord.js";
import { MenuInteraction, 
    channelSettingUpdate, 
    channelUserLimitMessage, 
    editChannelPermission, 
    getChannelOwner, 
    transferOwnershipMenu,
    transferOwnershipEmbed
} from "../module/voiceController";
import { config } from "../utils/config";
import { PrismaClient } from "@prisma/client";
import { appendFile } from "../module/file/appedFile";
const prisma = new PrismaClient();

const editChannelEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(Number(config.botColor))
    .setTitle("ボイスチャンネルの設定を変更しました")
    .setDescription("設定を行いたい場合、下のメニューから設定を行ってください。")
const editBlockEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(Number(config.botColor))
    .setTitle("ブロックするユーザーの設定を変更しました")
    .setDescription("設定を行いたい場合、下のメニューから設定を行ってください。")

const changeNameModal: ModalBuilder = new ModalBuilder()
	.setCustomId("changeNameModal")
	.setTitle("チャンネル名の変更");
const changeNameInput: TextInputBuilder = new TextInputBuilder()
    .setMaxLength(20)
    .setMinLength(1)
    .setCustomId("changeNameInput")
    .setLabel("変更するチャンネル名を入力してください")
    .setPlaceholder("20文字までです")
    .setStyle(TextInputStyle.Short)

const changePeopleLimitedModal: ModalBuilder = new ModalBuilder()
    .setCustomId("changePeopleLimitedModal")
    .setTitle("人数制限の変更");
const changePeopleLimitedInput: TextInputBuilder = new TextInputBuilder()
    .setMaxLength(2)
    .setMinLength(1)
    .setCustomId("changePeopleLimitedInput")
    .setLabel("変更する人数を入力してください")
    .setPlaceholder("0~99人までです(0人の場合は無制限になります)")
    .setStyle(TextInputStyle.Short)

const changeBitrateModal: ModalBuilder = new ModalBuilder()
    .setCustomId("changeBitrateModal")
    .setTitle("ビットレートの変更");
      
const changeBitrateInput: TextInputBuilder = new TextInputBuilder()
    .setMaxLength(3)
    .setMinLength(1)
    .setCustomId("changeBitrateInput")
    .setLabel("変更するビットレート数を入力してください")
    .setPlaceholder("8~384Kbpsまでです(64kbps以下は非推奨です)")
    .setStyle(TextInputStyle.Short)

const changeNameRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents(changeNameInput);
changeNameModal.addComponents(changeNameRow);

const changePeopleLimitedRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents(changePeopleLimitedInput);
changePeopleLimitedModal.addComponents(changePeopleLimitedRow);

const changeBitrateRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents(changeBitrateInput);
changeBitrateModal.addComponents(changeBitrateRow);
// -----------------------------------------------------------------------------------------------------------
// ボイスチャンネル作成のインタラクション処理
// -----------------------------------------------------------------------------------------------------------
/**
 * @param interaction インタラクション
 */
module.exports = {
	async execute(interaction: Interaction): Promise<void> {
        const date = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
        const userName: string = interaction.user.displayName;
        const userId: string = String(interaction.user.id);
        try {
            if (!interaction.isButton() && !interaction.isStringSelectMenu() && !interaction.isModalSubmit() && !interaction.isUserSelectMenu()) return;
            if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageChannels)) {
                await interaction.reply({
                    content: "あなたにはチャンネルの設定をする権限がありません",
                    ephemeral: true
                });
                return;
            };
            const channel = interaction.channel as VoiceChannel;
            switch (interaction.customId) {
                // -----------------------------------------------------------------------------------------------------------
                // チャンネルの公開
                // -----------------------------------------------------------------------------------------------------------
                case "publicButton":
                case "confirmationButton": {
                    await require("../guildProcess/voicePublic").execute(interaction);
                    break;
                };
                // -----------------------------------------------------------------------------------------------------------
                // チャンネルの設定
                // -----------------------------------------------------------------------------------------------------------
                case "operationMenu": {
                    if (!interaction.isStringSelectMenu()) return;
                    const operationPage = interaction.values[0].split("_")[0];
                    switch (operationPage) {
                        case "name": { // 名前
                            await interaction.showModal(changeNameModal);
                            break;
                        };
                        case "peopleLimited": { // 人数制限
                            await interaction.showModal(changePeopleLimitedModal);
                            break;
                        };
                        case "bitrate": { // ビットレート
                            await interaction.showModal(changeBitrateModal);
                            break;
                        };
                        case "owner": {
                            // VCのオーナーの変更
                            await interaction.reply({
                                embeds: [transferOwnershipEmbed],
                                components: [transferOwnershipMenu],
                                ephemeral: true
                            });
                            break;
                        }
                    };
                    break;
                }
                // -----------------------------------------------------------------------------------------------------------
                // チャンネル名の変更
                // -----------------------------------------------------------------------------------------------------------
                case "changeNameModal": {
                    if (!interaction.isModalSubmit()) return;
                    if (!channel) return;
                    await interaction.deferReply({ 
                        ephemeral: true 
                    });
                    const channelName = (interaction as ModalSubmitInteraction).fields.getTextInputValue("changeNameInput");
                    appendFile("logs/vc_create.log", `[${date}] チャンネル名を変更しました: ${channelName} <実行ユーザー/ID> ${userName}/${userId}\n`);
                    await channel.setName(channelName);
                    await interaction.editReply({
                        content: `チャンネルの名前を${channelName}に変更しました`
                    });
                    break;
                };
                // -----------------------------------------------------------------------------------------------------------
                // 人数制限の変更
                // -----------------------------------------------------------------------------------------------------------
                case "changePeopleLimitedModal": {
                    if (!interaction.isModalSubmit()) return;
                    await interaction.deferReply({ 
                        ephemeral: true 
                    });
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
                        await (channel ).setUserLimit(channelUserLimit);
                        channelUserLimit = channelUserLimitMessage(channelUserLimit)
                        await interaction.editReply({
                            content: `チャンネルの人数制限を${channelUserLimit}に変更しました`
                        });
                    };
                    break;
                };
                // -----------------------------------------------------------------------------------------------------------
                // ビットレートの変更
                // -----------------------------------------------------------------------------------------------------------
                case "changeBitrateModal": {
                    if (!interaction.isModalSubmit()) return;
                    await interaction.deferReply({ 
                        ephemeral: true 
                    });
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
                        await (channel ).setBitrate(channelBitrate * 1000);
                        await interaction.editReply({
                            content: `チャンネルのビットレートを${channelBitrate}kbpsに変更しました`,
                        });
                    };
                    break;
                };
                // -----------------------------------------------------------------------------------------------------------
                // VCの譲渡
                // -----------------------------------------------------------------------------------------------------------
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
                    };
                    // 譲渡先がBotでないか確認
                    if (newOwner.user.bot) {
                        await interaction.reply({
                            content: "Botをオーナーにすることはできません",
                            ephemeral: true,
                        });
                        return;
                    };
                    if (!channel) return;

                    // 譲渡先が自分自身の場合かつ、オーナーが既に自分の場合
                    if (newOwner.id === interaction.user.id && newOwner === getChannelOwner(channel)) {
                        await interaction.reply({
                            content: "既にあなたがオーナーです",
                            ephemeral: true,
                        });
                        return;
                    };

                    // 譲渡先のユーザーがVCに入っているか確認
                    if (newOwner.voice.channelId !== channel.id) {
                        await interaction.reply({
                            content: "譲渡先のユーザーが同じVCに入っていません",
                            ephemeral: true,
                        });
                        return;
                    };

                    await interaction.deferReply({ ephemeral: true });

                    // チャンネルのオーナーを変更
                    await editChannelPermission(channel, newOwner.user);

                    // リプライを送信
                    await interaction.editReply({
                        content: `<@${newOwner.id}> にVCのオーナーを譲渡しました`,
                    });

                    return;
                };
                // -----------------------------------------------------------------------------------------------------------
                // ユーザーのブロック
                // -----------------------------------------------------------------------------------------------------------
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
                        };
                    };
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

                    await interaction.editReply({
                        content: replyMessage
                    });
                    break;
                };
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
                                    },
                                });
                            };
                        };
                    };
                    // リプライを送信
                    await interaction.editReply({
                        content: "選択したユーザーのブロック解除が完了しました",
                    });
                    break;
                };
            };
            // -----------------------------------------------------------------------------------------------------------
            // チャンネルの設定を更新するための処理
            // -----------------------------------------------------------------------------------------------------------
            await interaction.message?.edit({
                embeds: [
                    editChannelEmbed.setFields(await channelSettingUpdate(interaction))
                ]
            });
            // -----------------------------------------------------------------------------------------------------------
            // チャンネルの設定メッセージを更新する処理
            // (公開されていた場合、ブロックしているユーザー一覧は表示しない)
            // (公開されていない場合、必ずコンポーネントの数は4になる)
            // -----------------------------------------------------------------------------------------------------------
            /**
             * ブロックするユーザーの特権チェックを行う。
             * @param interaction インタラクション
             * @param blockUserId ブロックするユーザーのID
             * @returns 特権があればtrue、なければfalse
             */
            async function validatePrivilegedUser(
                interaction: MenuInteraction,
                blockUserId: string,
            ): Promise<boolean> {
                // 自身のIDを取得
                const userId: string = String(interaction.user.id);
                // メンバーを取得
                const member = await interaction.guild?.members.fetch(blockUserId);
                // ブロックするユーザーが自分自身か、ブロックするユーザーがVC移動権限を持っているか確認
                return (
                    blockUserId === userId ||
                    member?.permissions.has(PermissionsBitField.Flags.MoveMembers) === true
                );
            };
        } catch(error) {
            console.log(error);
        };
    }
};