'use client'

import { useState, useTransition } from 'react'
import { upvoteQuestion } from './actions'

export default function UpvoteButton({
  id,
  initialCount,
  isLoggedIn,
  hasVoted,
}: {
  id: string
  initialCount: number
  isLoggedIn: boolean
  hasVoted: boolean
}) {
  const [count, setCount] = useState(initialCount)
  const [voted, setVoted] = useState(hasVoted)
  const [isPending, startTransition] = useTransition()
  const [hint, setHint] = useState<string | null>(null)

  function handleUpvote() {
    if (!isLoggedIn) { setHint('Sign in to vote'); setTimeout(() => setHint(null), 2500); return }
    if (voted || isPending) { setHint('Already voted'); setTimeout(() => setHint(null), 2500); return }
    setCount((c) => c + 1)
    setVoted(true)
    setHint(null)
    startTransition(async () => { await upvoteQuestion(id) })
  }

  return (
    <div className="relative">
      <button
        onClick={handleUpvote}
        className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border transition-colors min-w-[52px] ${
          voted
            ? 'border-green-600 bg-green-600/10 text-green-400 cursor-default'
            : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-green-500 hover:text-green-400'
        }`}
        aria-label="Upvote"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z" clipRule="evenodd" />
        </svg>
        <span className="text-xs font-semibold tabular-nums">{count}</span>
      </button>
      {hint && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-700 text-zinc-200 text-xs px-2 py-1 rounded whitespace-nowrap">
          {hint}
        </div>
      )}
    </div>
  )
}
