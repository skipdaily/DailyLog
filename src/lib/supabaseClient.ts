import { createClient } from '@supabase/supabase-js';

// For development/testing purposes
const FALLBACK_SUPABASE_URL = 'https://nfnbdiymakeppwviwgtd.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mbmJkaXltYWtlcHB3dml3Z3RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0Njc1MTEsImV4cCI6MjA2NjA0MzUxMX0.IJBYj2k8l1Y5ekGcnhFob1eYx4TbKNS1SvdEZEtL2Rs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
