import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
    BETTER_AUTH_URL: z.string().url(),
    DATABASE_URL: z.string().url(),
    AUTH_GITHUB_CLIENT_ID: z
      .string()
      .min(1, "AUTH_GITHUB_CLIENT_ID is required"),
    AUTH_GITHUB_CLIENT_SECRET: z
      .string()
      .min(1, "AUTH_GITHUB_CLIENT_SECRET is required"),
  },

  runtimeEnv: process.env,
});
