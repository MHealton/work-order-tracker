import { z } from "zod";
import { formConfigs, type FieldDef } from "./formConfigs";

function baseRule(field: FieldDef): z.ZodType {
	switch (field.type) {
		case "text":
		case "textarea":
			return z.string({ error: `${field.label} is required` }).trim();
		case "number":
			return z.coerce.number({error: `${field.label} must be a number` });
		case "select":
			if (!field.options?.length) {
				throw new Error(`Select field "${field.name}" has no options`);
			}
			return z.enum(field.options as [string, ...string[]]);
		default: {
			const unhandled: never = field.type;
			throw new Error(`Unhandled field type: ${unhandled}`);
		}
	}
}

function fieldToZod(field: FieldDef): z.ZodType {
	const rule = baseRule(field);
	return field.required ? rule : rule.optional();
}

function dropBlanks(data: unknown): unknown {
	if (typeof data !== "object" || data === null || Array.isArray(data))
return data;
	return Object.fromEntries(
	Object.entries(data.filter(
			([, value]) => !(typeof value === "string" && value.trim() === ""),
		),
	);
}

export function buildFormSchema(jobType: string): z.ZodType | null {
	if (!Object.hasOwn(formConfigs, jobType)) return null;

	const shape = Object.fromEntries(
		formConfigs[jobType].map((field) => [field.name, fieldToZod(field)]),
	);

	return z.preprocess(dropBlanks, z.strictObject(shape));
}


