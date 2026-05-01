import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fzeqfyhwasiyvrrvwvmh.supabase.co'
const supabaseKey = 'sb_publishable_4L18UBU-jA_72O6FIwCVDA_tEISuITU'

export const supabase = createClient(supabaseUrl, supabaseKey)
