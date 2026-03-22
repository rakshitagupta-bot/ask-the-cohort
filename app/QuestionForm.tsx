'use client'

import { useRef, useState, useTransition } from 'react'
import { submitQuestion } from './actions'

export default function QuestionForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await submitQuestion(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        formRef.current?.reset()
      }
    })
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4"
    >
      <h2 className="text-lg font-semibold text-zinc-100">Ask something</h2>

      <input
        name="name"
        type="text"
        placeholder="Your name"
        required
        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <textarea
        name="question_text"
        placeholder="What's your question?"
        required
        rows={3}
        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="self-end bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
      >
        {isPending ? 'Posting…' : 'Post question'}
      </button>
    </form>
  )
}
