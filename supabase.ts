import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fxdngadunxvwvnzmngjl.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4ZG5nYWR1bnh2d3Zuem1uZ2psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NjE0MzAsImV4cCI6MjA5NDIzNzQzMH0.g8gV8fgB_6Oy_lguELOGp0p4NlaBloT_uI06KPiJHqU';

export const supabase = createClient(supabaseUrl, supabaseKey);
