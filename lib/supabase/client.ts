import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_project_url_here" &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0 &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "your_supabase_anon_key_here"

// Create a singleton instance of the Supabase client for Client Components
export const supabase = createClientComponentClient()

// Database types
export interface User {
  id: string
  email: string
  full_name: string
  role: "admin" | "freelancer"
  bio?: string
  skills?: string[]
  hourly_rate?: number
  profile_image_url?: string
  phone?: string
  location?: string
  portfolio_url?: string
  linkedin_url?: string
  github_url?: string
  rating: number
  total_reviews: number
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  admin_id: string
  title: string
  description: string
  requirements?: string[]
  budget_min?: number
  budget_max?: number
  deadline?: string
  status: "open" | "in_progress" | "completed" | "cancelled"
  skills_required?: string[]
  experience_level?: string
  job_type?: string
  estimated_hours?: number
  attachments?: any
  created_at: string
  updated_at: string
}

export interface Bid {
  id: string
  job_id: string
  freelancer_id: string
  proposal: string
  bid_amount: number
  estimated_completion_time?: number
  status: "pending" | "accepted" | "rejected"
  cover_letter?: string
  attachments?: any
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  job_id: string
  sender_id: string
  receiver_id: string
  content: string
  message_type: "text" | "file" | "system"
  attachments?: any
  is_read: boolean
  created_at: string
}

export interface Task {
  id: string
  job_id: string
  freelancer_id: string
  title: string
  description?: string
  status: "pending" | "in_progress" | "completed"
  due_date?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  job_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  feedback?: string
  created_at: string
}

export interface Certificate {
  id: string
  job_id: string
  freelancer_id: string
  certificate_url: string
  issued_at: string
}
