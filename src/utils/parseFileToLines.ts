import Papa from "papaparse";

export interface ParseFileToLinesResult {
    success: boolean;
    data: string[][];
    errorMessages: string[];
}

export async function parseFileToLines(file: File, skipLines: number[]): Promise<ParseFileToLinesResult> {
    // 現状UTF-8のみ対応
    // 将来的に他のエンコーディング対応を追加する場合はここで分岐させる
    const parsedResult = await parseUtf8FileToLines(file, skipLines);

    return parsedResult;
}

async function parseUtf8FileToLines(file: File, skipLines: number[]): Promise<ParseFileToLinesResult> {
    const fileText = await file.text();

    const parsedData = Papa.parse<string[]>(fileText, {
        header: false,
        skipEmptyLines: true,
        beforeFirstChunk: (chunk) => filterSkippedLines(chunk, skipLines),
    });

    if (parsedData.errors.length > 0) {
        return {
            success: false,
            data: parsedData.data,
            errorMessages: parsedData.errors.map((e) => `CSV解析エラー: ${e.message}`),
        };
    }

    if (parsedData.data.length === 0) {
        return {
            success: false,
            data: parsedData.data,
            errorMessages: ["指定された行をスキップした後、ファイルにデータが存在しません"],
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
