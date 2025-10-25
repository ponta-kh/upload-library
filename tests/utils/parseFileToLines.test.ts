import { describe, it, expect } from "vitest";
import { parseFileToLines } from "../../src/utils/parseFileToLines";

// Fileオブジェクトを作るヘルパー
function createFile(content: string, name = "test.csv", type = "text/csv"): File {
    return new File([content], name, { type });
}

describe("parseFileToLines", () => {
    it("正常にCSVを解析して2次元配列を返す", async () => {
        const csvContent = "name,age\nAlice,20\nBob,30";
        const file = createFile(csvContent);

        const result = await parseFileToLines(file, []);

        expect(result.success).toBe(true);
        expect(result.data).toEqual([
            ["name", "age"],
            ["Alice", "20"],
            ["Bob", "30"],
        ]);
        expect(result.errorMessages).toEqual([]);
    });

    it("スキップ行を正しく除外する", async () => {
        const csvContent = "A,B,C\n1,2,3\n4,5,6\n7,8,9";
        const file = createFile(csvContent);

        // 1行目（インデックス0）をスキップ
        const result = await parseFileToLines(file, [0]);

        expect(result.success).toBe(true);
        expect(result.data).toEqual([
            ["1", "2", "3"],
            ["4", "5", "6"],
            ["7", "8", "9"],
        ]);
    });

    it("負の値のスキップ行（末尾基準）に対応できる", async () => {
        const csvContent = "A,B,C\n1,2,3\n4,5,6\n7,8,9";
        const file = createFile(csvContent);

        // -1 → 最終行をスキップ
        const result = await parseFileToLines(file, [-1]);

        expect(result.success).toBe(true);
        expect(result.data).toEqual([
            ["A", "B", "C"],
            ["1", "2", "3"],
            ["4", "5", "6"],
        ]);
    });

    it("全行スキップで空になった場合はエラーを返す", async () => {
        const csvContent = "A,B\n1,2";
        const file = createFile(csvContent);

        // 0行目と1行目をスキップ
        const result = await parseFileToLines(file, [0, 1]);

        expect(result.success).toBe(false);
        expect(result.errorMessages).toEqual(["ファイルにデータが存在しません"]);
    });

    it("空ファイルを解析するとエラーを返す", async () => {
        const file = createFile("");

        const result = await parseFileToLines(file, []);

        expect(result.success).toBe(false);
        expect(result.errorMessages).toEqual(["ファイルにデータが存在しません"]);
    });

    it("パースエラーが発生した場合はerrorMessagesを返す（不正CSV）", async () => {
        // Papaparseでは複雑なケースでエラーになることがある
        const invalidCsv = '"unclosed,quote\n1,2,3';
        const file = createFile(invalidCsv);

        const result = await parseFileToLines(file, []);

        expect(result.success).toBe(false);
        expect(result.errorMessages[0]).toMatch(/CSV解析エラー/);
    });
});
