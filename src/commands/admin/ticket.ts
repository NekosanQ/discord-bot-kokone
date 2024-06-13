import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Channel, EmbedBuilder, Interaction, PermissionsBitField, SlashCommandBuilder, StringSelectMenuInteraction, TextChannel, WidgetChannel } from "discord.js";
import { config } from "../../utils/config"
import { appendFile } from "../../module/file/appedFile";

const allowPermisson: bigint[] = [
    PermissionsBitField.Flags.ViewChannel,
    PermissionsBitField.Flags.SendMessages,
    PermissionsBitField.Flags.EmbedLinks,
    PermissionsBitField.Flags.ReadMessageHistory,
    PermissionsBitField.Flags.UseApplicationCommands,
    PermissionsBitField.Flags.AttachFiles,
    PermissionsBitField.Flags.AddReactions
];

const ticketEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(Number(config.botColor))
    .setTitle("チケット作成")
    .setDescription("お問い合わせフォーラムで投稿出来ない問題などを、運営と直接話したい場合に使用してください。\n__運営などへ連絡する際、DMやメンションなどはせず、必ずチケットを作成して連絡を取ってください。__")
    .setFields({ name: "注意", value: "・チケットを作成して一時間経ってもメッセージを送らない場合は自動的にチャンネルが削除されます\n・チケットは複数作成出来ません\n・世間話などの目的で使用するのは禁止です"})
const ticketButton: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
        .setCustomId("ticketbutton")
        .setLabel("📩お問い合わせを開始する")
        .setStyle(ButtonStyle.Success)
)
const channelCreateEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(Number(config.botColor))
    .setTitle("お問い合わせありがとうございます。")
    .setDescription("こちらのチャンネルのチャットにて、お問い合わせ内容の記載をお願いします。\n間違えた場合、下のボタンからチャンネルを削除してください")
const deleteButton: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
        .setCustomId("deletebutton_ticket")
        .setLabel("チャンネルを削除する")
        .setStyle(ButtonStyle.Danger)
)
/**
 * お問い合わせの処理
 */
export = {
    data: new SlashCommandBuilder()
        .setName("ticket")
        .setDescription("お問い合わせを作成します"),
    async execute(interaction: Interaction<"cached">): Promise<void> {
        const date: string = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
        if (interaction.isChatInputCommand()&&interaction.member?.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.reply({
                embeds: [ticketEmbed],
                components: [ticketButton]
            });
            return;
        }
        
        if (!interaction.isButton()) return;
        /**
         * お問い合わせを作成した時の処理
         */
        if (interaction.customId === "ticketbutton") {
            const ticketChannelName = `お問い合わせ-${interaction.user.id}`;
            const channel: Channel | undefined = interaction.client.channels.cache.find((channel: Channel) => (channel as WidgetChannel).name === ticketChannelName);
            const operationRoleId = "970250087089438740";

            if (channel) {
                interaction.reply({
                    content: "既にあなたはお問い合わせを作成しています",
                    ephemeral: true
                });
            } else { // お問い合わせ時の処理
                appendFile("logs/ticket.log", `[${date}] お問い合わせを作成しました <実行ユーザー表示名/名前/ID> ${interaction.user.displayName}/${interaction.user.username}/${interaction.user.id}\n`);
                await interaction.guild.channels.create({
                    name: ticketChannelName,
                    parent: "1153219622036848660",
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel]
                        },
                        {
                            id: operationRoleId,
                            allow: [allowPermisson]
                        },
                        {
                            id: interaction.user.id,
                            allow: [allowPermisson]
                        }
                    ]
                });
                const channel: Channel | undefined = interaction.client.channels.cache.find((channel: Channel) => (channel as WidgetChannel).name === ticketChannelName);
                if (channel) {
                    (channel as TextChannel).send({
                        content: `<@${interaction.user.id}>`,
                        embeds: [channelCreateEmbed],
                        components: [deleteButton]
                    });
                    await interaction.reply({
                        content: `<#${channel.id}>を作成しました。`,
                        ephemeral: true
                    });
                    setTimeout(() => {
                        if (channel.type === 0) { // テキストチャンネルかどうかを判別
                            // 最新のメッセージを取得する
                            channel.messages.fetch({ limit: 1 }).then(messages => {
                                const lastMessageUser = messages.first()?.author.bot; // BOTかどうか
                                if (lastMessageUser) { // BOTだったら、チャンネルを削除
                                    appendFile("logs/ticket.log", `[${date}] １時間メッセージが送信されていないので、チャンネルを削除しました <チャンネル名/ID>: ${channel.name}/${channel.id}\n`);
                                    channel.delete();
                                };
                            }).catch(error => { // チャンネルを削除されていた場合、処理をしない
                                appendFile("logs/error.log", `[${date}] ${error}`);
                            })
                        }
                    }, 1000 * 60 * 60);
                } else {
                    console.log("作成したお問い合わせチャンネルにメッセージを送信できませんでした")
                }
            }
        }
        /**
         * お問い合わせを削除する処理
         */
        if (interaction.customId === "deletebutton_ticket") {
            const channelId: string | undefined = interaction.channel?.id;
            if(channelId) {
                try {
                    appendFile("logs/ticket.log", `[${date}] お問い合わせを削除しました <実行ユーザー/ID>: <実行ユーザー表示名/名前/ID>: ${interaction.user.displayName}/${interaction.user.username}/${interaction.user.id}\n`);
                    interaction.client.channels.cache.get(channelId)?.delete();
                } catch (error) {
                    appendFile("logs/error.log", `[${date}] ${error}`);
                }
            } else {
                console.log("チャンネルを削除しようとしましたが、見つかりませんでした")
            }
        }
    }
};