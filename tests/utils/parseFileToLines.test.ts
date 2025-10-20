import { describe, it, expect } from "vitest";
import { parseFileToLines } from "../../src/utils/parseFileToLines";

describe("parseFileToLines", () => {
    it("should parse a simple csv file", async () => {
        const file = new File(["a,b,c\n1,2,3"], "test.csv", { type: "text/csv" });
        const result = await parseFileToLines(file, []);
        expect(result.success).toBe(true);
        expect(result.data).toEqual([
            ["a", "b", "c"],
            ["1", "2", "3"],
        ]);
        expect(result.errorMessages.length).toBe(0);
    });

    it("should skip specified lines", async () => {
        const file = new File(["header\na,b,c\n1,2,3\nfooter"], "test.csv", { type: "text/csv" });
        const result = await parseFileToLines(file, [0, -1]); // skip first and last line
        expect(result.success).toBe(true);
        expect(result.data).toEqual([
            ["a", "b", "c"],
            ["1", "2", "3"],
        ]);
    });

    it("should handle empty file", async () => {
        const file = new File([""], "test.csv", { type: "text/csv" });
        const result = await parseFileToLines(file, []);
        expect(result.success).toBe(false);
        expect(result.errorMessages).toEqual(["The file is empty after skipping specified lines."]);
    });

    it("should handle file that becomes empty after skipping lines", async () => {
        const file = new File(["header"], "test.csv", { type: "text/csv" });
        const result = await parseFileToLines(file, [0]);
        expect(result.success).toBe(false);
        expect(result.errorMessages).toEqual(["The file is empty after skipping specified lines."]);
    });
});
