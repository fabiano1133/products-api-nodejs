"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/env/index.ts
var import_dotenv = require("dotenv");
var import_zod = require("zod");
if (process.env.NODE_ENV === "test") {
  (0, import_dotenv.config)({ path: ".env.test" });
} else {
  (0, import_dotenv.config)();
}
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "production", "test"]).default("development"),
  DATABASE_CLIENT: import_zod.z.enum(["sqlite", "pg"]),
  DATABASE_URL: import_zod.z.string(),
  APP_HTTP_PORT: import_zod.z.coerce.number().default(8181)
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error(`Invalid Variable: ${JSON.stringify(_env.error.format())}`);
  throw new Error("Invalid environment variables");
}
var env = _env.data;

// src/app.ts
var import_fastify = require("fastify");

// src/routes/products.ts
var import_node_crypto = __toESM(require("crypto"));

// src/database.ts
var import_knex = require("knex");
var config2 = {
  client: env.DATABASE_CLIENT,
  connection: env.DATABASE_CLIENT === "sqlite" ? {
    filename: env.DATABASE_URL
  } : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations"
  }
};
var knex = (0, import_knex.knex)(config2);

// src/routes/products.ts
var import_zod2 = require("zod");
async function ProductsRoutes(app2) {
  app2.post("/", async (req, res) => {
    const createProductSchema = import_zod2.z.object({
      name: import_zod2.z.string(),
      description: import_zod2.z.string(),
      quantity: import_zod2.z.number()
    });
    const { name, description, quantity } = createProductSchema.parse(req.body);
    await knex("products").insert({
      id: import_node_crypto.default.randomUUID(),
      name,
      description,
      quantity
    }).returning("*");
    return res.status(201).send();
  });
  app2.get("/", async () => {
    const products = await knex("products").select("*");
    return { products, total: products.length };
  });
  app2.get("/summary", async () => {
    const productsSummary = await knex("products").select("name");
    return { productsSummary };
  });
  app2.get("/:id", async (req) => {
    const selectProductSchema = import_zod2.z.object({
      id: import_zod2.z.string().uuid()
    });
    const { id } = selectProductSchema.parse(req.params);
    const product = await knex("products").where({ id }).first();
    return { product };
  });
}

// src/app.ts
var app = (0, import_fastify.fastify)();
app.register(ProductsRoutes, {
  prefix: "/products"
});

// src/server.ts
app.listen({
  port: env.APP_HTTP_PORT,
  host: "RENDER" in process.env ? "0.0.0.0" : "localhost"
}).then(() => {
  console.log(`WEB APPLICATION IS RUNNING`);
});
