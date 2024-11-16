import { env } from '@/configs/env';
import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema/index.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config;
