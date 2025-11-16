import {SignInButton} from "@clerk/clerk-react"
import React, { useState } from 'react';
import { Search, Sparkles, BookOpen, Zap, TrendingUp, Users, Award, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isHovered, setIsHovered] = useState(null);

  const trendingTopics = [
    'React', 'Python', 'JavaScript', 'Machine Learning',
    'Node.js', 'TypeScript', 'Docker', 'AWS', 'Next.js', 'MongoDB'
  ];

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI-Powered Search',
      description: 'Discover the perfect learning resources with intelligent recommendations'
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Curated Content',
      description: 'Hand-picked tutorials, courses, and documentation from trusted sources'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'Get instant results and start learning in seconds'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community Driven',
      description: 'Resources recommended by developers, for developers'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Resources' },
    { number: '50+', label: 'Topics' },
    { number: '5K+', label: 'Learners' },
    { number: '100%', label: 'Free' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI Resource Finder
                </h1>
                <p className="text-xs text-gray-600">Free Learning Resources</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                Saved (0)
              </button>
            
                <SignInButton className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"/>
             
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Powered by AI</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Start Your
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> Learning Journey</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover curated learning resources for any topic. From React to Machine Learning, find the perfect path to master your skills.
          </p>

          {/* Search Box */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl shadow-xl p-2 flex items-center">
                <Search className="w-6 h-6 text-gray-400 ml-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search any topic... (React, Python, Machine Learning)"
                  className="flex-1 px-4 py-4 text-lg outline-none"
                />
                <button onClick={()=>alert("Sign in to continue")} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="w-4 h-4 text-gray-600 mr-2" />
              <span className="text-sm text-gray-600 font-medium">Trending topics:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {trendingTopics.map((topic, index) => (
                <button
                  key={index}
                  onMouseEnter={() => setIsHovered(index)}
                  onMouseLeave={() => setIsHovered(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isHovered === index
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-110'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <div className="text-indigo-600">{feature.icon}</div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <Award className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h3 className="text-3xl font-bold mb-4">Ready to Level Up Your Skills?</h3>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of learners who are already using AI Resource Finder to accelerate their learning journey.
          </p>
          <button className="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2">
            <span  onClick={()=>alert("Sign in to continue")}>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p className="text-sm">© 2025 AI Resource Finder. Made with ❤️ for learners worldwide.</p>
        </div>
      </footer>
    </div>
  );
}