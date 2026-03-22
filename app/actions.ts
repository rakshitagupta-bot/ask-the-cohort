'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function submitQuestion(formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  const question_text = (formData.get('question_text') as string)?.trim()

  if (!name || !question_text) return { error: 'Name and question are required.' }

  const supabase = await createClient()
  const { error } = await supabase.from('questions').insert({ name, question_text })

  if (error) return { error: error.message }

  revalidatePath('/')
  return { success: true }
}

export async function upvoteQuestion(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not signed in' }

  // Try to insert a vote record — unique constraint blocks double voting
  const { error } = await supabase
    .from('votes')
    .insert({ user_id: user.id, question_id: id, vote_type: 'up' })

  if (error) return { error: 'Already voted' }

  // Increment upvotes count
  const { data } = await supabase.from('questions').select('upvotes').eq('id', id).single()
  if (data) await supabase.from('questions').update({ upvotes: data.upvotes + 1 }).eq('id', id)

  revalidatePath('/')
}

export async function downvoteQuestion(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not signed in' }

  const { error } = await supabase
    .from('votes')
    .insert({ user_id: user.id, question_id: id, vote_type: 'down' })

  if (error) return { error: 'Already voted' }

  const { data } = await supabase
    .from('questions').select('upvotes, downvotes').eq('id', id).single()
  if (data) {
    await supabase
      .from('questions')
      .update({ upvotes: data.upvotes - 1, downvotes: data.downvotes + 1 })
      .eq('id', id)
  }

  revalidatePath('/')
}

export async function addComment(questionId: string, commentText: string) {
  const text = commentText.trim()
  if (!text) return

  const supabase = await createClient()
  await supabase.from('comments').insert({ question_id: questionId, comment_text: text })
  revalidatePath('/')
}
