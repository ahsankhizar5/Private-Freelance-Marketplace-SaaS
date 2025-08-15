import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import JobCreateForm from "@/components/jobs/job-create-form"

export default async function CreateJobPage() {
  const supabase = createClient()

  // Get current user and verify admin role
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/freelancer/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Post a New Job</h1>
            <p className="text-muted-foreground mt-2">
              Create a detailed job posting to attract the right freelancers for your project.
            </p>
          </div>
          <JobCreateForm />
        </div>
      </div>
    </div>
  )
}
