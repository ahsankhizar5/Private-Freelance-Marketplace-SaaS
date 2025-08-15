import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Briefcase } from "lucide-react"
import Link from "next/link"
import TaskBoard from "@/components/tasks/task-board"
import TaskCreateForm from "@/components/tasks/task-create-form"

export default async function WorkroomPage({ params }: { params: { jobId: string } }) {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: currentUserProfile } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (!currentUserProfile) {
    redirect("/auth/login")
  }

  // Get job details
  const { data: job } = await supabase
    .from("jobs")
    .select(`
      *,
      admin:users!jobs_admin_id_fkey(*)
    `)
    .eq("id", params.jobId)
    .single()

  if (!job) {
    notFound()
  }

  // Check access permissions
  let hasAccess = false
  let isAdmin = false
  let freelancer = null

  if (currentUserProfile.role === "admin" && job.admin_id === currentUserProfile.id) {
    // Admin owns this job
    hasAccess = true
    isAdmin = true

    // Get the accepted freelancer
    const { data: acceptedBid } = await supabase
      .from("bids")
      .select(`
        *,
        freelancer:users!bids_freelancer_id_fkey(*)
      `)
      .eq("job_id", params.jobId)
      .eq("status", "accepted")
      .single()

    if (acceptedBid) {
      freelancer = acceptedBid.freelancer
    }
  } else if (currentUserProfile.role === "freelancer") {
    // Check if freelancer has accepted bid
    const { data: userBid } = await supabase
      .from("bids")
      .select("status")
      .eq("job_id", params.jobId)
      .eq("freelancer_id", currentUserProfile.id)
      .single()

    if (userBid?.status === "accepted") {
      hasAccess = true
      freelancer = currentUserProfile
    }
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Access Restricted</CardTitle>
              <CardDescription>
                You can only access the workroom after a bid has been accepted for this job.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={currentUserProfile.role === "admin" ? "/admin/dashboard" : "/freelancer/dashboard"}>
                <Button className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Get tasks for this job
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("job_id", params.jobId)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={currentUserProfile.role === "admin" ? "/admin/dashboard" : "/freelancer/dashboard"}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Project Workroom</h1>
                <p className="text-sm text-muted-foreground">{job.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {job.status}
              </Badge>
              {isAdmin && <TaskCreateForm jobId={params.jobId} freelancerId={freelancer?.id} />}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Project Overview</span>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Admin: {job.admin.full_name}</span>
                  {freelancer && <span>Freelancer: {freelancer.full_name}</span>}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{job.description}</p>
            </CardContent>
          </Card>

          {/* Task Board */}
          <TaskBoard tasks={tasks || []} jobId={params.jobId} isAdmin={isAdmin} currentUserId={currentUserProfile.id} />
        </div>
      </div>
    </div>
  )
}
