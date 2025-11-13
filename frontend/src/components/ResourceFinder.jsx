import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Github, Youtube, FileText, Star, ExternalLink, Bookmark, Filter, TrendingUp, Zap, Clock, Users } from 'lucide-react';

export default function ResourceFinder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState(['all']);
  const [difficulty, setDifficulty] = useState('all');
  const [bookmarks, setBookmarks] = useState([]);
  const [activeTab, setActiveTab] = useState('search');
  const [recentSearches, setRecentSearches] = useState([]);

  // Load bookmarks from storage
  useEffect(() => {
    loadBookmarks();
    loadRecentSearches();
  }, []);

  const loadBookmarks = async () => {
    try {
      const result = await window.storage.get('user-bookmarks');
      if (result) {
        setBookmarks(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('No bookmarks found');
    }
  };

  const loadRecentSearches = async () => {
    try {
      const result = await window.storage.get('recent-searches');
      if (result) {
        setRecentSearches(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('No search history');
    }
  };

  const saveBookmarks = async (newBookmarks) => {
    try {
      await window.storage.set('user-bookmarks', JSON.stringify(newBookmarks));
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  };

  const saveSearchHistory = async (query) => {
    const updated = [query, ...recentSearches.filter(q => q !== query)].slice(0, 10);
    setRecentSearches(updated);
    try {
      await window.storage.set('recent-searches', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  };

 const searchResources = async () => {
  if (!searchQuery.trim()) return;

  setLoading(true);
  saveSearchHistory(searchQuery);

  try {
    const response = await fetch("http://localhost:3000/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: searchQuery })
    });

    const data = await response.json();

    if (response.ok) {
      // Normalize data for UI
      const formatted = data.resources.map((item, i) => ({
        id: item._id || `res-${i}`,
        title: item.title || "Untitled Resource",
        type: item.type || "article",
        source: item.source || "Unknown",
        author: item.author || "Unknown Author",
        description: item.description || "No description available.",
        url: item.url || "#",
        difficulty: item.difficulty || "intermediate",
        rating: item.rating ? Number(item.rating.toFixed(1)) : 4.0,
        stars: item.stars ? `${item.stars}` : undefined,
        readTime: item.readTime ? `${item.readTime} min` : undefined,
        views: item.views,
        thumbnail: item.thumbnail
      }));

      setResources(formatted);
    } else {
      console.error("API Error:", data);
      setResources([]);
    }
  } catch (error) {
    console.error("Search failed:", error);
    setResources([]);
  } finally {
    setLoading(false);
  }
};


 

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchResources();
    }
  };

  const toggleBookmark = (resource) => {
    const newBookmarks = bookmarks.some(b => b.id === resource.id)
      ? bookmarks.filter(b => b.id !== resource.id)
      : [...bookmarks, resource];
    
    setBookmarks(newBookmarks);
    saveBookmarks(newBookmarks);
  };

  const isBookmarked = (id) => bookmarks.some(b => b.id === id);

  const getIcon = (type) => {
    switch(type) {
      case 'youtube': return <Youtube className="w-5 h-5 text-red-500" />;
      case 'github': return <Github className="w-5 h-5 text-gray-700" />;
      case 'article': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'course': return <BookOpen className="w-5 h-5 text-green-500" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredResources = resources.filter(resource => {
    const typeMatch = selectedTypes.includes('all') || selectedTypes.includes(resource.type);
    const difficultyMatch = difficulty === 'all' || resource.difficulty === difficulty || resource.difficulty === 'all';
    return typeMatch && difficultyMatch;
  });

  const trendingTopics = [
    'React', 'Python', 'JavaScript', 'Machine Learning', 'Node.js', 
    'TypeScript', 'Docker', 'AWS', 'Next.js', 'MongoDB'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Resource Finder
                </h1>
                <p className="text-xs text-gray-500">Powered by AI • Free Learning Resources</p>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('search')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'search' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Search className="w-4 h-4 inline mr-1" />
                Search
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'bookmarks' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Bookmark className="w-4 h-4 inline mr-1" />
                Saved ({bookmarks.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'search' ? (
          <>
            {/* Search Section */}
            <div className="mb-8">
              <div className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search any topic... (React, Python, Machine Learning)"
                    className="w-full px-6 py-4 pr-12 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none shadow-sm"
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                </div>
                <button
                  onClick={searchResources}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>

              {/* Recent Searches & Trending */}
              {recentSearches.length > 0 && resources.length === 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Recent searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSearchQuery(search);
                          setTimeout(() => searchResources(), 100);
                        }}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-all"
                      >
                        <Clock className="w-3 h-3 inline mr-1" />
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {resources.length === 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Trending topics:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {trendingTopics.map((topic, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSearchQuery(topic);
                          setTimeout(() => searchResources(), 100);
                        }}
                        className="px-4 py-2 bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-lg text-sm font-medium text-gray-700 transition-all"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filters */}
            {resources.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-700">Filters</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
                    <div className="flex flex-wrap gap-2">
                      {['all', 'youtube', 'github', 'article', 'course'].map(type => (
                        <button
                          key={type}
                          onClick={() => setSelectedTypes([type])}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            selectedTypes.includes(type)
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                    <div className="flex flex-wrap gap-2">
                      {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
                        <button
                          key={level}
                          onClick={() => setDifficulty(level)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            difficulty === level
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">AI is finding the best resources for you...</p>
              </div>
            )}

            {/* Results */}
            {!loading && filteredResources.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Found {filteredResources.length} Resources
                  </h2>
                </div>

                <div className="grid gap-4">
                  {filteredResources.map(resource => (
                    <div
                      key={resource.id}
                      className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            {getIcon(resource.type)}
                            <span className="text-sm font-medium text-gray-600">{resource.source}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                              {resource.difficulty}
                            </span>
                            <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">
                              FREE
                            </span>
                          </div>
                          {resource.thumbnail && (
  <img
    src={resource.thumbnail}
    alt={resource.title}
    className="w-40 h-24 object-cover rounded-lg mb-3 border"
  />
)}

                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {resource.title}
                          </h3>

                          <p className="text-gray-600 mb-3">{resource.description}</p>

                          <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {resource.rating}
                            </span>
                            <span>by {resource.author}</span>
                            {resource.duration && <span>⏱️ {resource.duration}</span>}
                            {resource.stars && <span>⭐ {resource.stars} stars</span>}
                            {resource.readTime && <span>📖 {resource.readTime}</span>}
                            {resource.views && <span>👁️ {resource.views}</span>}
                            {resource.students && <span><Users className="w-4 h-4 inline" /> {resource.students}</span>}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => toggleBookmark(resource)}
                            className={`p-2 rounded-lg border-2 transition-all ${
                              isBookmarked(resource.id)
                                ? 'border-blue-500 bg-blue-50 text-blue-500'
                                : 'border-gray-200 hover:border-gray-300 text-gray-400'
                            }`}
                          >
                            <Bookmark className={`w-5 h-5 ${isBookmarked(resource.id) ? 'fill-current' : ''}`} />
                          </button>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-500 transition-all"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && resources.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Your Learning Journey</h3>
                <p className="text-gray-600">Search for any topic to discover curated learning resources</p>
              </div>
            )}
          </>
        ) : (
          /* Bookmarks Tab */
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Your Saved Resources ({bookmarks.length})
            </h2>
            
            {bookmarks.length === 0 ? (
              <div className="text-center py-16">
                <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookmarks yet</h3>
                <p className="text-gray-600 mb-4">Start saving resources to access them later</p>
                <button
                  onClick={() => setActiveTab('search')}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                >
                  Start Searching
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {bookmarks.map(resource => (
                  <div
                    key={resource.id}
                    className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getIcon(resource.type)}
                          <span className="text-sm font-medium text-gray-600">{resource.source}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                            {resource.difficulty}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {resource.title}
                        </h3>

                        <p className="text-gray-600 mb-3">{resource.description}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {resource.rating}
                          </span>
                          <span>by {resource.author}</span>
                          {resource.duration && <span>⏱️ {resource.duration}</span>}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => toggleBookmark(resource)}
                          className="p-2 rounded-lg border-2 border-blue-500 bg-blue-50 text-blue-500 transition-all"
                        >
                          <Bookmark className="w-5 h-5 fill-current" />
                        </button>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-500 transition-all"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p className="mb-2">Built with ❤️ using React + AI</p>
          <p className="text-sm">Free educational resources from YouTube, GitHub, Dev.to & more</p>
        </div>
      </div>
    </div>
  );
}