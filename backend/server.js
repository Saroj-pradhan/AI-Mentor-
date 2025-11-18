const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require('cors');
const connectDB = require("./config/db");
const app = express();
const axios = require('axios');
const mongoose = require('mongoose');
app.use(express.json());
app.use(cors());
connectDB();
const port = process.env.PORT|| 5000;
app.get("/",(res,rej)=>{
  return  rej.send("hii it working");
})
// Mongoose Schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
  searchHistory: [{ query: String, timestamp: Date }],
  createdAt: { type: Date, default: Date.now }
});

const resourceSchema = new mongoose.Schema({
  title: String,
  type: String, // youtube, github, article, course
  source: String,
  author: String,
  description: String,
  url: String,
  difficulty: String,
  rating: Number,
  tags: [String],
  metadata: mongoose.Schema.Types.Mixed,
  cachedAt: { type: Date, default: Date.now }
});
resourceSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text'
});
const User = mongoose.model('User', userSchema);
const Resource = mongoose.model('Resource', resourceSchema);

// AI Integration - Claude/OpenAI/Gemini
// async function analyzeQueryWithAI(query) {
//   const apiKey = process.env.ANTHROPIC_API_KEY;

//   if (!apiKey) {
//     console.warn("⚠️ No Anthropic API key found — skipping AI analysis.");
//     return null;
//   }

//   try {
//     const response = await axios.post(
//       "https://api.anthropic.com/v1/messages",
//       {
//         model: "claude-3-5-sonnet-20241022",
//         max_tokens: 1024,
//         messages: [
//           {
//             role: "user",
//             content: [
//               {
//                 type: "text",
//                 text: `Analyze this learning query: "${query}".
// Provide:
// 1. Suggested difficulty level (beginner/intermediate/advanced)
// 2. Best resource types (video/article/course/documentation)
// 3. Related topics to search
// 4. Optimal search keywords for YouTube, GitHub, and Dev.to

// Format the response as *valid JSON only*.`
//               }
//             ]
//           }
//         ]
//       },
//       {
//         headers: {
//           "x-api-key": apiKey,
//           "anthropic-version": "2023-06-01",
//           "content-type": "application/json"
//         }
//       }
//     );

//     const textResponse = response.data?.content?.[0]?.text;

//     // Some Claude responses might include markdown JSON blocks, so clean it up safely
//     const jsonText = textResponse
//       ?.replace(/```json/g, "")
//       ?.replace(/```/g, "")
//       ?.trim();

//     return JSON.parse(jsonText);
//   } catch (error) {
//     console.error(
//       "AI Analysis Error:",
//       error.response?.data || error.message || error
//     );
//     return null;
//   }
// }

// async function analyzeQueryWithAI(query) {
//   const apiKey = process.env.OPENAI_API_KEY;
//   if (!apiKey) return null;

//   try {
//     const response = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: "gpt-4o-mini",
//         messages: [
//           {
//             role: "user",
//             content: `Analyze this learning query: "${query}". 
//             Provide JSON with:
//             - suggestedDifficulty (beginner/intermediate/advanced)
//             - bestResourceTypes (array)
//             - relatedTopics (array)
//             - searchKeywords (array)`
//           }
//         ],
//         temperature: 0.7,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     const content = response.data.choices[0].message.content;
//     return JSON.parse(content);
//   } catch (error) {
//     console.error("AI Analysis Error:", error.response?.data || error.message);
//     return null;
//   }
// }


async function analyzeQueryWithAI(query) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ No GEMINI_API_KEY found in .env — skipping AI analysis");
    return null;
  }

  try {
    // ✅ Use correct endpoint for 2.5 models
    const GEMINI_MODEL = "gemini-2.5-flash"; // or gemini-2.5-pro / flash-lite
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Analyze this learning query: "${query}". 
Respond ONLY with valid JSON in this format:
{
  "suggestedDifficulty": "beginner/intermediate/advanced",
  "bestResourceTypes": ["video","github","article","course"],
  "relatedTopics": ["topic1","topic2","topic3"],
  "searchKeywords": ["keyword1","keyword2","keyword3"]
}`
              }
            ]
          }
        ]
      },
      { headers: { "Content-Type": "application/json" } }
    );
 
    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.warn("⚠️ Gemini returned empty response");
      return null;
    }
console.log(text,"res frm gmni")
    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanText);
  } catch (error) {
    console.error(
      "AI Analysis Error (Gemini):",
      error.response?.data || error.message
    );
    return null;
  }
}

// YouTube API Integration
// async function searchYouTube(query) {
//   const apiKey = process.env.YOUTUBE_API_KEY;
  
//   try {
//     const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
//       params: {
//         part: 'snippet',
//         q: `${query} tutorial`,
//         type: 'video',
//         videoDuration: 'medium',
//         maxResults: 10,
//         key: apiKey
//       }
//     });
    
//     return response.data.items.map(item => ({
//       title: item.snippet.title,
//       type: 'youtube',
//       source: 'YouTube',
//       author: item.snippet.channelTitle,
//       description: item.snippet.description,
//       url: `https://youtube.com/watch?v=${item.id.videoId}`,
//       thumbnail: item.snippet.thumbnails.medium.url,
//       publishedAt: item.snippet.publishedAt
//     }));
//   } catch (error) {
//     console.error('YouTube API Error:', error);
//     return [];
//   }
// }
async function searchYouTube(query) {
  const apiKey = process.env.YOUTUBE_API_KEY;
console.log("hiiiiiiiiiiiiiyoutube")
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${query} tutorial`,
        type: 'video', // ensures only video results (not playlists/channels)
        maxResults: 10,
        key: apiKey
      }
    });

    // Debug log to confirm structure
    console.log("YouTube API first item:", response.data.items[0]?.id);

    return response.data.items.map(item => {
      const videoId = item.id?.videoId;
      return {
        title: item.snippet.title,
        type: 'youtube',
        source: 'YouTube',
        author: item.snippet.channelTitle,
        description: item.snippet.description,
        // ✅ FIXED: use item.id.videoId safely
        url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : null,
        thumbnail: item.snippet?.thumbnails?.medium?.url,
        publishedAt: item.snippet?.publishedAt
      };
    }).filter(video => video.url !== null); // remove undefined videos
  } catch (error) {
    console.error('YouTube API Error:', error.response?.data || error.message);
    return [];
  }
}

// GitHub API Integration
async function searchGitHub(query) {
  try {
    const response = await axios.get('https://api.github.com/search/repositories', {
      params: {
        q: `${query} stars:>100`,
        sort: 'stars',
        order: 'desc',
        per_page: 10
      },
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${process.env.GITHUB_TOKEN}`
      }
    });
    
    return response.data.items.map(repo => ({
      title: repo.name,
      type: 'github',
      source: 'GitHub',
      author: repo.owner.login,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      language: repo.language,
      topics: repo.topics
    }));
  } catch (error) {
    console.error('GitHub API Error:', error);
    return [];
  }
}

// Dev.to API Integration
// async function searchDevTo(query) {
//   try {
//     const response = await axios.get('https://dev.to/api/articles', {
//       params: {
//         per_page: 10,
//       }
//     });

//     return response.data
//       .filter(a => 
//         a.title.toLowerCase().includes(query.toLowerCase()) ||
//         a.description.toLowerCase().includes(query.toLowerCase())
//       )
//       .slice(0, 5)
//       .map(article => ({
//         title: article.title,
//         type: 'article',
//         source: 'Dev.to',
//         author: article.user.name,
//         description: article.description,
//         url: article.url,
//         tags: article.tag_list,
//         readTime: article.reading_time_minutes
//       }));
//   } catch (error) {
//     console.error('Dev.to API Error:', error.message);
//     return [];
//   }
// }
async function searchDevTo(query) {
  try {
    const response = await axios.get('https://dev.to/api/articles', {
      params: {
        per_page: 10,
        search: query   // <-- important
      }
    });

    return response.data.slice(0, 5).map(article => ({
      title: article.title,
      type: 'article',
      source: 'Dev.to',
      author: article.user?.name,
      description: article.description,
      url: article.url,
      tags: article.tag_list,
      readTime: article.reading_time_minutes
    }));
  } catch (error) {
    console.error("Dev.to API Error:", error.message);
    return [];
  }
}

// Main Search Endpoint
// app.post('/api/search', async (req, res) => {
//   console.log("hii it reached");
//   try {
//     const { query, filters } = req.body;
//     console.log(query,"query");
//     // Check cache first
//     const cachedResources = await Resource.find({
//       $text: { $search: query },
//       cachedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // 24 hours
//     }).limit(20);
//     console.log("query2");
//     // if (cachedResources.length > 0) {
//     //   return res.json({ resources: cachedResources, cached: true });
//     // }
//     console.log("query3");
//     // Get AI analysis
//     const aiAnalysis = await analyzeQueryWithAI(query);
//     console.log(aiAnalysis,"after it y g d")
//     // Parallel API calls
//     const [youtubeResults, githubResults, devtoResults] = await Promise.all([
//       searchYouTube(query),
//       searchGitHub(query),
//       searchDevTo(query)
//     ]);
//     console.log("nooooooo")
//     console.log({
//   youtube: youtubeResults?.length,
//   github: githubResults?.length,
//   devto: devtoResults?.length
// },"jjjjjjjay jagannath");

//     // Combine and rank results
// let allResources = [...youtubeResults, ...githubResults, ...devtoResults];

// // Use AI to rank and filter
// const rankedResources = await rankResourcesWithAI(allResources, query, aiAnalysis);

// // ✅ Sort by rating descending and limit to top 10
// const topResources = rankedResources
//   .sort((a, b) => b.rating - a.rating)
//   .slice(0, 10);

// // Cache results
// const savedResources = await Resource.insertMany(
//   topResources.map(r => ({ ...r, tags: [query] }))
// );

// res.json({ 
//   resources: topResources,
//   aiAnalysis,
//   cached: false 
// });

    
//   } catch (error) {
//     console.error('Search Error:', error);
//     res.status(500).json({ error: 'Search failed' });
//   }
// });
app.post('/api/search', async (req, res) => {
  console.log("🚀 /api/search hit");

  try {
    const { query } = req.body;
    console.log("Query received:", query);

    // ✅ Step 1: Check cache (recent results < 24h)
    const cachedResources = await Resource.find({
      $text: { $search: query },
      cachedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    }).limit(20);

    // if (cachedResources.length > 0) {
    //   console.log("✅ Using cached results");
    //   return res.json({ resources: cachedResources, cached: true });
    // }

    console.log("⚙️ Calling AI analysis...");
    const aiAnalysis = await analyzeQueryWithAI(query);

    // ✅ Step 2: If AI works — try to directly extract resource suggestions
    if (aiAnalysis) {
      console.log("✅ AI analysis succeeded:", aiAnalysis);

      // Optional: if Gemini also gives direct links (future extension)
      const aiGeneratedResources = [];

      if (aiAnalysis.resources) {
        aiAnalysis.resources.forEach(r => {
          aiGeneratedResources.push({
            title: r.title || "AI Suggested Resource",
            type: r.type || "article",
            source: r.source || "AI Recommendation",
            author: r.author || "AI Curated",
            description: r.description || "Suggested by AI",
            url: r.link || r.url || null,
            difficulty: aiAnalysis.suggestedDifficulty || "intermediate",
            rating: Math.random() * 1.5 + 3.5, // pseudo rating
            tags: [query],
          });
        });
      }

      // ✅ Step 3: If AI didn't include direct resources, use refined keywords
      const refinedQueries = aiAnalysis.searchKeywords?.length
        ? aiAnalysis.searchKeywords.slice(0, 3)
        : [query];

      // Parallel API calls using the refined keywords (smarter)
      const [youtubeResults, githubResults, devtoResults] = await Promise.all([
        searchYouTube(refinedQueries[0]),
        searchGitHub(refinedQueries[1] || query),
        searchDevTo(refinedQueries[2] || query),
      ]);

      console.log("🌐 API results fetched", {
        youtube: youtubeResults.length,
        github: githubResults.length,
        devto: devtoResults.length,
      });

      let allResources = [
        ...(aiGeneratedResources || []),
        ...youtubeResults,
        ...githubResults,
        ...devtoResults,
      ];

      // ✅ Use AI to rank and filter
      const rankedResources = await rankResourcesWithAI(allResources, query, aiAnalysis);

      // ✅ Sort by rating descending and limit to 10
      const topResources = rankedResources
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 20);

      // ✅ Cache results
      await Resource.insertMany(topResources.map(r => ({ ...r, tags: [query] })));

      return res.json({
        resources: topResources,
        aiAnalysis,
        cached: false,
        source: "ai+api",
      });
    }

    // 🧩 Step 4: AI failed → fallback to regular APIs
    console.log("⚠️ AI failed — using fallback search");
    const [youtubeResults, githubResults, devtoResults] = await Promise.all([
      searchYouTube(query),
      searchGitHub(query),
      searchDevTo(query),
    ]);

    const fallbackResources = [...youtubeResults, ...githubResults, ...devtoResults];
    const rankedResources = await rankResourcesWithAI(fallbackResources, query, null);
    const topResources = rankedResources.sort((a, b) => b.rating - a.rating).slice(0, 20);

    // Cache fallback
    await Resource.insertMany(topResources.map(r => ({ ...r, tags: [query] })));

    res.json({
      resources: topResources,
      aiAnalysis: null,
      cached: false,
      source: "fallback",
    });

  } catch (error) {
    console.error("❌ Search Error:", error.message);
    res.status(500).json({ error: "Search failed", details: error.message });
  }
});


// AI Ranking Function
async function rankResourcesWithAI(resources, query, analysis) {
  // Implement AI-based ranking logic
  // For now, return resources with difficulty tags added
  return resources.map(resource => ({
    ...resource,
    difficulty: analysis?.suggestedDifficulty || 'intermediate',
    rating: Math.random() * 2 + 3 // Mock rating 3-5
  }));
}

// User Bookmark Endpoints
app.post('/api/bookmarks', async (req, res) => {
  try {
    const { userId, resourceId } = req.body;
    
    const user = await User.findById(userId);
    if (!user.bookmarks.includes(resourceId)) {
      user.bookmarks.push(resourceId);
      await user.save();
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add bookmark' });
  }
});

app.get('/api/bookmarks/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('bookmarks');
    res.json({ bookmarks: user.bookmarks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

// Learning Path Generator
app.post('/api/learning-path', async (req, res) => {
  try {
    const { topic, currentLevel } = req.body;
    
    // const prompt = `Create a structured learning path for ${topic} at ${currentLevel} level. 
    // Include:
    // 1. Prerequisites
    // 2. Core concepts (in order)
    // 3. Hands-on projects
    // 4. Recommended resource types for each step with exact link
    
    // Format as JSON.`;
    const prompt = `
    You are an expert learning path recommender.
    Create a clear and structured learning path for "${topic}" at ${currentLevel} level.
    Include:
    1. **Prerequisites**
    2. **Step-by-step learning roadmap**
    3. **Hands-on projects or exercises**
    4. **Recommended resources with direct links**, including:
        - Top YouTube channels (with clickable channel or playlist links)
        - GitHub repositories (for code practice or projects)
        - Optional free course websites or blogs
    
    Respond in **valid JSON** like this example:
    {
      "prerequisites": ["..."],
      "steps": [
        {
          "title": "Step 1: Learn Basics",
          "resources": [
            {"type": "YouTube", "name": "Striver - TakeUForward", "link": "https://www.youtube.com/c/TakeUForward"},
            {"type": "GitHub", "name": "The Algorithms - Java", "link": "https://github.com/TheAlgorithms/Java"}
          ]
        },
        ...
      ],
      "projects": [
        {"name": "Build a sorting visualizer", "link": "https://github.com/Sorting-Visualizer"}
      ]
    }`;

    
    const aiResponse = await analyzeQueryWithAI(prompt);
    res.json({ learningPath: aiResponse });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate learning path' });
  }
});

// Trending Topics
app.get('/api/trending', async (req, res) => {
  try {
    const trending = await Resource.aggregate([
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({ trending });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending topics' });
  }
});
app.listen(port,()=>{
    console.log(`server runned sucessfully on port no ${port} `)
})