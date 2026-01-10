// Supabase client for the logging database
// Uses separate environment variables to connect to the logging database
import { createClient } from "@supabase/supabase-js";
import type { LoggingDatabase } from "./loggingTypes";

// Use logging-specific env vars if available, otherwise fall back to main database
const LOGGING_URL =
  import.meta.env.VITE_SUPABASE_LOGGING_URL ||
  import.meta.env.VITE_SUPABASE_URL;
const LOGGING_KEY =
  import.meta.env.VITE_SUPABASE_LOGGING_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const loggingSupabase = createClient<LoggingDatabase>(
  LOGGING_URL,
  LOGGING_KEY,
  {
    auth: {
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
