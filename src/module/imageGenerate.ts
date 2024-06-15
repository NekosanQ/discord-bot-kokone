import { Interaction, AttachmentBuilder, GuildMember, CommandInteraction } from "discord.js";
import canvas from '@napi-rs/canvas';
import { request } from 'undici';
import crypto from 'crypto';
/**
 * 認証コードを保存するマップ
 */
export const authenticationMap = new Map<string, string>();
/**
 * 認証システム
 * @param interaction インタラクション
 * @returns 認証画像, 認証コード
 */
export async function authenticationProcess(interaction: Interaction): Promise<(string | AttachmentBuilder)[]> {
    const date = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }); // 現在時刻を取得
    const canvasWidth = 700; // 
    const canvasHeight = 250
    const ctx = canvas.createCanvas(canvasWidth, canvasHeight);  // 空のキャンバスを作る
    const { body } = await request((interaction.member as GuildMember).displayAvatarURL({ extension: 'png' }));
    const avatar = await canvas.loadImage(await body.arrayBuffer());
    const context = ctx.getContext('2d');
    context.font = "70px Noto Sans CJK JP";
        
    let authenticationCode: string;
   /**
    * ランダムの文字列を作成し、描画する関数
    */
    function randomStringPlacement() {
        const characters = "ABDEFGHJKLMNPQRSTUYabdefghijkmnpqrstuy23456789";
        const charactersIndex = Array.from(crypto.randomFillSync(new Uint8Array(6))).map((n) => characters[n%characters.length]).join('');
        for (let i = 0; i < 6; i++) {
            const width = (i + 1) * (Math.floor(Math.random() * (80 + 1 - 60)) + 60) + (i * 30);
            const height = Math.floor(Math.random() * (230 + 1 - 130)) + 130;

            context.fillText(charactersIndex[i], width, height);
            authenticationCode += charactersIndex[i];
        }
    }
    /**
     * 文字列生成
     */
    context.fillStyle = "#555555";
    randomStringPlacement() // 妨害用文字列
    context.fillStyle = "#adff2f";
    authenticationCode = '';
    randomStringPlacement() // 認証用文字列
    /**
     * 線生成
     */
    for (let i = 0; i < 100; i++) { // ランダムな線を引く
        const height1 = Math.floor(Math.random() * (canvasHeight + 80 - 80)) + 1;
        const height2 = Math.floor(Math.random() * (canvasHeight + 1 - 1)) + 1;
        context.beginPath();
        context.moveTo(Math.random() * canvasWidth, height1);
        context.lineTo(Math.random() * canvasWidth, height2);
        context.stroke();
    }
    /**
     * ユーザー情報
     */
    context.font = "30px Noto Sans CJK JP";
    context.fillStyle = "#f5f5f5";
    const member = interaction.member as GuildMember;
    context.fillText(`${member.displayName} 画像認証`, 100, 55);
    /**
     * ユーザーIDと実行時刻
     */
    context.font = "10px Noto Sans CJK JP";
    context.fillText(`${date}-${member.id}`, 450, 250);
    
    /**
     * ユーザーアイコンを丸める
     */
    context.beginPath();
    context.arc(45, 45, 40, 0, Math.PI * 2);
    context.closePath();
    context.clip();
    /**
     * ユーザーアイコン
     */
    context.drawImage(avatar, 5, 5, 80, 80);
    context.strokeRect(0, 0, ctx.width, ctx.height);
    /**
     * エンコード
     */
    const attachment = new AttachmentBuilder(await ctx.encode('png'), { name: `${interaction.user.id}.png` });

    const authenticationArray = [
        authenticationCode,
        attachment
    ];
    
    return authenticationArray;
}
/**
 * プロフィール画像生成プログラム
 * @param interaction インタラクション
 * @returns プロフィール画像
 */
export async function profileGenerate(interaction: CommandInteraction): Promise<AttachmentBuilder> {
    const date = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }); // 現在時刻を取得
    const canvasWidth = 700; // 
    const canvasHeight = 250
    const ctx = canvas.createCanvas(canvasWidth, canvasHeight);  // 空のキャンバスを作る
    const { body } = await request((interaction.member as GuildMember).displayAvatarURL({ extension: 'png' }));
    const avatar = await canvas.loadImage(await body.arrayBuffer());
    const context = ctx.getContext('2d');
    context.font = "70px Noto Sans CJK JP";

    /**
     * ユーザー情報
     */
    context.font = "30px Noto Sans CJK JP";
    context.fillStyle = "#f5f5f5";
    const member = interaction.member as GuildMember;
    context.fillText(`${member.displayName}`, 100, 55);
    
    /**
     * ユーザーアイコンを丸める
     */
    context.beginPath();
    context.arc(45, 45, 40, 0, Math.PI * 2);
    context.closePath();
    context.clip();
    /**
     * ユーザーアイコン
     */
    context.drawImage(avatar, 5, 5, 80, 80);
    context.strokeRect(0, 0, ctx.width, ctx.height);
    /**
     * 現在のランク
     */
    /**
     * エンコード
     */
    const attachment = new AttachmentBuilder(await ctx.encode('png'), { name: `${interaction.user.id}.png` });

    return attachment;
}