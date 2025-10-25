import { describe, it, expect, vi } from "vitest";
import { validateUploadedFile } from "../../src/utils/validateUploadedFile";
import * as parseFileToLines from "../../src/utils/parseFileToLines";
import * as validateParsedData from "../../src/utils/validateParsedData";
import type { Validate } from "../../src/types/validation";

describe("validateUploadedFile", () => {
    it("CSVの解析に失敗した場合、success が false を返すこと", async () => {
        const file = new File([""], "test.csv");
        const rules: Validate[] = [];
        const param = { file, skipLines: [], row: 1, validateRules: rules };

        // parseFileToLines をモックして解析失敗を再現
        vi.spyOn(parseFileToLines, "parseFileToLines").mockResolvedValue({
            success: false,
            data: [],
            errorMessages: ["Parsing failed"],
        });

        const result = await validateUploadedFile(param);

        expect(result.success).toBe(false);
        expect(result.errorMessage).toContain("Parsing failed");
    });

    it("列数が期待値と一致しない場合、success が false を返すこと", async () => {
        const file = new File(["a,b"], "test.csv");
        const rules: Validate[] = [];
        const param = { file, skipLines: [], row: 3, validateRules: rules };

        // パース結果のデータ列数を 2 にして、期待値 3 との不一致を再現
        vi.spyOn(parseFileToLines, "parseFileToLines").mockResolvedValue({
            success: true,
            data: [["a", "b"]],
            errorMessages: [],
        });

        const result = await validateUploadedFile(param);

        expect(result.success).toBe(false);
        expect(result.errorMessage).toContain(
            "列数が期待値と異なります。期待される列数は 3 ですが、ファイルには 2 列あります。",
        );
    });

    it("すべて正常な場合、validateParsedData が呼ばれ success が true を返すこと", async () => {
        const file = new File(["a,b"], "test.csv");
        const rules: Validate[] = [
            { type: "string", isRequired: true },
            { type: "string", isRequired: true },
        ];
        const param = { file, skipLines: [], row: 2, validateRules: rules };

        const parsedData = [["a", "b"]];
        const validatedData = [
            {
                values: [
                    { value: "a", errorMessages: [] },
                    { value: "b", errorMessages: [] },
                ],
                errorMessages: [],
            },
        ];

        // ファイル解析は成功としてモック
        vi.spyOn(parseFileToLines, "parseFileToLines").mockResolvedValue({
            success: true,
            data: parsedData,
            errorMessages: [],
        });

        // validateParsedData のモックを作成
        const validateParsedDataSpy = vi.spyOn(validateParsedData, "validateParsedData").mockReturnValue(validatedData);

        const result = await validateUploadedFile(param);

        // 成功した結果を検証
        expect(result.success).toBe(true);
        expect(result.validatedData).toEqual(validatedData);
        expect(result.errorMessage.length).toBe(0);

        // validateParsedData が正しい引数で呼び出されたことを確認
        expect(validateParsedDataSpy).toHaveBeenCalledWith(parsedData, rules, undefined);
    });
});
