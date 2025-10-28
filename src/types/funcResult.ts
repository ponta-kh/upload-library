import type { ValidateResult } from "@/types/validation";

/* parseFileToLines.ts */
export interface ParseFileToLinesResult {
    success: boolean;
    data: string[][];
    errorMessages: string[];
}

/* validateParsedData.ts */
export interface ValidateParsedDataResult {
    values: ValidateResult[];
    errorMessages: string[];
}

/* validateUploadedFile.ts */
export interface UploadValidationResult {
    success: boolean;
    validatedData: ValidateParsedDataResult[];
    hasError: boolean;
    errorMessage: string[];
}
