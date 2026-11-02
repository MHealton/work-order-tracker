import { canTransition } from "./domain/workOrder";
console.log(canTransition("INTAKE", "IN_PROGRESS")); // true
console.log(canTransition("INTAKE", "DONE"));        // false