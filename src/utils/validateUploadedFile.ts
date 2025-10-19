import type { Validate, ValidateResult } from "@/types/validation";
import { parseFileToLines } from "./parseFileToLines";
import { validateParsedData } from "./validateParsedData";

export interface validateUploadedFileParam {
    file: File;
    skipLines: number[];
    row: number;
    validateRules: Validate[];
    customRowValidator?: (dataRow: string[]) => string[];
}

export interface UploadValidationResult {
    success: boolean;
    validatedData: {
        values: ValidateResult[];
        errorMessages: string[];
    }[];
    errorMessage: string[];
}

export async function validateUploadedFile({
    file,
    skipLines,
    row,
    validateRules,
    customRowValidator,
}: validateUploadedFileParam): Promise<UploadValidationResult> {
    const errorMessages: string[] = [];

    const parsedResult = await parseFileToLines(file, skipLines);

    if (!parsedResult.success) {
        errorMessages.push(...parsedResult.errorMessages);
    }

    if (parsedResult.data[0].length !== row) {
        errorMessages.push(`Expected ${row} columns, but found ${parsedResult.data[0].length}.`);
    }

    // バリデーションチェック前にエラーがあれば早期リターン
    if (errorMessages.length > 0) {
        return {
            success: false,
            validatedData: [],
            errorMessage: errorMessages,
        };
    }

    const validatedData = validateParsedData(parsedResult.data, validateRules, customRowValidator);

    return {
        success: true,
        validatedData,
        errorMessage: [],
    };
}
