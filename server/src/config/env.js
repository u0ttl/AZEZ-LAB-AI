import { cleanEnv, str, port, bool } from "envalid";

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices:["development","test","production"], default:"development" }),
  PORT: port({ default:8787 }),
  DATABASE_URL: str({ default:"postgresql://azez:azez_dev_password@127.0.0.1:5432/azez_lab_ai?schema=public" }),
  REDIS_URL: str({ default:"redis://127.0.0.1:6379" }),
  JWT_SECRET: str({ default:"development-only-change-me-before-production" }),
  STORAGE_ROOT: str({ default:"./storage/objects" }),
  AI_PROVIDER: str({ choices:["mock","openai"], default:"mock" }),
  OPENAI_API_KEY: str({ default:"" }),
  OPENAI_MODEL: str({ default:"gpt-5.2" }),
  AI_TIMEOUT_MS: port({ default:45000 }),
  REQUIRE_DURABLE_INFRA: bool({ default:false })
});

if (env.NODE_ENV === "production") {
  if (env.JWT_SECRET.includes("development-only")) throw new Error("PRODUCTION_JWT_SECRET_REQUIRED");
  if (!env.REQUIRE_DURABLE_INFRA) throw new Error("PRODUCTION_REQUIRES_DURABLE_INFRA");
  if (env.AI_PROVIDER==="openai" && !env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY_REQUIRED");
}
