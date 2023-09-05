import { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from "discord.js";
import { botcolor } from "../config.json";

interface Embeds {
    completed: EmbedBuilder,
    authenticated: EmbedBuilder,
    rule: EmbedBuilder[]
}

export const languageMenu: ActionRowBuilder<StringSelectMenuBuilder> = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
        .setCustomId(`selectlanguage`)
        .setPlaceholder(`Select a language`)
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions([
            {
                label: "English",
                description: "Translated from DeepL",
                value: `page_0`,
            },
            {
                label: "繁體中文",
                description: "Translated from Google",
                value: `page_1`,
            },
            {
                label: "中文",
                description: "Translated from Google",
                value: `page_2`,
            },
            {
                label: "한국어",
                description: "Translated from Google",
                value: `page_3`,
            },
        ])
);
export const embeds: Embeds = {
    completed: new EmbedBuilder()
        .setColor(Number(botcolor))
        .setTitle("認証完了/Authentication completed")
        .setDescription("利用規約に同意しました！\n<id:customize> でロール設定を行って、自己紹介や挨拶をしましょう！"),
    authenticated: new EmbedBuilder()
        .setColor(Number(botcolor))
        .setTitle("認証済み/Authenticated")
        .setDescription("あなたは認証済みです\nYou are authenticated"),
    rule: [
        new EmbedBuilder()
            .setColor(Number(botcolor))
            .setTitle("猫の隠れ家 利用規約")
            .setDescription("__以下の利用規約は必ず守ってください！__")
            .addFields([
                { name: "第一条 基本", value: "```1.メンバー=利用規約同意者とする。\n2.13歳未満の利用は禁じています。\n3.最低限のモラルは守ること。\n4.本サーバーはメンバー同士のトラブルは一切責任をとりません。\n5.他のサーバーでの行為も処罰行為の対象になる恐れがあります。\n6.管理人が問題行為と見なした場合は、処罰対象になります。\n(※もし処罰された場合、理由などは公開しません。)\n7.利用規約が更新されたとしても、メンバーは更新後の利用規約を守らなければならない```"},
                { name: "第二条 禁止事項", value: "```1.メンバー・第三者へ限度の超えた迷惑をかける・妨害をする・不快に思わせる行為\n2.管理人の権限を悪用する行為\n3.暴言・誹謗中傷等を行う行為またはその恐れの有る行為```"},
                { name: "第三条 罰則", value: "```1.注意・厳重注意\n2.警告・厳重警告\n3.タイムアウト・キック・BAN等\n4.役職剥奪\n5.メッセージの削除```"},
                { name: "以下の行為は確実に処罰を受ける行為", value: "```1.荒らし行為\n2.トークン・個人情報を発言する行為\n3.暴言・不適切な言葉を何度も発言する行為\n4.スパム・宣伝行為\n5.度重なる利用規約の違反```"},
                { name: "利用規約を読んだら...", value: "```利用規約に同意して雑談で挨拶・自己紹介をしましょう！```" }
            ]),
        new EmbedBuilder()
            .setColor(Number(botcolor))
            .setTitle("CatHideaway Rule")
            .setDescription("__The following rules must be followed!__")
            .addFields([
                { name: "Article 1 Basics", value: "```1. Role grantor = person who agrees to the rules.\n2. Please be sure to follow the official Discord Terms of Service.\n3. We are not responsible for any problems between members on this server.\n4. Actions taken on other servers may also be subject to punishment.\n5. If an administrator determines that a member's behavior is problematic, the administrator may impose disciplinary action against the member.```" },
                { name: "Article 2 Prohibited Matters", value: "```1. Actions that cause annoyance, disturbance, or discomfort to members or third parties.\n2. Acts that abuse the authority of the administrator\n3. Acts that are or may be libelous, defamatory, or libelous```" },
                { name: "Article 3 Penalties", value: "```1. Caution/Strict Warning\n2. Warning/Strict Warning\n3. Mute, kick, ban, etc.\n4. Revocation of position as administrator, etc.```" },
                { name: "The following acts are definitely punishable", value: "```1. Mentioning multiple people\n2. Acts of uttering tokens/personal information\n3. Repeated use of abusive or inappropriate language\n4. Spamming or advertising```" },
                { name: "After reading the rules...", value: "```Agree to the rules and say hi/introduce yourself in the chat! (Preferably in Japanese)```" }
            ]),
        new EmbedBuilder()
            .setColor(Number(botcolor))
            .setTitle("CatHideaway使用條款")
            .setDescription("__請務必遵守以下條款和條件！__")
            .addFields([
                { name: "第一條 基礎", value: "```1. 角色授予者 = 同意使用條款的人。\n2. 請遵守官方的 Discord 服務條款。\n3. 本服務器不對成員之間的任何爭鬥負責。\n4. 對其他服務器採取的行動也可能受到紀律處分。\n5. 如果管理層確定存在問題，則會受到處罰。```" },
                { name: "第二条 禁止事項", value: "```1. 給會員或第三方帶來不便、阻礙或不適的行為\n2. 濫用管理員權限\n3. 誹謗等，或可能這樣做的行為```" },
                { name: "第三條 處罰", value: "```1. 注意/嚴格警告\n2. 警告/嚴重警告\n3. 靜音，踢，禁止等\n4. 剝奪管理職位等```" },
                { name: "以下行為是絕對應受懲罰的行為", value: "```1. 提及多人\n2. 表達代幣或個人信息的行為\n3. 反複使用辱罵性語言或不當語言\n4. 垃圾郵件/促銷```" },
                { name: "閱讀使用條款後...", value: "```同意使用條款並自我介紹並在聊天中打個招呼！（最好是日語）```" }
            ]),
        new EmbedBuilder()
            .setColor(Number(botcolor))
            .setTitle("CatHideaway使用条款")
            .setDescription("__请务必遵守以下条款和条件！__")
            .addFields([
                { name: "第一条 基础", value: "```1. 角色授予者 = 同意使用条款的人。\n2. 请遵守官方的 Discord 服务条款。\n3. 本服务器不对成员之间的任何争斗负责。\n4. 对其他服务器采取的行动也可能受到纪律处分。\n5. 如果管理层确定存在问题，则会受到处罚。```" },
                { name: "第二条 禁止事项", value: "```1. 给会员或第三方带来不便、阻碍或不适的行为\n2. 滥用管理员权限\n3. 诽谤等，或可能这样做的行为```" },
                { name: "第三条 处罚", value: "```1. 注意/严格警告\n2. 警告/严重警告\n3. 静音，踢，禁止等\n4. 剥夺管理职位等```" },
                { name: "以下行为是绝对应受惩罚的行为", value: "```1. 提及多人\n2. 表达代币或个人信息的行为\n3. 反复使用辱骂性语言或不当语言\n4. 垃圾邮件/促销```" },
                { name: "阅读使用条款后...", value: "```同意使用条款并自我介绍并在聊天中打个招呼！（最好是日语）```" }
            ]),
        new EmbedBuilder()
            .setColor(Number(botcolor))
            .setTitle("CatHideaway 이용 규약")
            .setDescription("__이하의 이용 약관은 반드시 지켜 주세요!__")
            .addFields([
                { name: "제1조 기본", value: "```1. 직책 부여자 = 이용 약관 동의자로 한다.\n2. Discord 공식 이용 약관을 지키는 것.\n3. 본 서버는 멤버끼리의 트러블은 일절 책임을 지지 않습니다.\n4. 다른 서버에서의 행위도 처벌 행위의 대상이 될 우려가 있습니다.\n5. 관리인이 문제 행위로 간주했을 경우는, 처벌 대상이 됩니다.```" },
                { name: "제2조 금지사항", value: "```1. 회원·제삼자에게 폐를 끼치는·방해를 하는·불쾌하게 생각하게 하는 행위\n2. 관리인의 권한을 악용하는 행위\n3. 폭언·비방 중상 등을 행하는 행위 또는 그 우려가 있는 행위```" },
                { name: "제3조 벌칙", value: "```1. 주의・엄중주의\n2. 경고・엄중 경고3. 음소거, 킥, BAN 등4. 관리인 등의 직책 박탈```" },
                { name: "이하의 행위는 확실히 처벌을 받는 행위", value: "```1. 여러 사람에게 멘션\n2. 토큰·개인정보를 발언하는 행위\n3. 폭언·부적절한 말을 여러 번 발언하는 행위\n4. 스팸 및 홍보 행위```" },
                { name: "이용 약관을 읽으면 ...", value: "```이용 규약에 동의해 잡담으로 인사·자기 소개를 합시다! (가능하면 일본어로)```" }
            ])
    ]
}
export const agreeButton: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
        .setCustomId("agreebutton")
        .setLabel("利用規約に同意する/Agree to the rules")
        .setStyle(ButtonStyle.Success)
)