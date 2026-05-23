import { Hono } from "hono";

import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// export function createPrisma(connectionString: string) {
//   const adapter = new PrismaNeon({connectionString});
//   return new PrismaClient({adapter});
// }

// const app = new Hono<{
//   Bindings: {
//     DATABASE_URL: string;
//     JWT_SECRET: string;
//   };
//   Variables: {
//     userId: string;
//   };
// }>();

// app.get("/", async (c) => {
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env.DATABASE_URL,
//   }).$extends(withAccelerate());

//   const users = await prisma.user.findMany();

//   return c.json(users);
// });

// app.post('/api/v1/user/signup', (c) => {
  
// })

// app.get('/api/v1/user/signin', (c) => {

// })

// app.post('/api/v1/blog', (c) => {

// })

// app.put('/api/v1/blog', (c) => {

// })

// app.get('/api/v1/blog/:id', (c) => {

// })

// app.get('/api/v1/blog/bulk', (c) => {

// })

// export default app
