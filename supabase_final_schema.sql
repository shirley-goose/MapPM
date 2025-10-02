-- MapPM Supabase Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cognito_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  status TEXT,
  experience TEXT,
  pm_focus TEXT[],
  industry TEXT[],
  company_stage TEXT[],
  skills TEXT[],
  interests TEXT[],
  location JSONB,
  privacy JSONB DEFAULT '{"showLocation": true, "showEmail": false, "showCompany": false}'::jsonb,
  is_profile_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id TEXT NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) <= 200),
  content TEXT NOT NULL CHECK (char_length(content) <= 10000),
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Forum comments table
CREATE TABLE IF NOT EXISTS forum_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 5000),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id TEXT NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) <= 200),
  description TEXT CHECK (char_length(description) <= 1000),
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  rating_sum INTEGER DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resource ratings table (to track individual user ratings)
CREATE TABLE IF NOT EXISTS resource_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(resource_id, user_id)
);

-- Forum votes table (to track individual user votes)
CREATE TABLE IF NOT EXISTS forum_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_cognito_id ON users(cognito_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_forum_posts_author ON forum_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_comments_post ON forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_resources_author ON resources(author_id);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_votes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (permissive for MVP)
-- Users table policies
CREATE POLICY "Anyone can view profiles"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert profiles"
  ON users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update profiles"
  ON users FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Forum posts policies
CREATE POLICY "Anyone can view posts"
  ON forum_posts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create posts"
  ON forum_posts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update posts"
  ON forum_posts FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Forum comments policies
CREATE POLICY "Anyone can view comments"
  ON forum_comments FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create comments"
  ON forum_comments FOR INSERT
  WITH CHECK (true);

-- Resources policies
CREATE POLICY "Anyone can view resources"
  ON resources FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create resources"
  ON resources FOR INSERT
  WITH CHECK (true);

-- Resource ratings policies
CREATE POLICY "Anyone can view ratings"
  ON resource_ratings FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create ratings"
  ON resource_ratings FOR INSERT
  WITH CHECK (true);

-- Forum votes policies
CREATE POLICY "Anyone can view votes"
  ON forum_votes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create votes"
  ON forum_votes FOR INSERT
  WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at
  BEFORE UPDATE ON forum_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
