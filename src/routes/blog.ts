import { Hono } from "hono";

import type { Bindings, Variables } from "../index";
import { verify } from "hono/jwt";
import {
  createBlogInput,
  updateBlogInput,
} from "@prathamesh_patil/medium-common";

const blog = new Hono<{ Bindings: Bindings; Variables: Variables }>();

blog.use("*", async (c, next) => {
  console.log("middleware");
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (!token) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }
  try {
    const data = await verify(token, c.env.JWT_SECRET, "HS256");
    c.set("userId", String(data.id));
    console.log(c.get("userId"));
    await next();
  } catch (e) {
    c.status(401);
    return c.json({ error: "unauthorized" });
  }
});

blog.get("/", async (c) => {
  const prisma = c.get("prisma");

  const posts = await prisma.post.findMany();
  return c.json(posts);
});

blog.post("/", async (c) => {
  const prisma = c.get("prisma");
  const body = await c.req.json();
  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    return c.json({ message: "body not correct" }, 411);
  }
  const blog = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: c.get("userId"),
    },
  });

  return c.json({ id: blog.id });
});

blog.put("/", async (c) => {
  const prisma = c.get("prisma");
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    return c.json({ message: "body not correct" }, 411);
  }
  const blog = await prisma.post.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return c.json({ id: blog.id });
});

blog.get("/bulk", async (c) => {
  console.log("00000");
  const prisma = c.get("prisma");
  try {
    const limit = c.req.query("limit");
    const offset = c.req.query("offset");
    console.log(limit, offset);
    const blogs = await prisma.post.findMany({
      skip: Number(offset) || 0,
      take: Number(limit) || 100,
    });
    c.status(200);
    return c.json({ success: true, length: blogs.length, blogs: blogs });
  } catch (error) {
    console.log(c.req.path, " -> ", error);
    c.status(500);
    return c.json({ error: "internal server error" });
  }
});

blog.get("/:id", async (c) => {
  const prisma = c.get("prisma");
  try {
    const blog = await prisma.post.findFirst({
      where: {
        id: c.req.param("id"),
      },
    });
    c.status(200);
    return c.json(blog);
  } catch (error) {
    console.log(c.req.path, " -> ", error);
    c.status(500);
    c.json({ error: "internal server error" });
  }
});

export default blog;
