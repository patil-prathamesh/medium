import { createPrisma } from "../lib/prisma";
import { Hono } from "hono";
import { decode, sign, verify } from "hono/jwt";
import { hashPassword, verifyPassword } from "../utils/hash";

import type { Bindings, Variables } from "../index";
import z from "zod";

import { signupInput, signinInput } from "@prathamesh_patil/medium-common";

const user = new Hono<{ Bindings: Bindings; Variables: Variables }>();

user.get("/", async (c) => {
  // console.log(await hashPassword("password"))
  console.log(
    await verifyPassword(
      "d1e122c03986ca3ad6b2213cf1fac828:127e2a3c23f2441745d9213e756c0b3ac5db86e56908d4c82135d9c06e7d9753",
      "Testing1*4u",
    ),
  );

  const prisma = c.get("prisma");

  const users = await prisma.user.findMany();
  return c.json(users);
});

user.post("/signup", async (c) => {
  const prisma = c.get("prisma");
  const body = await c.req.json();
  const {success} = signupInput.safeParse(body)
  console.log(success)
  if(!success) {
    return c.json({"message": "body not correct"}, 411)
  }
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: await hashPassword(body.password),
      },
    });

    const token = await sign({ id: user.id }, c.get("jwt_secret"));
    return c.json(token);
  } catch (e: any) {
    if (e.code === "P2002") {
      c.status(409);

      return c.json("user already exists");
    }
  }
});

user.post("/signin", async (c) => {
  const prisma = c.get("prisma");
  const body = await c.req.json();

  const {success} = signinInput.safeParse(body);
  if(!success) {
    return c.json({"message": "body not correct"}, 411)
  }

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (!user || !(await verifyPassword(user.password, body.password))) {
    c.status(403);
    return c.json({ error: "user not found" });
  }

  const token = await sign({ id: user.id }, c.get("jwt_secret"));
  return c.json({ token });
});

export default user;
