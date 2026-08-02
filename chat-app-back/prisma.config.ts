import path from 'path';
import dotenv from 'dotenv';

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