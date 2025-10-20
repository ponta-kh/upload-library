import { describe, it, expect } from "vitest";
import { validateParsedData } from "../../src/utils/validateParsedData";
import type { Validate } from "../../src/types/validation";

describe("validateParsedData", () => {
    it("should validate data based on rules", () => {
        const data = [
            ["hello", "123", "2025-01-01"],
            ["", "abc", "not-a-date"],
        ];
        const validateRules: Validate[] = [
            { type: "string", isRequired: true },
            { type: "number", isRequired: true },
            { type: "date", isRequired: true },
        ];

        const result = validateParsedData(data, validateRules);

        expect(result.length).toBe(2);
        // Row 1
        expect(result[0].values[0].errorMessages.length).toBe(0);
        expect(result[0].values[1].errorMessages.length).toBe(0);
        expect(result[0].values[2].errorMessages.length).toBe(0);
        expect(result[0].errorMessages.length).toBe(0);

        // Row 2
        expect(result[1].values[0].errorMessages).toContain("This field is required.");
        expect(result[1].values[1].errorMessages).toContain("This field must be a number.");
        expect(result[1].values[2].errorMessages).toContain("This field must be a valid date.");
        expect(result[1].errorMessages.length).toBe(0);
    });

    it("should use custom row validator", () => {
        const data = [["a", "b"]];
        const validateRules: Validate[] = [
            { type: "string", isRequired: true },
            { type: "string", isRequired: true },
        ];
        const customRowValidator = (dataRow: string[]) => {
            if (dataRow[0] === "a" && dataRow[1] === "b") {
                return ["Custom error for a and b"];
            }
            return [];
        };

        const result = validateParsedData(data, validateRules, customRowValidator);

        expect(result.length).toBe(1);
        expect(result[0].errorMessages).toEqual(["Custom error for a and b"]);
    });

    it("should handle missing validation rule for a column", () => {
        const data = [["a", "b"]];
        const validateRules: Validate[] = [{ type: "string", isRequired: true }]; // Rule only for first column

        const result = validateParsedData(data, validateRules);

        expect(result.length).toBe(1);
        expect(result[0].values[0].errorMessages.length).toBe(0);
        expect(result[0].values[1].errorMessages).toContain("No validation rules provided for this column.");
    });

    it("should handle unknown validation type", () => {
        const data = [["a"]];
        const validateRules: Validate[] = [{ type: "unknown" } as any];

        const result = validateParsedData(data, validateRules);

        expect(result.length).toBe(1);
        expect(result[0].values[0].errorMessages).toContain("Unknown validation type.");
    });
});
