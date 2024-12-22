'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../components/ui/card'
import { ContributionGraph } from './contribution-graph'
import { GitBranch, GitFork, Star, Calendar, GitCommit, Zap, Download, Share2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import html2canvas from 'html2canvas'

interface GitHubStatsProps {
  username: string
}

export function GitHubStats({ username }: GitHubStatsProps) {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/github', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch data')
        }

        const result = await response.json()
        setData(result)
      } catch (err: any) {
        console.error('Error fetching GitHub data:', err)
        setError(err.message || 'An unexpected error occurred')
      }
    }

    fetchData()
  }, [username])

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="text-gray-300">{error}</p>
        <p className="text-gray-300 mt-2">Please check your environment variables and try again.</p>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const downloadStats = async () => {
    if (contentRef.current) {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        backgroundColor: '#000000',
        logging: false,
        useCORS: true,
        allowTaint: true
      })
      const image = canvas.toDataURL('image/png', 1.0)
      const link = document.createElement('a')
      link.href = image
      link.download = `${username}_github_wrapped.png`
      link.click()
    }
  }

  const shareStats = () => {
    const shareText = `Check out my GitHub Wrapped for 2024! ${window.location.origin}/wrapped/${username}`
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(shareUrl, '_blank')
  }

  return (
    <div className="space-y-8" ref={statsRef}>
      <div ref={contentRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-purple-500/10 blur-3xl -z-10" />
          <img
            src={data.user.avatar_url}
            alt={`${username}'s avatar`}
            className="w-32 h-32 rounded-full mx-auto mb-4 border-2 border-white/10 shadow-lg shadow-blue-500/20"
          />
          <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text mb-2" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>
            {data.user.name || username}&apos;s GitHub Wrapped
          </h1>
          <p className="text-gray-300 mt-2 font-mono">2024 Year in Review</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <StatCard
            icon={<GitBranch className="w-5 h-5 text-blue-400" />}
            title="Repositories 📚"
            value={data.stats.totalRepos}
          />
          <StatCard
            icon={<Star className="w-5 h-5 text-yellow-400" />}
            title="Total Stars ⭐"
            value={data.stats.totalStars}
          />
          <StatCard
            icon={<GitFork className="w-5 h-5 text-blue-400" />}
            title="Total Forks 🍴"
            value={data.stats.totalForks}
          />
          <StatCard
            icon={<GitCommit className="w-5 h-5 text-purple-400" />}
            title="Total Commits 💻"
            value={data.stats.totalCommits}
          />
          <StatCard
            icon={<Calendar className="w-5 h-5 text-blue-400" />}
            title="Total Contributions 🎨"
            value={data.stats.totalContributions}
          />
          <StatCard
            icon={<Zap className="w-5 h-5 text-yellow-400" />}
            title="Longest Streak ⚡"
            value={`${data.stats.longestStreak} days`}
          />
        </div>

        <Card className="p-6 bg-black/40 border-white/5 backdrop-blur-xl mt-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
          <h2 className="text-xl font-bold mb-4 relative text-white" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>Top Languages</h2>
          <div className="space-y-4 relative">
            {data.stats.topLanguages.map(([language, count]: [string, number]) => (
              <div key={language}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-200 font-mono">{language}</span>
                  <span className="text-sm text-gray-200 font-mono">{count} repos</span>
                </div>
                <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{
                      width: `${(count / data.stats.totalRepos) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-black/40 border-white/5 backdrop-blur-xl mt-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
          <h2 className="text-xl font-bold mb-4 relative text-white" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>Contributions</h2>
          <div className="text-4xl font-bold text-center mb-4 font-mono text-white" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>
            {data.stats.totalContributions}
          </div>
          <ContributionGraph data={data.stats.contributionGraph} />
          <div className="mt-4 text-center text-gray-300 font-mono relative">
            Most active month: {new Date(data.stats.mostActiveMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
          </div>
        </Card>

        <Card className="p-6 bg-black/40 border-white/5 backdrop-blur-xl mt-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
          <h2 className="text-2xl font-bold mb-4 relative text-white" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>
            Over-all 🎉
          </h2>
          <p className="text-gray-200 mb-4 relative">
            {data.user.name || username} has made an incredible impact with {data.stats.totalContributions} contributions
            across {data.stats.totalRepos} repositories! 🚀 Their dedication has earned them {data.stats.totalStars} stars
            and inspired {data.stats.totalForks} forks from the community.
          </p>
          <p className="text-gray-200 mb-4 relative">
            With an impressive {data.stats.totalCommits} commits, they've shown true commitment to their craft.
            Their longest streak lasted {data.stats.longestStreak} days, and they're currently on a
            {data.stats.currentStreak} day streak. Keep the momentum going! 💪
          </p>
          {data.stats.totalContributions > 500 ? (
            <div className="text-blue-300 font-semibold relative p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="mb-2">🌟 Extraordinary Achievement Unlocked! 🌟</p>
              <p>
                Wow! With over 500 contributions, you're not just coding – you're shaping the future of open source!
                Your dedication inspires developers worldwide. Keep innovating, keep creating, and keep being amazing!
              </p>
              <p className="mt-2">
                Remember: Every line of code you write has the potential to change the world. You're doing great things! 🚀✨
              </p>
            </div>
          ) : (
            <p className="text-blue-300 font-semibold relative">
              Great progress! 👏 Keep coding, learning, and growing. Every contribution counts towards your success!
              You're on the path to greatness – keep pushing forward! 💻✨
            </p>
          )}
        </Card>
      </div>

      <div className="flex justify-center space-x-4">
        <Button 
          onClick={downloadStats} 
          className="bg-blue-500/10 hover:bg-blue-500/20 text-white border border-blue-500/20 backdrop-blur-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Download as Image
        </Button>
        <Button 
          onClick={shareStats} 
          className="bg-purple-500/10 hover:bg-purple-500/20 text-white border border-purple-500/20 backdrop-blur-sm"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: number | string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 bg-black/40 rounded-lg border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-white/10 transition-colors"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-blue-500/10 to-purple-500/10 transition-opacity" />
      <div className="flex items-center gap-2 mb-2 relative">
        {icon}
        <h3 className="font-medium text-white font-mono" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>{title}</h3>
      </div>
      <p className="text-3xl font-bold relative font-mono text-white" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>{value}</p>
    </motion.div>
  )
}

