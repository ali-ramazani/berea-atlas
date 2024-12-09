import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zmoxmkrybpriedydgapv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inptb3hta3J5YnByaWVkeWRnYXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3MDM5NjUsImV4cCI6MjA0OTI3OTk2NX0.RRgLnQMtC_dEygSRw-BO2DVZUhEFNce2vGrf-w2MNRw'; // Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


