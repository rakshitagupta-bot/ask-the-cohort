'use client'

import { useState, useTransition } from 'react'
import { addComment } from './actions'
import type { Comment } from '@/lib/supabase'

export default function CommentSection({ questionId, initialComments }: { questionId: string; initialComments: Comment[] }) {
  const [comments, setComments] = useState(initialComments)
  const [value, setValue] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter' || !value.trim()) return
    const text = value.trim()
    setComments((prev) => [...prev, { id: crypto.randomUUID(), question_id: questionId, comment_text: text, created_at: new Date().toISOString() }])
    setValue('')
    startTransition(() => addComment(questionId, text))
  }

  return (
    <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-zinc-800">
      {comments.map((c) => (
        <p key={c.id} className="text-zinc-400 text-xs leading-relaxed">
          {c.comment_text}
        </p>
      ))}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isPending}
        placeholder="Add your thoughts"
        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600"
      />
    </div>
  )
}
