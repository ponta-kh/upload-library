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

/**
 * アップロードされたファイルを解析し、バリデーションを実行する
 * @param param パラメータオブジェクト
 * @param param.file アップロードされたファイル
 * @param param.skipLines スキップする行番号
 * @param param.row 期待される列数
 * @param param.validateRules 各列のバリデーションルール
 * @param param.customRowValidator 行全体に対するカスタムバリデーション関数
 * @returns バリデーション結果
 */
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

    if (parsedResult.data.length > 0 && parsedResult.data[0].length !== row) {
        errorMessages.push(
            `列数が期待値と異なります。期待される列数は ${row} ですが、ファイルには ${parsedResult.data[0].length} 列あります。`,
        );
    }

    // バリデーションチェック前にエラーがあれば早期リターン
    if (errorMessages.length > 0) {
        return {
            success: false,
            validatedData: [],
            errorMessage: errorMessages,
        };
    }

    // データがない場合はバリデーションをスキップして結果を返す
    if (parsedResult.data.length === 0) {
        return {
            success: true,
            validatedData: [],
            errorMessage: [],
        };
    }

    const validatedData = validateParsedData(parsedResult.data, validateRules, customRowValidator);

    const hasError = validatedData.some(
        (r) => r.errorMessages.length > 0 || r.values.some((v) => v.errorMessages.length > 0),
    );

    return {
        success: !hasError,
        validatedData,
        errorMessage: [],
    };
}
