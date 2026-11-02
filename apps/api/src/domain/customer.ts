import { z } from "zod";

export const CustomerInput = z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    phone: z.string().optional(),
});
export type CustomerInput = z.infer<typeof CustomerInput>;