-- Add community features tables

-- Create forum categories table
CREATE TABLE IF NOT EXISTS forum_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  post_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create forum posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES forum_categories(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  reply_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create forum replies table
CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create knowledge base articles table
CREATE TABLE IF NOT EXISTS knowledge_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category VARCHAR(100),
  tags TEXT[],
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  read_time INTEGER, -- in minutes
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create community events table
CREATE TABLE IF NOT EXISTS community_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  event_type VARCHAR(50) DEFAULT 'virtual', -- virtual, online, in-person
  max_attendees INTEGER,
  attendee_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW') NOT NULL
);

-- Create event attendees table
CREATE TABLE IF NOT EXISTS event_attendees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES community_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'registered', -- registered, attended, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(event_id, user_id)
);

-- Create post likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(post_id, user_id)
);

-- Create article likes table
CREATE TABLE IF NOT EXISTS article_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES knowledge_articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(article_id, user_id)
);

-- Insert sample forum categories
INSERT INTO forum_categories (name, description, icon, color) VALUES
('General Discussion', 'General topics and community chat', 'MessageSquare', 'text-blue-500'),
('Job Opportunities', 'Share and discuss job opportunities', 'TrendingUp', 'text-primary'),
('Skill Development', 'Learn new skills and share knowledge', 'BookOpen', 'text-purple-500'),
('Success Stories', 'Share your freelancing success stories', 'Star', 'text-yellow-500')
ON CONFLICT DO NOTHING;

-- Insert sample knowledge articles
INSERT INTO knowledge_articles (author_id, title, content, excerpt, category, tags, read_time, is_featured) 
SELECT 
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
  'The Complete Guide to Freelance Pricing',
  'Learn how to price your services competitively while ensuring profitability...',
  'Learn how to price your services competitively while ensuring profitability',
  'Pricing & Contracts',
  ARRAY['pricing', 'contracts', 'business'],
  12,
  true
WHERE EXISTS (SELECT 1 FROM users WHERE role = 'admin');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_author ON forum_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_post ON forum_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_category ON knowledge_articles(category);
CREATE INDEX IF NOT EXISTS idx_community_events_date ON community_events(event_date);
CREATE INDEX IF NOT EXISTS idx_post_likes_post ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_article_likes_article ON article_likes(article_id);

-- Enable RLS
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Forum categories are viewable by everyone" ON forum_categories FOR SELECT USING (true);

CREATE POLICY "Forum posts are viewable by everyone" ON forum_posts FOR SELECT USING (true);
CREATE POLICY "Users can create forum posts" ON forum_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own posts" ON forum_posts FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Forum replies are viewable by everyone" ON forum_replies FOR SELECT USING (true);
CREATE POLICY "Users can create replies" ON forum_replies FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own replies" ON forum_replies FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Published articles are viewable by everyone" ON knowledge_articles FOR SELECT USING (is_published = true);
CREATE POLICY "Users can create articles" ON knowledge_articles FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own articles" ON knowledge_articles FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Active events are viewable by everyone" ON community_events FOR SELECT USING (is_active = true);
CREATE POLICY "Users can create events" ON community_events FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Users can update their own events" ON community_events FOR UPDATE USING (auth.uid() = organizer_id);

CREATE POLICY "Users can view event attendees" ON event_attendees FOR SELECT USING (true);
CREATE POLICY "Users can register for events" ON event_attendees FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own attendance" ON event_attendees FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Users can like posts" ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike posts" ON post_likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view article likes" ON article_likes FOR SELECT USING (true);
CREATE POLICY "Users can like articles" ON article_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike articles" ON article_likes FOR DELETE USING (auth.uid() = user_id);
