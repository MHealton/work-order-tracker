import { describe, it, expect } from "vitest";
import { STATUSES, allowedTransitions, canTransition, isTerminal } from "../src/domain/workOrder";

describe("canTransition", () => {
    it.each<[typeof STATUSES[number], typeof STATUSES[number], boolean]>([
        ["INTAKE", "IN_PROGRESS", true],
        ["INTAKE", "DONE", false],
        ["IN_PROGRESS", "ON_HOLD", true],
        ["IN_PROGRESS", "DONE", true],
        ["ON_HOLD", "IN_PROGRESS", true],
    ])("should return %s for transition from %s to %s", (from, to, expected) => {
        expect(canTransition(from, to)).toBe(expected);
    });

    it("never lets a status transition to itself", () => {
        for (const status of STATUSES) {
            expect(canTransition(status, status)).toBe(false);
        }
    });
    
    it("treats Done and Cancelled as terminal states", () => {
        expect(allowedTransitions["DONE"].length).toBe(0);
        expect(allowedTransitions["CANCELLED"].length).toBe(0);
    });

    it("allows every non-terminal status to move to CANCELLED", () => {
        for (const status of STATUSES) {
            if (status !== "DONE" && status !== "CANCELLED") {
                expect(canTransition(status, "CANCELLED")).toBe(true);
            }
        }
    });

});

describe("isTerminal", () => {
    it.each<[typeof STATUSES[number], boolean]>([
        ["DONE", true],
        ["INTAKE", false],
    ])("should return %s for status %s", (status, expected) => {
        expect(isTerminal(status)).toBe(expected);
    });
});