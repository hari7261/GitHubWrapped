import { Suspense } from 'react'
import { Metadata } from 'next'
import { GitHubStats } from '../../../components/github-stats'
import { LoadingStats } from '../../../components/loading-stats'
import { HexagonBackground } from '../../../components/hexagon-background'
export const metadata: Metadata = {
  title: 'GitHub Wrapped- By Hariom',
  description: 'Generate beautiful insights about your GitHub activity and coding journey.',
  icons: {
    icon: 'https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png',
  },
}

export default function WrappedPage({
  params: { username }
}: {
  params: { username: string }
}) {
  return (
    <main className="min-h-screen bg-black text-white relative">
      <HexagonBackground />
      <div className="container mx-auto px-4 py-16 relative">
        <Suspense fallback={<LoadingStats />}>
          <GitHubStats username={username} />
        </Suspense>
      </div>
    </main>
  )
}

