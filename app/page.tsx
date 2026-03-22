import { supabase, type Question } from '@/lib/supabase'
import QuestionForm from './QuestionForm'
import UpvoteButton from './UpvoteButton'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

async function getQuestions(): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('upvotes', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) return []
  return data ?? []
}

export const dynamic = 'force-dynamic'

export default async function Home() {
  const questions = await getQuestions()

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col gap-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Ask the Cohort</h1>
          <p className="text-sm text-zinc-500 mt-1">Drop a question. Upvote what matters.</p>
        </div>

        {/* Form */}
        <QuestionForm />

        {/* Feed */}
        <div className="flex flex-col gap-3">
          {questions.length === 0 ? (
            <div className="text-center py-16 text-zinc-600 text-sm">
              No questions yet. Be the first to ask!
            </div>
          ) : (
            questions.map((q) => (
              <div
                key={q.id}
                className="flex gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
              >
                {/* Upvote */}
                <UpvoteButton id={q.id} initialCount={q.upvotes} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-100 text-sm leading-relaxed">{q.question_text}</p>
                  <p className="text-zinc-500 text-xs mt-2">
                    {q.name} · {timeAgo(q.created_at)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
