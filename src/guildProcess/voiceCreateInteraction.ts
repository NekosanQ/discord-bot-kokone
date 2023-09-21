import { EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, Interaction, ModalBuilder, ModalSubmitInteraction, StringSelectMenuInteraction, TextInputBuilder, TextInputStyle, VoiceChannel } from 'discord.js';
import { botcolor } from "../config.json";

const editChannelEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(Number(botcolor))
    .setTitle("ボイスチャンネルの設定を変更しました")
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

const changeBitRateModal: ModalBuilder = new ModalBuilder()
    .setCustomId("changeBitRateModal")
    .setTitle("ビットレートの変更");
const changeBitRateInput: TextInputBuilder = new TextInputBuilder()
    .setMaxLength(3)
    .setMinLength(1)
    .setCustomId("changeBitRateInput")
    .setLabel("変更するビットレート数を入力してください")
    .setPlaceholder("8~384Kbpsまでです(64kbps以下は非推奨です)")
    .setStyle(TextInputStyle.Short)

const changeNameRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents(changeNameInput);
changeNameModal.addComponents(changeNameRow);

const changePeopleLimitedRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents(changePeopleLimitedInput);
changePeopleLimitedModal.addComponents(changePeopleLimitedRow);

const changeBitRateRow: ActionRowBuilder<TextInputBuilder> = new ActionRowBuilder<TextInputBuilder>().addComponents(changeBitRateInput);
changeBitRateModal.addComponents(changeBitRateRow);

// -----------------------------------------------------------------------------------------------------------
// ボイスチャンネル作成のインタラクション処理
// -----------------------------------------------------------------------------------------------------------
module.exports = {
	async execute(interaction: Interaction): Promise<void> {
        if (interaction.isButton()) {
            await require("../guildProcess/voicePublic").execute(interaction);
        };
        if (!interaction.isStringSelectMenu()&&!interaction.isModalSubmit()) return;
        // -----------------------------------------------------------------------------------------------------------
        // チャンネルの設定
        // -----------------------------------------------------------------------------------------------------------
        if (interaction.customId === "operationMenu") {
            const operationPage = (interaction as StringSelectMenuInteraction).values[0].split("_")[0];
            switch (operationPage) {
                case "name": // 名前
                    await (interaction as StringSelectMenuInteraction).showModal(changeNameModal);
                    break;
                case "peopleLimited": // 人数制限
                    await (interaction as StringSelectMenuInteraction).showModal(changePeopleLimitedModal);
                    break;
                case "bitrate": // ビットレート
                    await (interaction as StringSelectMenuInteraction).showModal(changeBitRateModal);
                    break;
            };
        };
        
        const channel = interaction.channel;
        let channelName: string = "";
        let channelUserLimit: number | string = 0;
        let channelBitRate: number = 64;
        
        if (channel && channel.type === 2) { // チャンネルがボイスチャンネルかどうか確認
            switch (interaction.customId) {
                // -----------------------------------------------------------------------------------------------------------
                // チャンネル名の変更
                // -----------------------------------------------------------------------------------------------------------
                case "changeNameModal":
                    channelName = (interaction as ModalSubmitInteraction).fields.getTextInputValue("changeNameInput");
                    await channel.setName(channelName);
                    await interaction.reply({
                        content: `チャンネルの名前を${channelName}に変更しました`,
                        ephemeral: true
                    })
                    break;
                // -----------------------------------------------------------------------------------------------------------
                // 人数制限の変更
                // -----------------------------------------------------------------------------------------------------------
                case "changePeopleLimitedModal":
                    channelUserLimit = Number((interaction as ModalSubmitInteraction).fields.getTextInputValue("changePeopleLimitedInput"));
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
                        await channel.setUserLimit(channelUserLimit);
                        await interaction.reply({
                            content: `チャンネルの人数制限を${channelUserLimit}人に変更しました`,
                            ephemeral: true
                        });
                    };
                    break;
                // -----------------------------------------------------------------------------------------------------------
                // ビットレートの変更
                // -----------------------------------------------------------------------------------------------------------
                case "changeBitRateModal":
                    channelBitRate = Number((interaction as ModalSubmitInteraction).fields.getTextInputValue("changeBitRateInput"));
                    if (Number.isNaN(channelBitRate)) {
                        await interaction.reply({
                            content: `数字を入れてください`,
                            ephemeral: true
                        });
                    } else if (channelBitRate < 8 || channelBitRate > 384) {
                        await interaction.reply({
                            content: `変更できるビットレートの値は8~384kbpsまでです`,
                            ephemeral: true
                        });
                    } else {
                        await channel.setBitrate(channelBitRate * 1000);
                        await interaction.reply({
                            content: `チャンネルのビットレートを${channelBitRate}kbpsに変更しました`,
                            ephemeral: true
                        });
                    };
                    break;
            };
            channelName = (interaction.channel as VoiceChannel).name;
            channelUserLimit = (interaction.channel as VoiceChannel)?.userLimit;
            if (channelUserLimit === 0) {
                channelUserLimit = "無制限";
            } else {
                channelUserLimit = `${channelUserLimit} 人`
            };
            channelBitRate = Number((interaction.channel as VoiceChannel)?.bitrate) / 1000;
            await interaction.message?.edit({
                embeds: [
                    editChannelEmbed.setFields(
                        { name: "現在の設定", value: `チャンネル名: ${channelName}\nユーザー人数制限: ${channelUserLimit}\nビットレート: ${channelBitRate}kbps` },
                        { name: "ブロックしているユーザー", value: "・<@635905351526514699>\n・<@655572647777796097>" }
                    )
                ]
            });
        };
    }
};