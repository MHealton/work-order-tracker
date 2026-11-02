export type FieldDef = {
	name: string; label: string;
	type: "text" | "number" | "select" | "textarea";
	required: boolean; options?: string[];
};

export const formConfigs: Record<string, FieldDef[]> = {
	repair: [
		{ name: "issue", label: "Issue description", type: "textarea", required: true },
		{ name: "urgency", label: "Urgency", type: "select", required: true, options: ["low", "normal", "rush"] },
	],
	setup: [
		{ name: "instrument", label: "Instrument", type: "text", required: true },
		{ name: "notes", label: "Notes", type: "textarea", required: false },
	],
	custom_build: [
		{ name: "description", label: "Build description", type: "textarea", required: true },
		{ name: "budget", label: "Budget (USD)", type: "number", required: true },
	]
}
