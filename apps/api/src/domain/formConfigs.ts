export type FieldDef = {
    name: string;
    label: string;
    type: "text" | "number" | "select" | "textarea" | "date";
    required: boolean;
    options?: string[];
    date?: Date;
    min?: number;
};

export const formConfigs: Record<string, FieldDef[]> = {
    repair: [
        { name: "description", label: "Issue description", type: "textarea", required: true },
        { name: "urgency", label: "Urgency", type: "select", required: true, options: ["low", "normal", "rush"] },
        { name: "dateReceived", label: "Date received", type: "date", required: false },
    ],
    setup: [
        { name: "instrument", label: "Instrument", type: "textarea", required: true },
        { name: "notes", label: "Notes", type: "text", required: false },
        { name: "dateSetup", label: "Date setup", type: "date", required: false },
    ],
    custom_build: [
        { name: "description", label: "Description", type: "textarea", required: true },
        { name: "budget", label: "Budget (USD)", type: "number", required: false, min: 100 },
        { name: "dateRequested", label: "Date requested", type: "date", required: false },
    ],
};

export function getFormConfig(jobType: string): FieldDef[] | undefined {
    return Object.hasOwn(formConfigs, jobType) ? formConfigs[jobType] : undefined;
}
