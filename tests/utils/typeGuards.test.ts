import { describe, it, expect } from "vitest";
import { isValidateString, isValidateNumber, isValidateDate } from "../../src/utils/typeGuards";
import type { ValidateString, ValidateNumber, ValidateDate } from "../../src/types/validation";

describe("typeGuards", () => {
    it("isValidateString should correctly identify ValidateString", () => {
        const validateString: ValidateString = { type: "string", isRequired: true };
        const validateNumber: ValidateNumber = { type: "number", isRequired: true };
        const validateDate: ValidateDate = { type: "date", isRequired: true };

        expect(isValidateString(validateString)).toBe(true);
        expect(isValidateString(validateNumber)).toBe(false);
        expect(isValidateString(validateDate)).toBe(false);
    });

    it("isValidateNumber should correctly identify ValidateNumber", () => {
        const validateString: ValidateString = { type: "string", isRequired: true };
        const validateNumber: ValidateNumber = { type: "number", isRequired: true };
        const validateDate: ValidateDate = { type: "date", isRequired: true };

        expect(isValidateNumber(validateString)).toBe(false);
        expect(isValidateNumber(validateNumber)).toBe(true);
        expect(isValidateNumber(validateDate)).toBe(false);
    });

    it("isValidateDate should correctly identify ValidateDate", () => {
        const validateString: ValidateString = { type: "string", isRequired: true };
        const validateNumber: ValidateNumber = { type: "number", isRequired: true };
        const validateDate: ValidateDate = { type: "date", isRequired: true };

        expect(isValidateDate(validateString)).toBe(false);
        expect(isValidateDate(validateNumber)).toBe(false);
        expect(isValidateDate(validateDate)).toBe(true);
    });
});
