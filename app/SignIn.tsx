'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
        <p className="text-zinc-100 text-sm font-medium">Check your inbox</p>
        <p className="text-zinc-500 text-xs mt-1">We sent a sign-in link to <span className="text-zinc-300">{email}</span></p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
      <div>
        <p className="text-zinc-100 text-sm font-medium">Sign in to vote</p>
        <p className="text-zinc-500 text-xs mt-1">We'll email you a magic link — no password needed.</p>
      </div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600"
      />
      <button
        type="submit"
        disabled={loading}
        className="self-end bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
      >
        {loading ? 'Sending…' : 'Send link'}
      </button>
    </form>
  )
}
