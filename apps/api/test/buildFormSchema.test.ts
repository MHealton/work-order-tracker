import { describe, it, expect } from "vitest";
import { buildFormSchema } from "../src/domain/buildFormSchema";

const repair = buildFormSchema("repair");
const setup = buildFormSchema("setup");
const custom = buildFormSchema("custom_build");

describe("BuildFormSchema", () => {
    it.each([
        ["valid repair", repair, { description: "Fix the issue", urgency: "normal" }, true],
        ["invalid repair missing description", repair, { urgency: "normal" }, false],
        ["invalid repair missing urgency", repair, { description: "Fix the issue" }, false],
        ["valid setup", setup, { instrument: "Guitar", notes: "Some notes" }, true],
        ["invalid setup missing instrument", setup, { notes: "Some notes" }, false],
        ["valid custom build", custom, { description: "Custom build", budget: 1000 }, true],
        ["invalid custom build missing description", custom, { budget: 1000 }, false],
        ["budget below minimum", custom, { description: "x", budget: "50" }, false],
        ["budget at minimum", custom, { description: "x", budget: "100" }, true],
        ["budget above minimum", custom, { description: "x", budget: "150" }, true],
        ["non-numeric budget in custom build", custom, { description: "Custom build", budget: "not a number" }, false],
    ])("%s", (_name, schema, input, expected) => {
        expect(schema).not.toBeNull();
        if (schema === null) return;
        expect(schema.safeParse(input).success).toBe(expected);
    });

    it("invalidates a custom build with a budget below the minimum", () => {
        expect(custom).not.toBeNull();
        if (custom === null) return;
        const results = custom.safeParse({ description: "Custom build", budget: 50 });
        expect(results.success).toBe(false);
    });

    it("coerces numeric strings to numbers", () => {
        expect(custom).not.toBeNull();
        if (custom === null) return;
        const results = custom.safeParse({ description: "Custom build", budget: "450" });
        expect(results.success).toBe(true);
        if (results.success) {
            expect(results.data).toMatchObject({ budget: 450 });
        }
    });

    it("returns null for unknown job types", () => {
        expect(buildFormSchema("nope")).toBeNull();
        expect(buildFormSchema("unknown")).toBeNull();
    });
});