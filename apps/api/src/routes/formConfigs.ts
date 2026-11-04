import type { FastifyInstance } from "fastify";
import { formConfigs, getFormConfig } from "../domain/formConfigs";
import { sendError } from "../http/errors";

export async function formConfigRoutes(app: FastifyInstance) {
    app.get("/form-configs", async () => Object.keys(formConfigs));

    app.get<{ Params: { jobType: string } }>("/form-configs/:jobType", async (req, reply) => {
        return getFormConfig(req.params.jobType) ?? sendError(reply, 404, "Form config not found");
    });
}