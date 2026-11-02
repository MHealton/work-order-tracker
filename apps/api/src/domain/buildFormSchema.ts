import { z } from "zod";
import { getFormConfig, FieldDef } from "./formConfigs";

function baseRule(field: FieldDef): z.ZodType {
    switch (field.type) {
        case "text":
        case "textarea":
            return z.string({ error: `${field.label} is required` }).trim();
        case "number":
            const rule = z.coerce.number({ error: `${field.label} must be a number` });
            return field.min === undefined
                ? rule
                : rule.min(field.min, `${field.label} must be at least ${field.min}`);
        case "date":
            return z.iso.date({ error: `${field.label} must be a valid date` });
        case "select":
            if (!field.options?.length) {
                throw new Error(`Field ${field.name} is of type select but has no options`);
            }
            return z.enum(field.options as [string, ...string[]]);
        default: {
            const unhandled: never = field.type;     
            throw new Error(`Unsupported field type: ${unhandled}`);
        }
    }
}

function fieldToZod(field: FieldDef): z.ZodType {
    const rule = baseRule(field);
    return field.required ? rule : rule.optional();
}

function dropBlanks(data: unknown): unknown {
    if (typeof data !== "object" || data === null || Array.isArray(data)) return data;
    return Object.fromEntries(
        Object.entries(data).filter(
            ([_, value]) => !(typeof value === "string" && value.trim() === "")
        )
    ); 
}

export function buildFormSchema(jobType: string): z.ZodType | null {
  const fields = getFormConfig(jobType);
  if (!fields) return null;

  const shape = Object.fromEntries(fields.map((field) => [field.name, fieldToZod(field)]));
  return z.preprocess(dropBlanks, z.strictObject(shape));
}