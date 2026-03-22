'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function submitQuestion(formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  const question_text = (formData.get('question_text') as string)?.trim()

  if (!name || !question_text) return { error: 'Name and question are required.' }

  const supabase = getSupabase()
  const { error } = await supabase
    .from('questions')
    .insert({ name, question_text })

  if (error) return { error: error.message }

  revalidatePath('/')
  return { success: true }
}

export async function upvoteQuestion(id: string) {
  const supabase = getSupabase()
  const { error } = await supabase.rpc('increment_upvotes', { question_id: id })

  if (error) {
    // Fallback: fetch current count and increment manually
    const { data } = await supabase
      .from('questions')
      .select('upvotes')
      .eq('id', id)
      .single()

    if (data) {
      await supabase
        .from('questions')
        .update({ upvotes: data.upvotes + 1 })
        .eq('id', id)
    }
  }

  revalidatePath('/')
}
