import { Metadata } from 'next'
import { SearchForm } from '../components/search-form'
import { FeaturedProfiles } from '../components/featured-profiles'
import { HexagonBackground } from '../components/hexagon-background'

export const metadata: Metadata = {
  title: 'GitHub Wrapped- By Hariom',
  description: 'Generate beautiful insights about your GitHub activity and coding journey.',
  icons: {
    icon: 'https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png',
  },
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <HexagonBackground />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <section className="hero min-h-screen flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            GitHub Wrapped
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl">
            Discover your coding journey like never before. Visualize your GitHub activity in a stunning, shareable format.
          </p>
          <SearchForm />
        </section>

        <section className="about my-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">About GitHub Wrapped</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg mb-6">
                GitHub Wrapped is a futuristic tool that transforms your coding activity into a visually stunning report.
                It analyzes your repositories, contributions, and coding patterns to give you insights you've never seen before.
              </p>
              <p className="text-lg">
                Whether you're a seasoned developer or just starting out, GitHub Wrapped helps you celebrate your
                achievements and share your coding story with the world.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-25"></div>
              <div className="relative bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-lg p-6 border border-gray-700">
                <h3 className="text-2xl font-semibold mb-4">Key Features</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Comprehensive repository analysis</li>
                  <li>Contribution graphs and statistics</li>
                  <li>Language usage breakdown</li>
                  <li>Personalized coding insights</li>
                  <li>Easy sharing on social media</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <FeaturedProfiles />

        <footer className="text-center py-8 mt-20">
          <p className="text-sm text-gray-400">Made with ❤️ by Hariom</p>
        </footer>
      </div>
    </main>
  )
}

