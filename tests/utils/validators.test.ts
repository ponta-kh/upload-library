import { describe, it, expect } from "vitest";
import { validateString, validateNumber, validateDate } from "../../src/utils/validators";

describe("validators", () => {
    describe("validateString", () => {
        it("should validate required string", () => {
            const rule = { type: "string", isRequired: true };
            expect(validateString("", rule).errorMessages).toContain("This field is required.");
            expect(validateString(" ", rule).errorMessages).toContain("This field is required.");
            expect(validateString("a", rule).errorMessages.length).toBe(0);
        });

        it("should validate minLength", () => {
            const rule = { type: "string", minLength: 3 };
            expect(validateString("ab", rule).errorMessages).toContain("Minimum length is 3.");
            expect(validateString("abc", rule).errorMessages.length).toBe(0);
        });

        it("should validate maxLength", () => {
            const rule = { type: "string", maxLength: 3 };
            expect(validateString("abcd", rule).errorMessages).toContain("Maximum length is 3.");
            expect(validateString("abc", rule).errorMessages.length).toBe(0);
        });
    });

    describe("validateNumber", () => {
        it("should validate required number", () => {
            const rule = { type: "number", isRequired: true };
            expect(validateNumber("", rule).errorMessages).toContain("This field is required.");
        });

        it("should validate numeric value", () => {
            const rule = { type: "number" };
            expect(validateNumber("abc", rule).errorMessages).toContain("This field must be a number.");
            expect(validateNumber("1.2.3", rule).errorMessages).toContain("This field must be a number.");
            expect(validateNumber("123", rule).errorMessages.length).toBe(0);
            expect(validateNumber("1,000", rule).errorMessages.length).toBe(0);
        });

        it("should validate minValue", () => {
            const rule = { type: "number", minValue: 10 };
            expect(validateNumber("9", rule).errorMessages).toContain("Minimum value is 10.");
            expect(validateNumber("10", rule).errorMessages.length).toBe(0);
        });

        it("should validate maxValue", () => {
            const rule = { type: "number", maxValue: 10 };
            expect(validateNumber("11", rule).errorMessages).toContain("Maximum value is 10.");
            expect(validateNumber("10", rule).errorMessages.length).toBe(0);
        });

        it("should validate maxIntegerDigits", () => {
            const rule = { type: "number", maxIntegerDigits: 3 };
            expect(validateNumber("1234", rule).errorMessages).toContain("Integer part can have at most 3 digits.");
            expect(validateNumber("123", rule).errorMessages.length).toBe(0);
            expect(validateNumber("123.45", rule).errorMessages.length).toBe(0);
        });

        it("should validate maxDecimalDigits", () => {
            const rule = { type: "number", maxDecimalDigits: 2 };
            expect(validateNumber("1.234", rule).errorMessages).toContain("Decimal part can have at most 2 digits.");
            expect(validateNumber("1.23", rule).errorMessages.length).toBe(0);
        });
    });

    describe("validateDate", () => {
        it("should validate required date", () => {
            const rule = { type: "date", isRequired: true };
            expect(validateDate("", rule).errorMessages).toContain("This field is required.");
        });

        it("should validate date format", () => {
            const rule = { type: "date" };
            expect(validateDate("not-a-date", rule).errorMessages).toContain("This field must be a valid date.");
            expect(validateDate("2025-01-01", rule).errorMessages.length).toBe(0);
        });

        it("should validate earliest date", () => {
            const earliest = new Date("2025-01-10");
            const rule = { type: "date", earliest };
            expect(validateDate("2025-01-09", rule).errorMessages).toContain("Date must be on or after 2025-01-10.");
            expect(validateDate("2025-01-10", rule).errorMessages.length).toBe(0);
        });

        it("should validate latest date", () => {
            const latest = new Date("2025-01-10");
            const rule = { type: "date", latest };
            expect(validateDate("2025-01-11", rule).errorMessages).toContain("Date must be on or before 2025-01-10.");
            expect(validateDate("2025-01-10", rule).errorMessages.length).toBe(0);
        });
    });
});
