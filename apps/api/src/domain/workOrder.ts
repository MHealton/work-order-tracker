import { z } from "zod";

export const Status = z.enum(["INTAKE", "IN_PROGRESS", "ON_HOLD", "DONE", "CANCELLED"]);
export type Status = z.infer<typeof Status>;
export const STATUSES = Status.options;
export const StatusChange = z.object({ status: Status});


export type WorkOrder = {
    id: string;
    customerId: string;
    jobType: string;
    status: Status;
    formData: Record<string, unknown>;
    createdAt: Date;
};

export const allowedTransitions: Record<Status, readonly Status[]> = {
    INTAKE: ["IN_PROGRESS", "CANCELLED"],
    IN_PROGRESS: ["ON_HOLD", "DONE", "CANCELLED"],
    ON_HOLD: ["IN_PROGRESS", "CANCELLED"],
    DONE: [],
    CANCELLED: [],
};

export function canTransition(from: Status, to: Status): boolean {
    return allowedTransitions[from].includes(to);
};

export function isTerminal(status: Status): boolean {
    return allowedTransitions[status].length === 0;
};

export const CreateWorkOrder = z.object({
    customerId: z.string().min(1),
    jobType: z.string().min(1),
    formData: z.unknown(),
});
