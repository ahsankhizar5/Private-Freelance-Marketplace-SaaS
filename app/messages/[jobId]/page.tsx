import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import ChatInterface from "@/components/messaging/chat-interface"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Briefcase } from "lucide-react"
import Link from "next/link"

export default async function MessagesPage({ params }: { params: { jobId: string } }) {
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

  // Determine the other user (admin or freelancer)
  let otherUser
  let canMessage = false

  if (currentUserProfile.role === "admin" && job.admin_id === currentUserProfile.id) {
    // Admin viewing messages - need to find the accepted freelancer
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
      otherUser = acceptedBid.freelancer
      canMessage = true
    }
  } else if (currentUserProfile.role === "freelancer") {
    // Freelancer viewing messages - check if they have an accepted bid
    const { data: userBid } = await supabase
      .from("bids")
      .select("status")
      .eq("job_id", params.jobId)
      .eq("freelancer_id", currentUserProfile.id)
      .single()

    if (userBid?.status === "accepted") {
      otherUser = job.admin
      canMessage = true
    }
  }

  if (!canMessage || !otherUser) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Access Restricted</CardTitle>
              <CardDescription>You can only message after a bid has been accepted for this job.</CardDescription>
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
                <h1 className="text-xl font-bold">Project Messages</h1>
                <p className="text-sm text-muted-foreground">{job.title}</p>
              </div>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {job.status}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ChatInterface jobId={params.jobId} currentUser={currentUserProfile} otherUser={otherUser} />
        </div>
      </div>
    </div>
  )
}
