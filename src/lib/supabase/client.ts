
import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://mpyprutumezvlnwtbaxu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1weXBydXR1bWV6dmxud3RiYXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNTI4NTYsImV4cCI6MjA1NTgyODg1Nn0.PJIBQpQBQ4JYJboGIBl2FWS2Pv79q5rnOSDtTQhuHgo';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Table name constants
export const FINANCIAL_TABLE = 'Sistema Financeiro';
export const CLIENTES_TABLE = 'Clientes';
