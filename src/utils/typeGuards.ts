import type { Validate, ValidateString, ValidateNumber, ValidateDate } from "@/types/validation";

/**
 * ValidateString型かどうかを判定する型ガード
 * @param v バリデーションルールオブジェクト
 * @returns ValidateString型であればtrue
 */
export function isValidateString(v: Validate): v is ValidateString {
    return v.type === "string";
}

/**
 * ValidateNumber型かどうかを判定する型ガード
 * @param v バリデーションルールオブジェクト
 * @returns ValidateNumber型であればtrue
 */
export function isValidateNumber(v: Validate): v is ValidateNumber {
    return v.type === "number";
}

/**
 * ValidateDate型かどうかを判定する型ガード
 * @param v バリデーションルールオブジェクト
 * @returns ValidateDate型であればtrue
 */
export function isValidateDate(v: Validate): v is ValidateDate {
    return v.type === "date";
}
