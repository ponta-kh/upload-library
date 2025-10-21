import { describe, it, expect } from "vitest";
import { validateString, validateNumber, validateDate } from "../../src/utils/validators";
import type { ValidateString, ValidateNumber, ValidateDate } from "../../src/types/validation";

// ============================
// validateString
// ============================
describe("validateString（文字列バリデーション）", () => {
    const rules: ValidateString = {
        type: "string",
        isRequired: true,
        minLength: 3,
        maxLength: 5,
    };

    it("必須チェック: 空文字はエラー", () => {
        const result = validateString("", rules);
        expect(result.errorMessages).toContain("この項目は必須です");
    });

    it("境界値: ちょうど最小長（3文字）はOK", () => {
        const result = validateString("abc", rules);
        expect(result.errorMessages).toHaveLength(0);
    });

    it("境界値: 最小長−1（2文字）はエラー", () => {
        const result = validateString("ab", rules);
        expect(result.errorMessages).toContain("最低でも 3 文字以上で入力してください");
    });

    it("境界値: ちょうど最大長（5文字）はOK", () => {
        const result = validateString("abcde", rules);
        expect(result.errorMessages).toHaveLength(0);
    });

    it("境界値: 最大長+1（6文字）はエラー", () => {
        const result = validateString("abcdef", rules);
        expect(result.errorMessages).toContain("最大 5 文字以内で入力してください");
    });
});

// ============================
// validateNumber
// ============================
describe("validateNumber（数値バリデーション）", () => {
    const rules: ValidateNumber = {
        type: "number",
        isRequired: true,
        minValue: 10,
        maxValue: 100,
        maxIntegerDigits: 3,
        maxDecimalDigits: 2,
    };

    it("必須チェック: 空文字はエラー", () => {
        const result = validateNumber("", rules);
        expect(result.errorMessages).toContain("この項目は必須です");
    });

    it("数値変換: 数値でない文字はエラー", () => {
        const result = validateNumber("abc", rules);
        expect(result.errorMessages).toContain("数値を入力してください");
    });

    it("境界値: 最小値ちょうど（10）はOK", () => {
        const result = validateNumber("10", rules);
        expect(result.errorMessages).toHaveLength(0);
    });

    it("境界値: 最小値−1（9.99）はエラー", () => {
        const result = validateNumber("9.99", rules);
        expect(result.errorMessages).toContain("最小値は 10 です");
    });

    it("境界値: 最大値ちょうど（100）はOK", () => {
        const result = validateNumber("100", rules);
        expect(result.errorMessages).toHaveLength(0);
    });

    it("境界値: 最大値+1（100.01）はエラー", () => {
        const result = validateNumber("100.01", rules);
        expect(result.errorMessages).toContain("最大値は 100 です");
    });

    it("整数桁数: 3桁（999）はOK", () => {
        const result = validateNumber("999", rules);
        expect(result.errorMessages).toHaveLength(0);
    });

    it("整数桁数: 4桁（1000）はエラー", () => {
        const result = validateNumber("1000", rules);
        expect(result.errorMessages).toContain("整数部分は最大 3 桁まで入力できます");
    });

    it("小数桁数: 2桁（12.34）はOK", () => {
        const result = validateNumber("12.34", rules);
        expect(result.errorMessages).toHaveLength(0);
    });

    it("小数桁数: 3桁（12.345）はエラー", () => {
        const result = validateNumber("12.345", rules);
        expect(result.errorMessages).toContain("小数部分は最大 2 桁まで入力できます");
    });

    it("境界値: 負数もチェック（-10はOK、-11はエラー）", () => {
        const ok = validateNumber("-10", rules);
        const ng = validateNumber("-11", rules);
        expect(ok.errorMessages).toHaveLength(0);
        expect(ng.errorMessages).toContain("最小値は 10 です");
    });
});

// ============================
// validateDate
// ============================
describe("validateDate（日付バリデーション）", () => {
    const rules: ValidateDate = {
        type: "date",
        isRequired: true,
        earliest: new Date("2025-01-01"),
        latest: new Date("2025-12-31"),
    };

    it("必須チェック: 空文字はエラー", () => {
        const result = validateDate("", rules);
        expect(result.errorMessages).toContain("この項目は必須です");
    });

    it("日付変換: 無効な日付はエラー", () => {
        const result = validateDate("not-a-date", rules);
        expect(result.errorMessages).toContain("有効な日付を入力してください");
    });

    it("境界値: ちょうど最早日（2025-01-01）はOK", () => {
        const result = validateDate("2025-01-01", rules);
        expect(result.errorMessages).toHaveLength(0);
    });

    it("境界値: 最早日より1日前（2024-12-31）はエラー", () => {
        const result = validateDate("2024-12-31", rules);
        expect(result.errorMessages).toContain("2025-01-01 以降の日付を入力してください");
    });

    it("境界値: ちょうど最遅日（2025-12-31）はOK", () => {
        const result = validateDate("2025-12-31", rules);
        expect(result.errorMessages).toHaveLength(0);
    });

    it("境界値: 最遅日より1日後（2026-01-01）はエラー", () => {
        const result = validateDate("2026-01-01", rules);
        expect(result.errorMessages).toContain("2025-12-31 以前の日付を入力してください");
    });
});
