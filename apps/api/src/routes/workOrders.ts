import type { FastifyInstance } from "fastify";
import { prisma } from "../db";
import { Prisma } from "../generated/prisma/client";
import { CreateWorkOrder, Status, StatusChange, canTransition } from "../domain/workOrder";
import { sendError } from "../http/errors";
import { buildFormSchema } from "../domain/buildFormSchema";

export async function workOrderRoutes(app: FastifyInstance) {
    app.get<{ Querystring: { status?: string } }>("/work-orders", async (req, reply) => {
        const filter = req.query.status === undefined ? undefined : Status.safeParse(req.query.status);
        if (filter && !filter.success) return sendError(reply, 400, "Unknown status filter");

        return prisma.workOrder.findMany({
            where: { status: filter?.data },
            include: { customer: true },
            orderBy: { createdAt: "desc" },
        });
    });

    app.get<{ Params: { id: string } }>("/work-orders/:id", async (req, reply) => {
        const order = await prisma.workOrder.findUnique({
            where: { id: req.params.id },
            include: { customer: true },
        });
        return order ?? sendError(reply, 404, "Work order not found");  
    });

    app.post("/work-orders", async (req, reply) => {
        const body = CreateWorkOrder.safeParse(req.body);
        if (!body.success) return sendError(reply, 400, "Invalid work order", body.error.issues);

        const formSchema = buildFormSchema(body.data.jobType);
        if (!formSchema) return sendError(reply, 400, "Unknown job type");

        const form = formSchema.safeParse(body.data.formData);
        if (!form.success) return sendError(reply, 400, "Invalid form data", form.error.issues);

        const customer = await prisma.customer.findUnique({ where: { id: body.data.customerId } });
        if (!customer) return sendError(reply, 400, "Customer does not exist");

        const order = await prisma.workOrder.create({
            data: {
                customerId: customer.id,
                jobType: body.data.jobType,
                formData: form.data as Prisma.InputJsonValue,
            },
        });
        return reply.code(201).send(order);
    });

    app.patch<{ Params: { id: string } }>("/work-orders/:id/status", async (req, reply) => {
        const parsed = StatusChange.safeParse(req.body);
        if (!parsed.success) return sendError(reply, 400, "Invalid status", parsed.error.issues);

        const order = await prisma.workOrder.findUnique({ where: { id: req.params.id } });
        if (!order) return sendError(reply, 404, "Work order not found");

        const next = parsed.data.status;
        if (!canTransition(order.status, next)) {
            return sendError(reply, 400, `Cannot transition from ${order.status} to ${next}`);
        }

        return prisma.workOrder.update({ where: { id: order.id }, data: { status: next } });
    });

}