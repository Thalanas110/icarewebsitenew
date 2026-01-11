/**
 * Supabase client for the LOGGING database (separate Supabase project)
 *
 * SECURITY MODEL:
 * This client connects to an isolated logging database that only stores activity logs.
 * Since this is a separate Supabase project, authentication tokens from the main app
 * don't carry over - all requests appear as 'anon' role.
 *
 * Security is maintained through:
 * 1. Database isolation - only contains activity_logs table, no sensitive data
 * 2. Application-layer admin checks - viewing/deleting requires isAdmin from main DB
 * 3. Immutable logs - UPDATE operations are not permitted via RLS
 * 4. Internal use only - logging credentials are only used by the admin dashboard
 *
 * This client intentionally does NOT persist auth sessions since cross-project
 * auth doesn't work anyway.
 */
import { createClient } from "@supabase/supabase-js";
import type { LoggingDatabase } from "./loggingTypes";

// Logging database credentials (separate Supabase project)
// Falls back to main database if logging-specific vars are not set
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
      // No auth persistence needed - we use anon access with RLS policies
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
