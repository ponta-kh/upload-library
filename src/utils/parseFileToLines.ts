import Papa from "papaparse";
import type { ParseFileToLinesResult } from "../types/funcResult";

/**
 * ファイルを解析して行ごとの文字列配列に変換する
 * @param file 解析対象のファイル
 * @param skipLines スキップする行番号の配列
 * @returns 解析結果
 */
export async function parseFileToLines(file: File, skipLines: number[]): Promise<ParseFileToLinesResult> {
    // 現状UTF-8のみ対応
    // 将来的に他のエンコーディング対応を追加する場合はここで分岐させる
    const parsedResult = await parseUtf8FileToLines(file, skipLines);

    return parsedResult;
}

/**
 * UTF-8エンコーディングのファイルを解析して行ごとの文字列配列に変換する
 * @param file 解析対象のファイル
 * @param skipLines スキップする行番号の配列
 * @returns 解析結果
 */
async function parseUtf8FileToLines(file: File, skipLines: number[]): Promise<ParseFileToLinesResult> {
    const fileText = await file.text();

    // 不要行を削除した結果、空になる可能性があるため、beforeFirstChunkは使えない
    const filteredText = filterSkippedLines(fileText, skipLines);

    if (!filteredText.trim()) {
        return {
            success: false,
            data: [],
            errorMessages: ["ファイルにデータが存在しません"],
        };
    }

    const parsedData = Papa.parse<string[]>(filteredText, {
        header: false,
        skipEmptyLines: true,
    });

    if (parsedData.errors.length > 0) {
        return {
            success: false,
            data: parsedData.data,
            errorMessages: parsedData.errors.map((e) => `CSV解析エラー: ${e.message}`),
        };
    }

    return {
        success: true,
        data: parsedData.data,
        errorMessages: [],
    };
}

/**
 * 指定行をスキップするヘルパー関数
 * @param chunk CSV文字列
 * @param skipLines スキップ対象行（負の値は末尾基準）
 * @returns スキップ済みCSV文字列
 */
function filterSkippedLines(chunk: string, skipLines: number[]): string {
    const rows = chunk.split(/\r\n|\n/);
    const total = rows.length;

    // 負の値を末尾基準に補正してSetに変換
    const normalizedSkip = skipLines.map((i) => (i < 0 ? total + i : i));
    const skipSet = new Set(normalizedSkip);

    // スキップ対象でない行だけ残す
    const filteredRows = rows.filter((_, idx) => !skipSet.has(idx));

    return filteredRows.join("\n");
}
