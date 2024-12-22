export function LoadingStats() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-purple-500/10 blur-3xl -z-10" />
        <div className="w-32 h-32 bg-white/10 rounded-full mx-auto mb-4 border border-white/20" />
        <div className="h-8 bg-white/10 rounded w-64 mx-auto mb-2 border border-white/20" />
        <div className="h-4 bg-white/10 rounded w-40 mx-auto border border-white/20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-6 bg-white/5 rounded-lg border border-white/10 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
            <div className="h-6 bg-white/10 rounded w-24 mb-4" />
            <div className="h-8 bg-white/10 rounded w-16" />
          </div>
        ))}
      </div>

      <div className="p-6 bg-white/5 rounded-lg border border-white/10 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
        <div className="h-6 bg-white/10 rounded w-32 mb-4" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <div className="h-4 bg-white/10 rounded w-24" />
                <div className="h-4 bg-white/10 rounded w-16" />
              </div>
              <div className="h-2 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

