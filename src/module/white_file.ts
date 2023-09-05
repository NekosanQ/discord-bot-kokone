import fs from "node:fs"

//ファイルの書き込み関数
module.exports = function (path: string, data: string) {
    fs.writeFile(path, data, function (error) {
        if (error) {
            throw error;
        }
    });
};