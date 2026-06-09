const METHOD_STYLES = {
  GET: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  POST: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  PUT: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  PATCH: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  DELETE: 'bg-red-500/15 text-red-400 border-red-500/30',
}

export default function MethodBadge({ method }) {
  const style = METHOD_STYLES[method?.toUpperCase()] ?? 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30'

  return (
    <span
      className={`inline-flex items-center justify-center min-w-[4.5rem] px-2.5 py-0.5 rounded border text-xs font-bold font-mono tracking-wide ${style}`}
    >
      {method?.toUpperCase()}
    </span>
  )
}
