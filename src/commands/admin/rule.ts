import { Interaction, PermissionsBitField, SlashCommandBuilder, StringSelectMenuInteraction } from "discord.js";
import { languageMenu, embeds, agreeButton } from "../../module/ruledata";
import { appendFile } from "../../module/file/appedFile";
import { config } from "../../utils/config";
import { logger } from "../../utils/log";
logger.level = "info";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rule")
        .setDescription("利用規約を作成します"),
    async execute(interaction: Interaction<"cached">): Promise<void> {
        const date: string = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
        if (interaction.isChatInputCommand()&&interaction.member?.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.reply({
                embeds: [embeds.rule[0]],
                components: [languageMenu, agreeButton]
            });
            return;
        };
        // -----------------------------------------------------------------------------------------------------------
        // 利用規約に同意/言語を選択した時の処理
        // -----------------------------------------------------------------------------------------------------------
        if (!interaction.isStringSelectMenu()&&!interaction.isButton()) return;
        if (interaction.customId === "selectlanguage") { // 言語を選択した時の処理
            const page: number = Number((interaction as StringSelectMenuInteraction).values[0].split("_")[1]);
            await interaction.reply({
                embeds: [embeds.rule[page + 1]],
                ephemeral: true,
            });
        };
        if (interaction.customId === "agreebutton") {  // 利用規約に同意した時の処理
            try {
                const role: boolean = interaction.member.roles.cache.has(config.uncertifiedRoleId);
                if (role) {
                    await interaction.deferReply({ 
                        ephemeral: true 
                    });
                    await interaction.member.roles.remove(config.uncertifiedRoleId);
                    await interaction.member.roles.add(config.authenticatedRoleId);
                    await interaction.editReply({
                        embeds: [embeds.completed]
                    });
                    logger.info(`利用規約に同意しました <実行ユーザー表示名/名前/ID>: ${interaction.user.displayName}/${interaction.user.username}/${interaction.user.id}`);
                    appendFile("logs/rule.log", `[${date}] 利用規約に同意しました <実行ユーザー/ID>: <実行ユーザー表示名/名前/ID>: ${interaction.user.displayName}/${interaction.user.username}/${interaction.user.id}\n`);
                } else {
                    await interaction.reply({
                        embeds: [embeds.authenticated],
                        ephemeral: true,
                    });
                    logger.info(`利用規約に同意済みです <実行ユーザー表示名/名前/ID>: ${interaction.user.displayName}/${interaction.user.username}/${interaction.user.id}`);
                };
            } catch (error) {
                appendFile("logs/error.log", `[${date}] ${error}`);
            };
        };
    }
};