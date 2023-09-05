import fs from "node:fs"

//ファイルの書き込み関数
export function appendFile(data: string) {
    fs.appendFile("logs/rule.text", data, (err) => {
        if (err) throw err;
        console.log("テキストファイルにログを書き込みました");
    });
};