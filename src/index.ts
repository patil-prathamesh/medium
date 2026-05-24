import { Hono } from "hono";
import { cors } from "hono/cors";
import user from "./routes/user";
import { createPrisma } from "./lib/prisma";
import { PrismaClient } from "./generated/prisma/client";
import { logger } from "hono/logger";
import blog from "./routes/blog";

export type Bindings = {
    DATABASE_URL: string,
    JWT_SECRET: string
}

export type Variables = {
    prisma: PrismaClient,
    jwt_secret: string,
    userId: string
}


const app = new Hono<{Bindings: Bindings,Variables: Variables}>();

app.use(logger());
app.use(async (c, next) => {
    const prisma = await createPrisma(c.env.DATABASE_URL);
    c.set('prisma', prisma);
    c.set('jwt_secret', c.env.JWT_SECRET);

    await next();
});

app.get("/", (c) => c.json({status:"ok"}));

app.route("/api/v1/user", user);
app.route("/api/v1/blog", blog);

export default app;