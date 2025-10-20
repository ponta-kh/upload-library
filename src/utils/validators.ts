import type { ValidateString, ValidateNumber, ValidateDate, ValidateResult } from "@/types/validation";

export function validateString(value: string, rules: ValidateString): ValidateResult {
    const errorMessages: string[] = [];

    // 必須チェック
    if (rules.isRequired) {
        if (value.trim() === "") {
            errorMessages.push("この項目は必須です");
            return { value, errorMessages };
        }
    }

    // 最小文字数チェック
    if (rules.minLength !== undefined) {
        if (value.length < rules.minLength) {
            errorMessages.push(`最低でも ${rules.minLength} 文字以上で入力してください`);
        }
    }

    // 最大文字数チェック
    if (rules.maxLength !== undefined) {
        if (value.length > rules.maxLength) {
            errorMessages.push(`最大 ${rules.maxLength} 文字以内で入力してください`);
        }
    }

    return { value, errorMessages };
}

export function validateNumber(value: string, rules: ValidateNumber): ValidateResult {
    const errorMessages: string[] = [];
    const trimmedValue = value.trim().replace(/,/g, "");
    const checkNum = Number(value);

    const absNumStr = Math.abs(checkNum).toString();
    const [integerPart, decimalPart] = absNumStr.split(".");

    // 必須チェック
    if (rules.isRequired) {
        if (value.trim() === "") {
            errorMessages.push("この項目は必須です");
            return { value, errorMessages };
        }
    }

    // 数値変換チェック
    if (trimmedValue !== "" && isNaN(checkNum)) {
        errorMessages.push("数値を入力してください");
        return { value, errorMessages };
    }

    // 最小値チェック
    if (rules.minValue !== undefined) {
        if (checkNum < rules.minValue) {
            errorMessages.push(`最小値は ${rules.minValue} です`);
        }
    }

    // 最大値チェック
    if (rules.maxValue !== undefined) {
        if (checkNum > rules.maxValue) {
            errorMessages.push(`最大値は ${rules.maxValue} です`);
        }
    }

    // 整数部桁数チェック
    if (rules.maxIntegerDigits !== undefined && integerPart.length > rules.maxIntegerDigits) {
        errorMessages.push(`整数部分は最大 ${rules.maxIntegerDigits} 桁まで入力できます`);
    }

    // 小数部桁数チェック
    if (rules.maxDecimalDigits !== undefined && decimalPart && decimalPart.length > rules.maxDecimalDigits) {
        errorMessages.push(`小数部分は最大 ${rules.maxDecimalDigits} 桁まで入力できます`);
    }

    return { value, errorMessages };
}

export function validateDate(value: string, rules: ValidateDate): ValidateResult {
    const errorMessages: string[] = [];
    const date = new Date(value);

    // 必須チェック
    if (rules.isRequired) {
        if (value.trim() === "") {
            errorMessages.push("この項目は必須です");
            return { value, errorMessages };
        }
    }

    // 日付変換チェック
    if (isNaN(date.getTime())) {
        errorMessages.push("有効な日付を入力してください");
        return { value, errorMessages };
    }

    // 最早日チェック
    if (rules.earliest !== undefined) {
        if (date < rules.earliest) {
            errorMessages.push(`${rules.earliest.toISOString().split("T")[0]} 以降の日付を入力してください`);
        }
    }

    // 最遅日チェック
    if (rules.latest !== undefined) {
        if (date > rules.latest) {
            errorMessages.push(`${rules.latest.toISOString().split("T")[0]} 以前の日付を入力してください`);
        }
    }

    return { value, errorMessages };
}
