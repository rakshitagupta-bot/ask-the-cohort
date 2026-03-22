'use client'

import { useState, useTransition } from 'react'
import { upvoteQuestion } from './actions'

export default function UpvoteButton({ id, initialCount }: { id: string; initialCount: number }) {
  const [count, setCount] = useState(initialCount)
  const [voted, setVoted] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleUpvote() {
    if (voted || isPending) return
    setCount((c) => c + 1)
    setVoted(true)
    startTransition(() => upvoteQuestion(id))
  }

  return (
    <button
      onClick={handleUpvote}
      disabled={voted || isPending}
      className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border transition-colors min-w-[52px] ${
        voted
          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
          : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-indigo-500 hover:text-indigo-400'
      }`}
      aria-label="Upvote"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path
          fillRule="evenodd"
          d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-xs font-semibold tabular-nums">{count}</span>
    </button>
  )
}
