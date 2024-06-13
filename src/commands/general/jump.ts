import { CommandInteraction, EmbedBuilder, SlashCommandBuilder, Message, TextChannel, VoiceChannel } from "discord.js";
import { config } from "../../utils/config";

/**
 * 作成したVCの設定画面のメッセージリンクを送信する処理
 */
export = {
    data: new SlashCommandBuilder() // スラッシュコマンド
		.setName("jump")
		.setDescription("作成したVCの設定画面のメッセージリンクを送信します"),
    async execute(interaction: CommandInteraction) {
        try {
             // テキストチャンネルでは処理をしない
            if (interaction.channel instanceof TextChannel) {
                await interaction.reply({
                    content: "テキストチャンネルでは実行できません",
                    ephemeral: true
                });
            } else { 
                const channel = interaction.channel as VoiceChannel;
                // 標準であるボイスチャンネルで実行していたら処理を終了する
                for (let i = 0; config.defaultVoiceChannelList.length > i; i++) {
                    if (channel.id == config.defaultVoiceChannelList[i]) {
                        interaction.reply({
                            content: "作成したVC以外では実行できません",
                            ephemeral: true
                        });
                        return;
                    };
                };
                /**
                 * チャンネルの最初のメッセージを取得する処理
                 */
                await interaction.deferReply({ 
                    ephemeral: false
                });
                channel.messages.fetch({ after: '0', limit: 1 }) // メッセージが送信されたチャンネルで一番最初に送信されたメッセージを取得する
                    .then(messages => 
                        messages.first()
                    ) // コレクションからメッセージが送信されたチャンネルで一番最初に送信されたメッセージを取り出す
                    .then(message => // 一番最初に送信されたメッセージのURLを送信する
                        interaction.editReply({
                            content: message?.url
                        })
                    );
            }
        } catch(error) {
            console.log(error);
        }
	}
};