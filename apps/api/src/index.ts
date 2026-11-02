import { StatusChange } from "./domain/workOrder";

const input: unknown = JSON.parse('{"status":"DONE"}');
const result = StatusChange.safeParse(input);

if (result.success) {
  console.log("Valid:", result.data.status);
} else {
  console.log("Invalid:", result.error.issues);
}