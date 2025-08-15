-- Create enum types for better data integrity
CREATE TYPE user_role AS ENUM ('admin', 'freelancer');
CREATE TYPE job_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');
CREATE TYPE bid_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE message_type AS ENUM ('text', 'file', 'system');

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'freelancer',
  bio TEXT,
  skills TEXT[], -- Array of skills for freelancers
  hourly_rate DECIMAL(10,2), -- For freelancers
  profile_image_url TEXT,
  phone TEXT,
  location TEXT,
  portfolio_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0.00, -- Average rating
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[],
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  deadline DATE,
  status job_status DEFAULT 'open',
  skills_required TEXT[],
  experience_level TEXT, -- 'beginner', 'intermediate', 'expert'
  job_type TEXT, -- 'fixed', 'hourly'
  estimated_hours INTEGER,
  attachments JSONB, -- Store file URLs and metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bids table
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  proposal TEXT NOT NULL,
  bid_amount DECIMAL(10,2) NOT NULL,
  estimated_completion_time INTEGER, -- in days
  status bid_status DEFAULT 'pending',
  cover_letter TEXT,
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, freelancer_id) -- One bid per freelancer per job
);

-- Messages table for communication
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type message_type DEFAULT 'text',
  attachments JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table for project management
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'pending',
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table for ratings and feedback
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, reviewer_id, reviewee_id) -- One review per job per reviewer-reviewee pair
);

-- Certificates table
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  certificate_url TEXT NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_jobs_admin_id ON jobs(admin_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_bids_job_id ON bids(job_id);
CREATE INDEX idx_bids_freelancer_id ON bids(freelancer_id);
CREATE INDEX idx_bids_status ON bids(status);
CREATE INDEX idx_messages_job_id ON messages(job_id);
CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_tasks_job_id ON tasks(job_id);
CREATE INDEX idx_tasks_freelancer_id ON tasks(freelancer_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bids_updated_at BEFORE UPDATE ON bids FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Jobs policies
CREATE POLICY "Anyone can view jobs" ON jobs FOR SELECT USING (true);
CREATE POLICY "Admins can create jobs" ON jobs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update own jobs" ON jobs FOR UPDATE USING (admin_id = auth.uid());
CREATE POLICY "Admins can delete own jobs" ON jobs FOR DELETE USING (admin_id = auth.uid());

-- Bids policies
CREATE POLICY "Job owners and bid owners can view bids" ON bids FOR SELECT USING (
  freelancer_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = bids.job_id AND jobs.admin_id = auth.uid())
);
CREATE POLICY "Freelancers can create bids" ON bids FOR INSERT WITH CHECK (
  freelancer_id = auth.uid() AND
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'freelancer')
);
CREATE POLICY "Freelancers can update own bids" ON bids FOR UPDATE USING (freelancer_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can view messages they sent or received" ON messages FOR SELECT USING (
  sender_id = auth.uid() OR receiver_id = auth.uid()
);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Tasks policies
CREATE POLICY "Job participants can view tasks" ON tasks FOR SELECT USING (
  freelancer_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = tasks.job_id AND jobs.admin_id = auth.uid())
);
CREATE POLICY "Job owners can create tasks" ON tasks FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = tasks.job_id AND jobs.admin_id = auth.uid())
);
CREATE POLICY "Job participants can update tasks" ON tasks FOR UPDATE USING (
  freelancer_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = tasks.job_id AND jobs.admin_id = auth.uid())
);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Job participants can create reviews" ON reviews FOR INSERT WITH CHECK (
  reviewer_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM jobs 
    WHERE jobs.id = reviews.job_id 
    AND (jobs.admin_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM bids WHERE bids.job_id = jobs.id AND bids.freelancer_id = auth.uid() AND bids.status = 'accepted'))
  )
);

-- Certificates policies
CREATE POLICY "Anyone can view certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Job owners can create certificates" ON certificates FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = certificates.job_id AND jobs.admin_id = auth.uid())
);
