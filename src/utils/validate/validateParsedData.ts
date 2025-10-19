import type { Validate, ValidateResult } from "@/types/validation";

import { isValidateString, isValidateNumber, isValidateDate } from "@/utils/typeGuards";
import { validateDate, validateNumber, validateString } from "./validators";

interface Result {
    values: ValidateResult[];
    errorMessages: string[];
}

export function validateParsedData(
    data: string[][],
    validateRules: Validate[],
    customRowValidator?: (dataRow: string[]) => string[],
): Result[] {
    return data.map((dataRow) => {
        // 各セルの値をバリデーション
        const validatedRow = dataRow.map((cell, colIndex) => {
            const rules = validateRules[colIndex];
            if (!rules) {
                return { value: cell, errorMessages: ["No validation rules provided for this column."] };
            }

            if (isValidateString(rules)) return validateString(cell, rules);
            if (isValidateNumber(rules)) return validateNumber(cell, rules);
            if (isValidateDate(rules)) return validateDate(cell, rules);

            return { value: cell, errorMessages: ["Unknown validation type."] };
        });

        // 独自チェックファンクション
        const customRowErrors = customRowValidator ? customRowValidator(dataRow) : [];

        return {
            values: validatedRow,
            errorMessages: customRowErrors,
        };
    });
}
