import { NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'

if (!process.env.GITHUB_TOKEN) {
  throw new Error('GITHUB_TOKEN environment variable is not set')
}

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

async function validateGitHubToken() {
  try {
    await octokit.rest.users.getAuthenticated()
    return true
  } catch (error) {
    console.error('GitHub Token Validation Error:', error)
    return false
  }
}

async function fetchGitHubData(username: string) {
  const isTokenValid = await validateGitHubToken()
  if (!isTokenValid) {
    throw new Error('Invalid GitHub token. Please check your configuration.')
  }

  try {
    const [user, repos, contributions] = await Promise.all([
      octokit.rest.users.getByUsername({ username }),
      octokit.rest.repos.listForUser({ username, per_page: 100 }),
      fetchContributions(username)
    ])

    const stats = calculateStats(repos.data, contributions)

    return {
      user: user.data,
      stats
    }
  } catch (error: any) {
    console.error('Error fetching GitHub data:', error)
    if (error.status === 404) {
      throw new Error('GitHub user not found')
    }
    if (error.status === 401) {
      throw new Error('GitHub token is invalid or expired')
    }
    if (error.status === 403) {
      throw new Error('GitHub API rate limit exceeded')
    }
    throw new Error(`Failed to fetch GitHub data: ${error.message}`)
  }
}

async function fetchContributions(username: string) {
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
        repositories(first: 100, orderBy: {field: PUSHED_AT, direction: DESC}) {
          nodes {
            defaultBranchRef {
              target {
                ... on Commit {
                  history {
                    totalCount
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables: { username } }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`GraphQL request failed: ${JSON.stringify(errorData.errors)}`)
  }

  const data = await response.json()
  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`)
  }

  return data.data.user
}

function calculateStats(repos: any[], contributionsData: any) {
  if (!contributionsData || !contributionsData.contributionsCollection) {
    throw new Error('Invalid contribution data received from GitHub')
  }

  const languages = repos.reduce((acc: Record<string, number>, repo: any) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1
    }
    return acc
  }, {})

  const topLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)

  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0)
  const totalForks = repos.reduce((acc, repo) => acc + repo.forks_count, 0)

  const contributionCalendar = contributionsData.contributionsCollection.contributionCalendar
  const contributionGraph = contributionCalendar.weeks.flatMap((week: any) =>
    week.contributionDays.map((day: any) => ({
      date: day.date,
      count: day.contributionCount
    }))
  )

  const totalCommits = contributionsData.repositories.nodes.reduce(
    (acc: number, repo: any) => acc + (repo.defaultBranchRef?.target?.history?.totalCount || 0),
    0
  )

  const monthlyContributions = contributionGraph.reduce((acc: Record<string, number>, day: any) => {
    const month = day.date.slice(0, 7) // YYYY-MM
    acc[month] = (acc[month] || 0) + day.count
    return acc
  }, {})

  const mostActiveMonth = Object.entries(monthlyContributions)
    .sort(([, a], [, b]) => (b as number) - (a as number))[0][0]

  const { longestStreak, currentStreak } = calculateStreaks(contributionGraph)

  return {
    totalRepos: repos.length,
    totalStars,
    totalForks,
    topLanguages,
    totalContributions: contributionCalendar.totalContributions,
    totalCommits,
    mostActiveMonth,
    longestStreak,
    currentStreak,
    contributionGraph,
  }
}

function calculateStreaks(contributionGraph: { date: string; count: number }[]) {
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  for (let i = contributionGraph.length - 1; i >= 0; i--) {
    if (contributionGraph[i].count > 0) {
      tempStreak++
      if (i === contributionGraph.length - 1) {
        currentStreak = tempStreak
      }
    } else {
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak
      }
      if (currentStreak === 0) {
        currentStreak = tempStreak
      }
      tempStreak = 0
    }
  }

  if (tempStreak > longestStreak) {
    longestStreak = tempStreak
  }

  return { longestStreak, currentStreak }
}

export async function POST(request: Request) {
  try {
    if (!process.env.GITHUB_TOKEN) {
      return NextResponse.json(
        { error: 'GitHub token is not configured' },
        { status: 500 }
      )
    }

    const { username } = await request.json()
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    const data = await fetchGitHubData(username)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('GitHub API Error:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { 
        status: error.message.includes('not found') ? 404 : 
                error.message.includes('rate limit') ? 429 :
                error.message.includes('token') ? 401 : 500 
      }
    )
  }
}

