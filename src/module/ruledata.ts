import { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from "discord.js";
import { config } from "../utils/config";

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
                description: "Translated from DeepL",
                value: `page_3`,
            },
        ])
);
export const embeds: Embeds = {
    completed: new EmbedBuilder()
        .setColor(Number(config.botColor))
        .setTitle("認証完了/Authentication completed")
        .setDescription("利用規約に同意しました！\n<id:customize> でロール設定を行って、自己紹介や挨拶をしましょう！"),
    authenticated: new EmbedBuilder()
        .setColor(Number(config.botColor))
        .setTitle("認証済み/Authenticated")
        .setDescription("あなたは認証済みです\nYou are authenticated"),
    rule: [
        new EmbedBuilder()
            .setColor(Number(config.botColor))
            .setTitle("猫の隠れ家 利用規約")
            .addFields([
                { name: "第一条 基本", value: "1. 認証者(認証済みの役職持ち)=利用規約同意者とします。\n2. 13歳未満の利用は禁止です。\n3. [Discordサービス利用規約](https://discord.com/terms>)を守ること。\n4. [Discordコミュニティガイドライン](https://discord.com/guidelines)を守ること。\n5. 当鯖は鯖を経由した個人間のトラブルは一切責任をとりません。\n6. 他のサーバーでの行為も処罰行為の対象です。\n7. 利用規約に違反しているか・処罰の水準の判断は運営組が一任します。\n8. 管理人が問題行為と見なした場合は、処罰対象になります。\n9. 基本的に処罰理由は本人が望んだ場合のみ提示しますが、それ以上の言及はしません。\n10. 利用規約が更新されたとしても、利用規約同意者は更新後の利用規約を守らなければなりません。"},
                { name: "第二条 禁止事項", value: "1. メンバー・第三者へ限度の超えた迷惑をかける・妨害をする・不快に思わせる行為\n2. 暴言・誹謗中傷等を行う行為またはその恐れの有る行為\n3. 許可のない個人情報の発言\n4. 虚偽の情報や誤解を招く発言\n5. 公序良俗に反する行為\n6. <id:guide>での禁止事項を守らない行為\n7. 許可のない宣伝及び勧誘行為\n8. 処罰されたユーザーが別アカウントで利用する行為\n9. 当鯖に関する情報を悪意を持って外部に漏らす行為\n10. 度重なる利用規約の違反\n11. 上記の行為をする又はするようにと脅す・ほのめかす行為"},
                { name: "第三条 罰則", value: "1. 注意\n2. 警告\n3. メッセージ削除\n4. タイムアウト\n5. 役職剥奪\n6. キック\n7. BAN"},
            ]),
        new EmbedBuilder()
            .setColor(Number(config.botColor))
            .setTitle("CatHideaway Terms of Service")
            .addFields([
                { name: "Article 1 Basics", value: "1. Authenticated = person who agrees to the Terms of Service. \n2. under 13 years old are not allowed to use this service. \n3. abide by [Discord Terms of Service](https://discord.com/terms>). \n4. abide by [Discord Community Guidelines](https://discord.com/guidelines) \n5. we do not take any responsibility for any trouble between individuals through the server. \n6. Any conduct on other servers is also subject to punishment. \n7. The decision of whether or not a user has violated the terms of service and the level of punishment will be left up to the management team. \n8. If the administrator considers it a problematic behavior, it will be punished. \n9. Basically, the reason for the punishment will be given only if the person wants to be punished, but we will not mention more than that. \n10. Even if the Terms of Service are updated, the user who agrees to the Terms of Use must abide by the updated Terms of Use." },
                { name: "Article 2 Prohibited Matters", value: "1. Acts that cause undue inconvenience, disturbance, or discomfort to members or third parties.\n2. Acts that are or may be abusive, slanderous, or defamatory\n3. Statements of personal information without authorization\n4. False information or misleading statements\n5. Acts against public order and morals\n6. failure to comply with the prohibitions in <id:guide>\n7. Unauthorized advertising and solicitation\n8. Use of another account by the punished user\n9. Maliciously leaking information about this server to outside parties\n10. Repeated violations of the Terms of Use\n11. Threatening or insinuating to commit any of the above acts" },
                { name: "Article 3 Penalties", value: "1. Caution\n2. Warning\n3. Message Deletion\n4. timeout\n5. role deprivation\n6. kick\n7. BAN" },
            ]),
        new EmbedBuilder()
            .setColor(Number(config.botColor))
            .setTitle("CatHideaway 使用條款")
            .addFields([
                { name: "第一條 基礎", value: "1. 已驗證=同意服務條款的人。 \n2. 13歲以下不得使用此服務。 \n3. 遵守[Discord 服務條款](https://discord.com/terms>)。 \n4. 遵守 [Discord 社群準則](https://discord.com/guidelines) \n5. 對於個人之間透過伺服器產生的任何麻煩，我們不承擔任何責任。 \n6. 在其他伺服器上的任何行為也會受到懲罰。 \n7. 用戶是否違反服務條款以及處罰程度將由管理團隊決定。 \n8. 如果管理員認為這是有問題的行為，就會受到懲罰。 \n9. 基本上，只有當這個人想要受到懲罰時才會給出懲罰的原因，但我們不會提及更多。 \n10. 即使服務條款已更新，同意本使用條款的使用者也必須遵守更新後的使用條款。" },
                { name: "第二条 禁止事項", value: "1. 造成會員或第三人不當不便、幹擾或不適的行為。\n2. 屬於或可能屬於辱罵、誹謗或誹謗的行為\n3. 未經授權的個人資訊陳述\n4. 虛假資訊或誤導性陳述\n5. 違反公共秩序和道德的行為\n6. 未能遵守<id:guide>中的禁令\n7. 未經授權的廣告和招攬\n8. 受懲罰使用者使用另一個帳戶\n9. 惡意向外部各方洩露有關此伺服器的資訊\n10. 屢次違反使用條款\n11. 威脅或暗示實施上述任何行為" },
                { name: "第三條 處罰", value: "1. 注意\n2. 警告\n3. 訊息刪除\n4. 超時\n5. 角色剝奪\n6. 踢\n7. 禁止" },
            ]),
        new EmbedBuilder()
            .setColor(Number(config.botColor))
            .setTitle("CatHideaway 使用条款")
            .addFields([
                { name: "第一条 基础", value: "1. 已验证=同意服务条款的人。 \n2. 13岁以下不得使用此服务。 \n3. 遵守[Discord 服务条款](https://discord.com/terms>)。 \n4. 遵守 [Discord 社区准则](https://discord.com/guidelines) \n5. 对于个人之间通过服务器产生的任何麻烦，我们不承担任何责任。 \n6. 在其他服务器上的任何行为也会受到惩罚。 \n7. 用户是否违反服务条款以及处罚程度将由管理团队决定。 \n8. 如果管理员认为这是有问题的行为，就会受到惩罚。 \n9. 基本上，只有当这个人想要受到惩罚时才会给出惩罚的原因，但我们不会提及更多。 \n10. 即使服务条款有所更新，同意本使用条款的用户也必须遵守更新后的使用条款。" },
                { name: "第二条 禁止事项", value: "1. 给会员或第三方造成不当不便、干扰或不适的行为。\n2. 属于或可能属于辱骂、诽谤或诽谤的行为\n3. 未经授权的个人信息陈述\n4. 虚假信息或误导性陈述\n5. 违反公共秩序和道德的行为\n6. 未能遵守<id:guide>中的禁令\n7. 未经授权的广告和招揽\n8. 受惩罚用户使用另一个帐户\n9. 恶意向外部各方泄露有关此服务器的信息\n10. 屡次违反使用条款\n11. 威胁或暗示实施上述任何行为" },
                { name: "第三条 处罚", value: "1. 注意\n2. 警告\n3. 消息删除\n4. 超时\n5. 角色剥夺\n6. 踢\n7. 禁止" },
            ]),
        new EmbedBuilder()
            .setColor(Number(config.botColor))
            .setTitle("CatHideaway 이용 규약")
            .addFields([
                { name: "제1조 기본", value: "1. 인증된 사람 = 서비스 약관에 동의한 사람. \만 13세 미만은 본 서비스를 이용할 수 없습니다. \n3. [Discord 서비스 약관](https://discord.com/terms>)을 준수합니다. \n4. [Discord 커뮤니티 가이드라인](https://discord.com/guidelines)을 준수합니다. n5. 당사는 서버를 통해 개인 간에 발생한 문제에 대해 어떠한 책임도 지지 않습니다. \n6. 다른 서버에서의 모든 행위도 처벌 대상입니다. \n7. 이용자의 서비스 약관 위반 여부 및 처벌 수위에 대한 판단은 운영진에 맡겨집니다. \n8. 관리자가 문제 행동이라고 판단하는 경우 처벌을 받게 됩니다. \n9. 기본적으로 본인이 처벌을 원할 경우에만 처벌 사유를 알려드리며, 그 이상은 언급하지 않습니다. \n10. 이용약관이 업데이트된 경우에도 이용약관에 동의한 이용자는 업데이트된 이용약관을 준수해야 합니다." },
                { name: "제2조 금지사항", value: "1. 회원 또는 제3자에게 부당한 불편, 방해 또는 불쾌감을 주는 행위\n2. 욕설, 비방, 명예훼손을 하거나 그럴 우려가 있는 행위\n3. 권한 없는 개인 정보의 진술\n4. 허위 정보 또는 오해를 불러일으킬 수 있는 진술\n5. 공공질서 및 미풍양속에 반하는 행위\n6. <id:guide>에서 금지하는 사항을 준수하지 않는 경우\n7. 허가되지 않은 광고 및 권유\n8. 처벌을 받은 사용자가 다른 계정을 사용하는 경우\n9. 이 서버에 대한 정보를 악의적으로 외부에 유출하는 행위\n10. 반복적인 이용 약관 위반\n11. 위의 행위를 하겠다고 협박 또는 암시하는 경우" },
                { name: "제3조 벌칙", value: "1. 주의\n2. 주의\n3. 메시지 삭제\n4. 시간 초과\n5. 역할 박탈\n6. 발로 차기\n7. 금지" },
            ])
    ]
}
export const agreeButton: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
        .setCustomId("agreebutton")
        .setLabel("利用規約に同意する/Agree to the rules")
        .setStyle(ButtonStyle.Success)
)