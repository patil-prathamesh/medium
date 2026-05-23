import { Hono } from "hono";
import { cors } from "hono/cors";
// import user from "./routes/user";

export type Bindings = {
    DATABASE_URL: string
}

const app = new Hono<{Bindings: Bindings}>();

// app.use("*", cors());
app.get("/", (c) => c.json({status:"ok"}));
// app.route("/api/v1/user", user);
// app.route("/api/v1/blog", blog);