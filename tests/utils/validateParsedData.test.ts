import { describe, it, expect } from "vitest";
import { validateParsedData } from "../../src/utils/validateParsedData";
import type { Validate } from "../../src/types/validation";

describe("validateParsedData", () => {
    it("ルールに基づいてデータを検証できること", () => {
        const data = [
            ["hello", "123", "2025-01-01"],
            ["", "abc", "not-a-date"],
        ];
        const validateRules: Validate[] = [
            { type: "string", isRequired: true },
            { type: "number", isRequired: true },
            { type: "date", isRequired: true },
        ];

        const result = validateParsedData(data, validateRules);

        expect(result.length).toBe(2);

        // 1行目（正常データ）
        expect(result[0].values[0].errorMessages.length).toBe(0);
        expect(result[0].values[1].errorMessages.length).toBe(0);
        expect(result[0].values[2].errorMessages.length).toBe(0);
        expect(result[0].errorMessages.length).toBe(0);

        // 2行目（エラーあり）
        expect(result[1].values[0].errorMessages).toContain("この項目は必須です");
        expect(result[1].values[1].errorMessages).toContain("数値を入力してください");
        expect(result[1].values[2].errorMessages).toContain("有効な日付を入力してください");
        expect(result[1].errorMessages.length).toBe(0);
    });

    it("カスタム行バリデータを使用できること", () => {
        const data = [["a", "b"]];
        const validateRules: Validate[] = [
            { type: "string", isRequired: true },
            { type: "string", isRequired: true },
        ];
        const customRowValidator = (dataRow: string[]) => {
            if (dataRow[0] === "a" && dataRow[1] === "b") {
                return ["aとbの組み合わせは許可されていません。"];
            }
            return [];
        };

        const result = validateParsedData(data, validateRules, customRowValidator);

        expect(result.length).toBe(1);
        expect(result[0].errorMessages).toEqual(["aとbの組み合わせは許可されていません。"]);
    });

    it("列に対応するバリデーションルールが存在しない場合の処理", () => {
        const data = [["a", "b"]];
        const validateRules: Validate[] = [{ type: "string", isRequired: true }]; // 1列目のみルールあり

        const result = validateParsedData(data, validateRules);

        expect(result.length).toBe(1);
        expect(result[0].values[0].errorMessages.length).toBe(0);
        expect(result[0].values[1].errorMessages).toContain("この列に対するバリデーションルールが設定されていません");
    });

    it("不明なバリデーションタイプを処理できること", () => {
        const data = [["a"]];
        const validateRules: Validate[] = [{ type: "unknown" } as any];

        const result = validateParsedData(data, validateRules);

        expect(result.length).toBe(1);
        expect(result[0].values[0].errorMessages).toContain("不明なバリデーションタイプです");
    });
});
