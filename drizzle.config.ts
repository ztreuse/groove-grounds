import { defineConfig } from "drizzle-kit";

try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local yet: `db:generate` still works without a database.
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  // Migrations use the session pooler; the app uses the transaction pooler.
  dbCredentials: { url: process.env.DIRECT_URL ?? "" },
  // Supabase owns the auth schema and its roles; only manage public.
  schemaFilter: ["public"],
  entities: { roles: { provider: "supabase" } },
});
