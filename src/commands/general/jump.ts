import { CommandInteraction, EmbedBuilder, SlashCommandBuilder, Message, TextChannel, VoiceChannel } from "discord.js";
import { config } from "../../utils/config"

// -----------------------------------------------------------------------------------------------------------
// 作成したVCの設定画面のメッセージリンクを送信する処理
// -----------------------------------------------------------------------------------------------------------
module.exports = {
    data: new SlashCommandBuilder() // スラッシュコマンド
		.setName("jump")
		.setDescription("作成したVCの設定画面のメッセージリンクを送信します"),
    async execute(interaction: CommandInteraction) {
        try {
            if (interaction.channel instanceof TextChannel) { // テキストチャンネルでは処理をしない
                await interaction.reply({
                    content: "テキストチャンネルでは実行できません",
                    ephemeral: true
                });
            } else { 
                const channel = interaction.channel as VoiceChannel;
                for (let i = 0; config.defaultVoiceChannelList.length > i; i++) { // 標準であるボイスチャンネルで実行していたら処理を終了する
                    if (channel.id == config.defaultVoiceChannelList[i]) {
                        interaction.reply({
                            content: "作成したVC以外では実行できません",
                            ephemeral: true
                        });
                        return;
                    };
                };
                // -----------------------------------------------------------------------------------------------------------
                // チャンネルの最初のメッセージを取得する処理
                // -----------------------------------------------------------------------------------------------------------
                await interaction.deferReply({ 
                    ephemeral: false
                });
                /**
                 * @param channel ボイスチャンネル
                 * @returns 一番最初のメッセージ
                 */
                async function fetchFirstMessage(channel: VoiceChannel): Promise<Message> {
                    let lastID;
                    let messages;

                    while (true) {
                        messages = await channel.messages.fetch({ 
                            limit: 100,
                            before: lastID 
                        });
                        if (messages.size === 0) break;
                        lastID = messages.last()?.id;
                    };

                    if (lastID) {
                        return await channel.messages.fetch(lastID);
                    } else {
                        throw new Error('No messages found in channel');
                    };
                };

                // 最初のメッセージを取得
                const firstMessage = await fetchFirstMessage(channel);

                if(!firstMessage) return;
                // メッセージのリンクを返信
                await interaction.editReply({
                    content: `https://discord.com/channels/${interaction.guild?.id}/${channel?.id}/${firstMessage.id}`
                });
            };
        } catch(error) {
            console.log(error);
        };
	}
};