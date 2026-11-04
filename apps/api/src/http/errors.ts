import type { FastifyReply } from "fastify";

export type ApiError = { error: string; details: unknown };

export function sendError(reply: FastifyReply, code: number, error: string, details: unknown[] = []) 
{
    return reply.code(code).send({ error, details } satisfies ApiError);
};

export function statusCodeOf(error: unknown): number {
  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    return error.statusCode;
  }
  return 500;
}