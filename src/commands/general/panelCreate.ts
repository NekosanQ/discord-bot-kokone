import { 
    CommandInteraction, 
    EmbedBuilder, 
    SlashCommandBuilder, 
    VoiceChannel, 
    GuildMember, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    PermissionsBitField
} from "discord.js";
import { config } from "../../utils/config"
/**
 * 
 */
const commandSettingChannelEmbed: EmbedBuilder = new EmbedBuilder()
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
/**
 * コマンドで作成したVCの設定を行う処理
 */
export = {
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
                    // コマンドを実行したユーザーのボイスチャンネルの権限を取得
                    const permissionOverwrites = interaction.member.voice.channel?.permissionOverwrites.cache.get(interaction.user.id);
                    
                    // チャンネルの権限がない場合、エラーメッセージを返す
                    if (!permissionOverwrites || !permissionOverwrites.allow.has(PermissionsBitField.Flags.ManageChannels)) {
                        await interaction.reply({
                            content: "あなたにはチャンネルの設定をする権限がありません",
                            ephemeral: true
                        });
                        return;
                    }
                    await interaction.reply({
                        embeds: [commandSettingChannelEmbed],
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