import { createClient } from '@supabase/supabase-js';
import { env } from '@/configs/env';

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON || '';

export const supabase = createClient(supabaseUrl, supabaseKey);
