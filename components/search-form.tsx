'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SearchForm() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username) {
      setError('Please enter a GitHub username')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch GitHub data')
      }

      router.push(`/wrapped/${username}`)
    } catch (err: any) {
      console.error('Search Form Error:', err)
      setError(err.message || 'Failed to generate wrapped. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Enter your GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400"
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        disabled={loading || !username}
        className="w-full p-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded disabled:opacity-50 transition-opacity"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </span>
        ) : (
          'Generate My Wrapped'
        )}
      </button>
      {error && (
        <div className="text-red-500 text-sm text-center p-2 bg-red-500/10 rounded">
          {error}
        </div>
      )}
    </form>
  )
}

