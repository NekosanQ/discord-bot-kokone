import { Interaction, PermissionsBitField, SlashCommandBuilder, StringSelectMenuInteraction } from "discord.js";
import { languageMenu, embeds, agreeButton } from "../../module/ruledata";
import { appendFile } from "../../module/file/appedFile";
import log4js from 'log4js';
const logger = log4js.getLogger();
logger.level = "info";
const memberRole: string = "712572415850315807";
// -----------------------------------------------------------------------------------------------------------
// 利用規約
// -----------------------------------------------------------------------------------------------------------
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
        }
        // -----------------------------------------------------------------------------------------------------------
        // 利用規約の言語を選択した時の処理
        // -----------------------------------------------------------------------------------------------------------
        if (!interaction.isStringSelectMenu()&&!interaction.isButton()) return;
        if (interaction.customId === "selectlanguage") { // 言語を選択した時の処理
            const page: number = Number((interaction as StringSelectMenuInteraction).values[0].split("_")[1]);
            await interaction.reply({
                embeds: [embeds.rule[page]],
                ephemeral: true,
            });
        };
        // -----------------------------------------------------------------------------------------------------------
        // 利用規約に同意した時の処理
        // -----------------------------------------------------------------------------------------------------------
        if (interaction.customId === "agreebutton") {  // 利用規約に同意した時の処理
            try {
                const role: boolean = interaction.member.roles.cache.has(memberRole);
                if (!role) { // メンバーロールが付与されていない場合
                    interaction.member.roles.add(memberRole);
                    await interaction.reply({
                        embeds: [embeds.completed],
                        ephemeral: true,
                    });
                    logger.info(`利用規約に同意しました <実行ユーザー表示名/名前/ID>: ${interaction.user.displayName}/${interaction.user.username}/${interaction.user.id}`);
                    appendFile("logs/rule.log", `[${date}] 利用規約に同意しました <実行ユーザー/ID>: <実行ユーザー表示名/名前/ID>: ${interaction.user.displayName}/${interaction.user.username}/${interaction.user.id}\n`);
                } else { // メンバーロールが既にある場合
                    await interaction.reply({
                        embeds: [embeds.authenticated],
                        ephemeral: true,
                    });
                    logger.info(`利用規約に同意済みです <実行ユーザー表示名/名前/ID>: ${interaction.user.displayName}/${interaction.user.username}/${interaction.user.id}`);
                };
            } catch (error) { // エラーはログに保存
                appendFile("logs/error.log", `[${date}] ${error}`);
            };
        };
    }
};