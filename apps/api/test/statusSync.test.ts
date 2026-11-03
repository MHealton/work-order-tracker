import { describe, it, expect } from 'vitest';
import { Status as DbStatus } from '../src/generated/prisma/enums';
import { Status } from '../src/domain/workOrder';

describe('Status definitions', () => {
    it("match between prisma and zod", () => {
        const dbValues = Object.values(DbStatus).sort();
        const zodValues = [...Status.options].sort();
        expect(dbValues).toEqual(zodValues);
    });
});