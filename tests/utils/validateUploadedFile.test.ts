import { describe, it, expect, vi } from "vitest";
import { validateUploadedFile } from "../../src/utils/validateUploadedFile";
import * as parseFileToLines from "../../src/utils/parseFileToLines";
import * as validateParsedData from "../../src/utils/validateParsedData";
import type { Validate } from "../../src/types/validation";

describe("validateUploadedFile", () => {
    it("should return success false if parsing fails", async () => {
        const file = new File([""], "test.csv");
        const rules: Validate[] = [];
        const param = { file, skipLines: [], row: 1, validateRules: rules };

        vi.spyOn(parseFileToLines, "parseFileToLines").mockResolvedValue({
            success: false,
            data: [],
            errorMessages: ["Parsing failed"],
        });

        const result = await validateUploadedFile(param);

        expect(result.success).toBe(false);
        expect(result.errorMessage).toContain("Parsing failed");
    });

    it("should return success false if column count does not match", async () => {
        const file = new File(["a,b"], "test.csv");
        const rules: Validate[] = [];
        const param = { file, skipLines: [], row: 3, validateRules: rules };

        vi.spyOn(parseFileToLines, "parseFileToLines").mockResolvedValue({
            success: true,
            data: [["a", "b"]],
            errorMessages: [],
        });

        const result = await validateUploadedFile(param);

        expect(result.success).toBe(false);
        expect(result.errorMessage).toContain("Expected 3 columns, but found 2.");
    });

    it("should call validateParsedData and return success true if everything is valid", async () => {
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

        vi.spyOn(parseFileToLines, "parseFileToLines").mockResolvedValue({
            success: true,
            data: parsedData,
            errorMessages: [],
        });

        const validateParsedDataSpy = vi.spyOn(validateParsedData, "validateParsedData").mockReturnValue(validatedData);

        const result = await validateUploadedFile(param);

        expect(result.success).toBe(true);
        expect(result.validatedData).toEqual(validatedData);
        expect(result.errorMessage.length).toBe(0);
        expect(validateParsedDataSpy).toHaveBeenCalledWith(parsedData, rules, undefined);
    });
});
