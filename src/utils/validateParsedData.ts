import type { Validate } from "@/types/validation";
import type { ValidateParsedDataResult } from "@/types/funcResult";

import { isValidateString, isValidateNumber, isValidateDate } from "@/utils/typeGuards";
import { validateDate, validateNumber, validateString } from "./validators";

/**
 * 解析済みのデータ配列をバリデーションする
 * @param data 解析済みのデータ (文字列の2次元配列)
 * @param validateRules 各列のバリデーションルール
 * @param customRowValidator 行全体に対するカスタムバリデーション関数
 * @returns バリデーション結果の配列
 */
export function validateParsedData(
    data: string[][],
    validateRules: Validate[],
    customRowValidator?: (dataRow: string[]) => string[],
): ValidateParsedDataResult[] {
    return data.map((dataRow) => {
        // 各セルの値をバリデーション
        const validatedRow = dataRow.map((cell, colIndex) => {
            const rules = validateRules[colIndex];
            if (!rules) {
                return { value: cell, errorMessages: ["この列に対するバリデーションルールが設定されていません"] };
            }

            if (isValidateString(rules)) return validateString(cell, rules);
            if (isValidateNumber(rules)) return validateNumber(cell, rules);
            if (isValidateDate(rules)) return validateDate(cell, rules);

            return { value: cell, errorMessages: ["不明なバリデーションタイプです"] };
        });

        // 独自チェックファンクション
        const customRowErrors = customRowValidator ? customRowValidator(dataRow) : [];

        return {
            values: validatedRow,
            errorMessages: customRowErrors,
        };
    });
}
