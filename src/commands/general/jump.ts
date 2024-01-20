import { CommandInteraction, EmbedBuilder, SlashCommandBuilder, Message, TextChannel } from "discord.js";
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
            if (interaction.channel instanceof TextChannel) {
                await interaction.reply({
                    content: "テキストチャンネルでは実行できません",
                    ephemeral: true
                });
            } else {
                for (let i = 0; config.defaultVoiceChannelList.length > i; i++) {
                    if (interaction.channel?.id == config.defaultVoiceChannelList[i]) {
                        interaction.reply({
                            content: "作成したVC以外では実行できません",
                            ephemeral: true
                        });
                    };
                };
                const messages = await interaction.channel?.messages.fetch({ limit: 1 });
                if (!messages) return;
                const firstMessage = messages.first();
                if (!firstMessage) return;
                await interaction.reply({
                    content: `https://discord.com/channels/${interaction.guild?.id}/${interaction.channel?.id}/${firstMessage.id}`
                });
            };
        } catch(error) {
            console.log(error);
        };
	}
};