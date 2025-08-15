import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, Calendar, Briefcase } from "lucide-react"
import Link from "next/link"
import BidsList from "@/components/jobs/bids-list"
import MessageButton from "@/components/messaging/message-button"
import WorkroomButton from "@/components/tasks/workroom-button"
import JobCompletionRating from "@/components/reviews/job-completion-rating"

export default async function AdminJobDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Get current user and verify admin role
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("users").select("role, full_name").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/freelancer/dashboard")
  }

  // Get job details
  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", params.id)
    .eq("admin_id", user.id) // Ensure admin owns this job
    .single()

  if (!job) {
    notFound()
  }

  // Get bids for this job
  const { data: bids } = await supabase
    .from("bids")
    .select(`
      *,
      users!bids_freelancer_id_fkey(full_name, rating, total_reviews, skills, hourly_rate)
    `)
    .eq("job_id", params.id)
    .order("created_at", { ascending: false })

  // Check if there's an accepted bid for messaging and workroom
  const acceptedBid = bids?.find((bid) => bid.status === "accepted")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Job Management</h1>
              <p className="text-muted-foreground">Review proposals and manage your job posting</p>
            </div>
            <div className="flex items-center gap-2">
              {acceptedBid && (
                <>
                  <WorkroomButton jobId={params.id} />
                  <MessageButton jobId={params.id} />
                </>
              )}
              <Link href="/admin/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {job.status === "completed" && acceptedBid && (
              <JobCompletionRating
                jobId={params.id}
                currentUserId={user.id}
                currentUserRole="admin"
                otherUserId={acceptedBid.freelancer_id}
                otherUserName={acceptedBid.users.full_name}
                jobTitle={job.title}
              />
            )}

            {/* Job Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{bids?.length || 0} proposals received</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={job.status === "open" ? "default" : "secondary"}>{job.status}</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Project Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{job.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Proposals */}
            <Card>
              <CardHeader>
                <CardTitle>Proposals ({bids?.length || 0})</CardTitle>
                <CardDescription>Review and manage proposals from freelancers</CardDescription>
              </CardHeader>
              <CardContent>
                <BidsList bids={bids || []} jobId={params.id} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {job.budget_min && job.budget_max && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Budget</span>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium">
                        ${job.budget_min} - ${job.budget_max}
                      </span>
                    </div>
                  </div>
                )}

                {job.deadline && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Deadline</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}

                {job.job_type && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <Badge variant="outline">{job.job_type === "fixed" ? "Fixed Price" : "Hourly"}</Badge>
                  </div>
                )}

                {job.experience_level && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Experience</span>
                    <Badge variant="outline">{job.experience_level}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills Required */}
            {job.skills_required && job.skills_required.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills Required</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.skills_required.map((skill: string) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
