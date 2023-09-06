import { Interaction, SlashCommandBuilder, StringSelectMenuInteraction } from "discord.js";
import { languageMenu, embeds, agreeButton } from "../../module/ruledata";
import { appendFile } from "../../module/apped_file";

const timenow: string = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
const memberRole: string = "712572415850315807";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rule")
        .setDescription("利用規約を作成します"),
    async execute(interaction: Interaction<"cached">): Promise<void> {
        if (interaction.isChatInputCommand()) {
            await interaction.reply({
                embeds: [embeds.rule[0]],
                components: [languageMenu, agreeButton]
            });
            return;
        }
        // -----------------------------------------------------------------------------------------------------------
        // 利用規約に同意/言語を選択した時の処理
        // -----------------------------------------------------------------------------------------------------------
        if (!interaction.isStringSelectMenu()&&!interaction.isButton()) return;
        if (interaction.customId === "selectlanguage") { // 言語を選択した時の処理
            const page: number = Number((interaction as StringSelectMenuInteraction).values[0].split("_")[1]);
            await interaction.reply({
                embeds: [embeds.rule[page]],
                ephemeral: true,
            });
            console.log(`[${timenow}] 利用規約の言語を選択しました <実行ユーザー>: ${interaction.user.tag}`);
        };
        if (interaction.customId === "agreebutton") {  // 利用規約に同意した時の処理
            try {
                const role: boolean = interaction.member.roles.cache.has(memberRole);
                if (!role) {
                    interaction.member.roles.add(memberRole);
                    await interaction.reply({
                        embeds: [embeds.completed],
                        ephemeral: true,
                    });
                    console.log(`[${timenow}] 利用規約に同意しました <実行ユーザー/ID>: ${interaction.user.tag}/${interaction.user.id}`);
                    appendFile(`[${timenow}] 利用規約に同意しました <実行ユーザー/ID>: ${interaction.user.tag}/${interaction.user.id}\n`);
                } else {
                    await interaction.reply({
                        embeds: [embeds.authenticated],
                        ephemeral: true,
                    });
                    console.log(`[${timenow}] 利用規約に同意済みです <実行ユーザー>: ${interaction.user.tag}`)
                }
            } catch (error) {
                console.log(error);
            };
        };
    }
};