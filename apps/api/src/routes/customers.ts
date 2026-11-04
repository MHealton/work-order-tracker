import type { FastifyInstance } from "fastify";
import { prisma } from "../db";
import { CustomerInput } from "../domain/customer";
import { sendError } from "../http/errors";

export async function customerRoutes(app: FastifyInstance) {
    app.get("/customers", async () => prisma.customer.findMany({ orderBy: { name: "asc" } }));

    app.get<{ Params: { id: string } }>("/customers/:id", async (req, reply) => {
        const customer = await prisma.customer.findUnique({ where: { id: req.params.id } });
        return customer ?? sendError(reply, 404, "Customer not found");
    });

    app.post("/customers", async (req, reply) => {
        const parsed = CustomerInput.safeParse(req.body);
        if (!parsed.success) { return sendError(reply, 400, "Invalid customer data", parsed.error.issues); }
        
        const customer = await prisma.customer.create({ data: parsed.data });
        return reply.code(201).send(customer);
    });
}