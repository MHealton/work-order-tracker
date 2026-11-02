import { it, describe, expect } from "vitest";
import { CustomerInput } from "../src/domain/customer";

describe("CustomerInput", () => {
    it("should validate a valid customer input", () => {
        const input = {
            name: "John Doe",
            email: "john.doe@example.com"
        };
        const result = CustomerInput.safeParse(input);
        expect(result.success).toBe(true);
    });

    it("should invalidate an input with an empty name", () => {
        const input = {
            name: "",
            email: "john.doe@example.com"
        };
        const result = CustomerInput.safeParse(input);
        expect(result.success).toBe(false);
    });

    it("should invalidate an input with an invalid email", () => {
        const input = {
            name: "John Doe",
            email: "invalid-email"
        };
        const result = CustomerInput.safeParse(input);
        expect(result.success).toBe(false);
    });

    it("should invalidate an input with only whitespace in the name", () => {
        const input = {
            name: "   ",
            email: "john.doe@example.com"
        };
        const result = CustomerInput.safeParse(input);
        expect(result.success).toBe(false);
    });

    it("should invalidate an input with only whitespace in the email", () => {
        const input = {
            name: "John Doe",
            email: "   "
        };
        const result = CustomerInput.safeParse(input);
        expect(result.success).toBe(false);
    });

    it("should validate an input with an optional phone number", () => {
        const input = {
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "123-456-7890"
        };
        const result = CustomerInput.safeParse(input);
        expect(result.success).toBe(true);
    });

    it("should validate an input without a phone number", () => {
        const input = {
            name: "John Doe",
            email: "john.doe@example.com"
        };
        const result = CustomerInput.safeParse(input);
        expect(result.success).toBe(true);
    });

});

