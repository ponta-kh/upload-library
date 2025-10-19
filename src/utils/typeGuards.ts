import type { Validate, ValidateString, ValidateNumber, ValidateDate } from "@/types/validation";

export function isValidateString(v: Validate): v is ValidateString {
    return v.type === "string";
}

export function isValidateNumber(v: Validate): v is ValidateNumber {
    return v.type === "number";
}

export function isValidateDate(v: Validate): v is ValidateDate {
    return v.type === "date";
}
