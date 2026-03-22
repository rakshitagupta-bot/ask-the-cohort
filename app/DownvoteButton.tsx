'use client'

import { useState, useTransition } from 'react'
import { downvoteQuestion } from './actions'

export default function DownvoteButton({ id, initialCount }: { id: string; initialCount: number }) {
  const [count, setCount] = useState(initialCount)
  const [isPending, startTransition] = useTransition()

  function handleDownvote() {
    if (isPending) return
    setCount((c) => c + 1)
    startTransition(() => downvoteQuestion(id))
  }

  return (
    <button
      onClick={handleDownvote}
      disabled={isPending}
      className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border transition-colors min-w-[52px] border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-red-500 hover:text-red-400"
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
      <span className="text-xs font-semibold tabular-nums">{count}</span>
    </button>
  )
}
