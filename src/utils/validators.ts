import type { ValidateString, ValidateNumber, ValidateDate, ValidateResult } from "@/types/validation";

export function validateString(value: string, rules: ValidateString): ValidateResult {
    const errorMessages: string[] = [];

    // 必須チェック
    if (rules.isRequired) {
        if (value.trim() === "") {
            errorMessages.push("This field is required.");
            return { value, errorMessages };
        }
    }

    // 最小文字数チェック
    if (rules.minLength !== undefined) {
        if (value.length < rules.minLength) {
            errorMessages.push(`Minimum length is ${rules.minLength}.`);
        }
    }

    // 最大文字数チェック
    if (rules.maxLength !== undefined) {
        if (value.length > rules.maxLength) {
            errorMessages.push(`Maximum length is ${rules.maxLength}.`);
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
            errorMessages.push("This field is required.");
            return { value, errorMessages };
        }
    }

    // 数値変換チェック
    if (trimmedValue !== "" && isNaN(checkNum)) {
        errorMessages.push("This field must be a number.");
        return { value, errorMessages };
    }

    // 最小値チェック
    if (rules.minValue !== undefined) {
        if (checkNum < rules.minValue) {
            errorMessages.push(`Minimum value is ${rules.minValue}.`);
        }
    }

    // 最大値チェック
    if (rules.maxValue !== undefined) {
        if (checkNum > rules.maxValue) {
            errorMessages.push(`Maximum value is ${rules.maxValue}.`);
        }
    }

    // 整数部桁数チェック
    if (rules.maxIntegerDigits !== undefined && integerPart.length > rules.maxIntegerDigits) {
        errorMessages.push(`Integer part can have at most ${rules.maxIntegerDigits} digits.`);
    }

    // 小数部桁数チェック
    if (rules.maxDecimalDigits !== undefined && decimalPart && decimalPart.length > rules.maxDecimalDigits) {
        errorMessages.push(`Decimal part can have at most ${rules.maxDecimalDigits} digits.`);
    }

    return { value, errorMessages };
}

export function validateDate(value: string, rules: ValidateDate): ValidateResult {
    const errorMessages: string[] = [];
    const date = new Date(value);

    // 必須チェック
    if (rules.isRequired) {
        if (value.trim() === "") {
            errorMessages.push("This field is required.");
            return { value, errorMessages };
        }
    }

    // 日付変換チェック
    if (isNaN(date.getTime())) {
        errorMessages.push("This field must be a valid date.");
        return { value, errorMessages };
    }

    // 最早日チェック
    if (rules.earliest !== undefined) {
        if (date < rules.earliest) {
            errorMessages.push(`Date must be on or after ${rules.earliest.toISOString().split("T")[0]}.`);
        }
    }

    // 最遅日チェック
    if (rules.latest !== undefined) {
        if (date > rules.latest) {
            errorMessages.push(`Date must be on or before ${rules.latest.toISOString().split("T")[0]}.`);
        }
    }

    return { value, errorMessages };
}
