import { z } from "zod";

export const Status = z.enum(["INTAKE", "IN_PROGRESS", "ON_HOLD", "DONE", "CANCELLED"]);
export type Status = z.infer<typeof Status>;

export const allowedTransitions: Record<Status, Status[]> = {
	INTAKE: ["IN_PROGRESS", "CANCELLED"],
	IN_PROGRESS: ["ON_HOLD", "DONE", "CANCELLED"],
	ON_HOLD: ["IN_PROGRESS", "CANCELLED"],
	DONE: [],
	CANCELLED: [],
};

export const canTransition = (from: Status, to: Status) =>
	allowedTransitions[from].includes(to);
