'use client'

import { useState, useTransition } from 'react'
import { downvoteQuestion } from './actions'

export default function DownvoteButton({ id }: { id: string }) {
  const [voted, setVoted] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDownvote() {
    if (voted || isPending) return
    setVoted(true)
    startTransition(() => downvoteQuestion(id))
  }

  return (
    <button
      onClick={handleDownvote}
      disabled={voted || isPending}
      className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border transition-colors min-w-[52px] ${
        voted
          ? 'border-red-500 bg-red-500/10 text-red-400'
          : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-red-500 hover:text-red-400'
      }`}
      aria-label="Downvote"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
      >
        <path
          fillRule="evenodd"
          d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-xs font-semibold invisible">0</span>
    </button>
  )
}
