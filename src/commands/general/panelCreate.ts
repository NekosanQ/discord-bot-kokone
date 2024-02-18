import { CommandInteraction, EmbedBuilder, SlashCommandBuilder, Message, TextChannel, VoiceChannel, GuildMember, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { config } from "../../utils/config"
const mmobileChannelEmbed: EmbedBuilder = new EmbedBuilder()
    .setColor(Number(config.botColor))
    .setTitle("ボイスチャンネルの設定")
    .setDescription("設定を行いたい場合、ボタンを押して設定を開始してください")
const startButton: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
        new ButtonBuilder()
            .setCustomId("startButton")
            .setLabel("設定を開始する")
            .setStyle(ButtonStyle.Success)
    )
// -----------------------------------------------------------------------------------------------------------
// 作成したVCの設定画面を表示する
// -----------------------------------------------------------------------------------------------------------
module.exports = {
    data: new SlashCommandBuilder() // スラッシュコマンド
		.setName("panel_create")
		.setDescription("作成したVCの設定画面を表示させます"),
    async execute(interaction: CommandInteraction) {
        if (interaction.isChatInputCommand()) {
            try {
                if (interaction.channel instanceof VoiceChannel) {
                    await interaction.reply({
                        content: "ボイスチャンネルでは実行出来ません",
                        ephemeral: true
                    });
                } else if (interaction.member instanceof GuildMember){
                    const voiceChannel = interaction.member.voice.channel;
                    if (!voiceChannel) return interaction.reply({
                        content: "VCに入っていないと実行出来ません",
                        ephemeral: true
                    })
                    for (let i = 0; config.defaultVoiceChannelList.length > i; i++) {
                        if (voiceChannel?.id == config.defaultVoiceChannelList[i]) {
                            interaction.reply({
                                content: "作成したVC以外では実行できません",
                                ephemeral: true
                            });
                            return;
                        }
                    };
                    await interaction.reply({
                        embeds: [mmobileChannelEmbed],
                        components: [startButton]
                    });
                }
            } catch(error) {
                console.log(error);
            }
        } else {
            await require("../../guildProcess/voiceCreateInteraction").execute(interaction);
        }
	} 
};