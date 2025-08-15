import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, User, Calendar, Briefcase } from "lucide-react"
import Link from "next/link"
import BidForm from "@/components/jobs/bid-form"
import MessageButton from "@/components/messaging/message-button"
import WorkroomButton from "@/components/tasks/workroom-button"
import JobCompletionRating from "@/components/reviews/job-completion-rating"

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Get current user and verify freelancer role
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("users").select("role, full_name").eq("id", user.id).single()

  if (!profile || profile.role !== "freelancer") {
    redirect("/admin/dashboard")
  }

  // Get job details
  const { data: job } = await supabase
    .from("jobs")
    .select(`
      *,
      users!jobs_admin_id_fkey(full_name, rating, total_reviews)
    `)
    .eq("id", params.id)
    .single()

  if (!job) {
    notFound()
  }

  // Check if user has already bid on this job
  const { data: existingBid } = await supabase
    .from("bids")
    .select("*")
    .eq("job_id", params.id)
    .eq("freelancer_id", user.id)
    .single()

  // Get bid count for this job
  const { data: bids } = await supabase.from("bids").select("id").eq("job_id", params.id)

  const bidCount = bids?.length || 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Job Details</h1>
              <p className="text-muted-foreground">Review and apply to this opportunity</p>
            </div>
            <div className="flex items-center gap-2">
              {existingBid?.status === "accepted" && (
                <>
                  <WorkroomButton jobId={params.id} />
                  <MessageButton jobId={params.id} />
                </>
              )}
              <Link href="/freelancer/jobs">
                <Button variant="outline">Back to Jobs</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {job.status === "completed" && existingBid?.status === "accepted" && (
              <JobCompletionRating
                jobId={params.id}
                currentUserId={user.id}
                currentUserRole="freelancer"
                otherUserId={job.admin_id}
                otherUserName={job.users.full_name}
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
                        <User className="h-4 w-4" />
                        <span>Posted by {job.users?.full_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{bidCount} proposals</span>
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

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

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

                {job.estimated_hours && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Est. Hours</span>
                    <span className="font-medium">{job.estimated_hours}h</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Client Info */}
            <Card>
              <CardHeader>
                <CardTitle>About the Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{job.users?.full_name}</p>
                  {job.users?.rating > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>⭐ {job.users.rating.toFixed(1)}</span>
                      <span>({job.users.total_reviews} reviews)</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bid Form or Status */}
            {job.status === "open" &&
              (existingBid ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Proposal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Bid Amount</span>
                        <span className="font-medium">${existingBid.bid_amount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge
                          variant={
                            existingBid.status === "accepted"
                              ? "default"
                              : existingBid.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {existingBid.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <BidForm jobId={params.id} />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
