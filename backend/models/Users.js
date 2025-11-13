const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  
  // User preferences
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    defaultDifficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all'],
      default: 'all'
    },
    preferredResourceTypes: [{
      type: String,
      enum: ['youtube', 'github', 'article', 'course']
    }],
    emailNotifications: {
      type: Boolean,
      default: true
    }
  },
  
  // Bookmarks and saved resources
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource'
  }],
  
  // Collections/folders for organizing bookmarks
  collections: [{
    name: String,
    description: String,
    resources: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource'
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Search history
  searchHistory: [{
    query: String,
    filters: mongoose.Schema.Types.Mixed,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Learning paths in progress
  learningPaths: [{
    topic: String,
    difficulty: String,
    steps: [{
      title: String,
      description: String,
      resources: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource'
      }],
      completed: {
        type: Boolean,
        default: false
      }
    }],
    progress: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // User activity stats
  stats: {
    totalSearches: {
      type: Number,
      default: 0
    },
    totalBookmarks: {
      type: Number,
      default: 0
    },
    completedResources: {
      type: Number,
      default: 0
    },
    favoriteTopics: [String]
  },
  
  // Social features
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Account metadata
  isVerified: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpiry: Date,
  
  lastLogin: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'stats.favoriteTopics': 1 });

// Virtual for bookmark count
userSchema.virtual('bookmarkCount').get(function() {
  return this.bookmarks.length;
});

// Method to add bookmark
userSchema.methods.addBookmark = async function(resourceId) {
  if (!this.bookmarks.includes(resourceId)) {
    this.bookmarks.push(resourceId);
    this.stats.totalBookmarks += 1;
    await this.save();
  }
  return this;
};

// Method to remove bookmark
userSchema.methods.removeBookmark = async function(resourceId) {
  this.bookmarks = this.bookmarks.filter(id => id.toString() !== resourceId.toString());
  this.stats.totalBookmarks = Math.max(0, this.stats.totalBookmarks - 1);
  await this.save();
  return this;
};

// Method to add to search history (limit to last 50)
userSchema.methods.addSearchHistory = async function(query, filters = {}) {
  this.searchHistory.unshift({ query, filters, timestamp: new Date() });
  this.searchHistory = this.searchHistory.slice(0, 50); // Keep only last 50 searches
  this.stats.totalSearches += 1;
  await this.save();
  return this;
};

// Method to create collection
userSchema.methods.createCollection = async function(name, description = '') {
  this.collections.push({
    name,
    description,
    resources: [],
    createdAt: new Date()
  });
  await this.save();
  return this.collections[this.collections.length - 1];
};

// Pre-save hook to update timestamp
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;