// prisma.config.ts
import path from 'path';
import dotenv from 'dotenv';

// Força o carregamento do .env antes de qualquer outra coisa
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "src/infra/prisma/schema.prisma",
  migrations: {
    path: "src/infra/prisma/migrations",
  },
  datasource: {
    url: process.env["POSTGRES_DATABASE_URL"],
  },
});