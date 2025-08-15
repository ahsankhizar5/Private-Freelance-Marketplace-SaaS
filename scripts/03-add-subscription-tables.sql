-- Add subscription and plan tables for premium features

-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  features JSONB NOT NULL DEFAULT '{}',
  limits JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create usage tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feature VARCHAR(50) NOT NULL,
  usage_count INTEGER DEFAULT 0,
  period_start TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  period_end TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW() + INTERVAL '1 month'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, feature, period_start)
);

-- Insert default plans
INSERT INTO plans (name, price_monthly, price_yearly, features, limits) VALUES
('Starter', 0, 0, 
 '{"profile": true, "messaging": true, "payment_protection": true, "community_access": true}',
 '{"project_applications": 5, "messages": 50, "storage_gb": 1}'
),
('Professional', 29, 290,
 '{"profile": true, "messaging": true, "video_calls": true, "priority_search": true, "analytics": true, "portfolio": true, "priority_support": true}',
 '{"project_applications": -1, "messages": -1, "storage_gb": 10}'
),
('Business', 99, 990,
 '{"all_professional": true, "unlimited_projects": true, "team_management": true, "custom_branding": true, "api_access": true, "dedicated_manager": true}',
 '{"project_applications": -1, "messages": -1, "storage_gb": 100, "team_members": 10}'
),
('Enterprise', null, null,
 '{"all_business": true, "custom_integrations": true, "advanced_security": true, "custom_workflows": true, "24_7_support": true}',
 '{"project_applications": -1, "messages": -1, "storage_gb": -1, "team_members": -1}'
)
ON CONFLICT (name) DO NOTHING;

-- Add plan_id to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'plan_id') THEN
        ALTER TABLE users ADD COLUMN plan_id UUID REFERENCES plans(id) DEFAULT (SELECT id FROM plans WHERE name = 'Starter' LIMIT 1);
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_feature ON usage_tracking(user_id, feature);
CREATE INDEX IF NOT EXISTS idx_users_plan_id ON users(plan_id);

-- Enable RLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Plans are viewable by everyone" ON plans FOR SELECT USING (true);

CREATE POLICY "Users can view their own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own subscription" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own usage" ON usage_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own usage" ON usage_tracking FOR ALL USING (auth.uid() = user_id);
