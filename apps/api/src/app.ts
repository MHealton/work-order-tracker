import Fastify from "fastify";
import { sendError, statusCodeOf } from "./http/errors";
import { customerRoutes } from "./routes/customers";
import { workOrderRoutes } from "./routes/workOrders";
import { formConfigRoutes } from "./routes/formConfigs";

export async function buildApp() {
    const app = Fastify ({ logger: true });

    app.setNotFoundHandler((req, reply) => sendError(reply, 404, `No route for ${req.method} ${req.url}`));
    app.setErrorHandler((error, req, reply) => {
        req.log.error(error);
        const code = statusCodeOf(error);
        return sendError(
            reply, 
            code,
            code < 500 && error instanceof Error ? error.message : "Internal server error",
        );
    });

    app.get("/health", async () => ({ status: "ok" }));
    await app.register(customerRoutes);
    await app.register(workOrderRoutes);
    await app.register(formConfigRoutes);

    return app;
}