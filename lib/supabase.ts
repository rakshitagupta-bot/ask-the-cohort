import { createClient } from '@supabase/supabase-js'

export type Question = {
  id: string
  name: string
  question_text: string
  upvotes: number
  downvotes: number
  created_at: string
}

export type Comment = {
  id: string
  question_id: string
  comment_text: string
  created_at: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
