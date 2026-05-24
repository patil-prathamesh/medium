import { Hono } from "hono";

import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

export function createPrisma(connectionString: string) {
  const adapter = new PrismaNeon({connectionString});
  return new PrismaClient({adapter});
}
